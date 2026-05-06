/**
 * Greenstone Peptides — Breaking News Monitor (Track B)
 *
 * Scrapes a handful of regulatory + scientific news sources via the Firecrawl CLI,
 * filters for items within the last 24h, dedupes against seen-urls.json, and
 * drafts a 400-600 word summary post per fresh item via the Anthropic SDK.
 * Writes each post as a Sanity DRAFT (drafts.* _id). Does NOT auto-publish.
 *
 * Required env vars:
 *   - ANTHROPIC_API_KEY
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET   (defaults to "production")
 *   - SANITY_API_TOKEN
 *   - FIRECRAWL_API_KEY            (optional — falls back to shared key)
 *
 * Usage:
 *   node scripts/blog/news-monitor.mjs             # live run
 *   node scripts/blog/news-monitor.mjs --dry-run   # no scrape, no API, no writes
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileP = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');
const SEEN_PATH = resolve(__dirname, 'seen-urls.json');

// ─── ENV ──────────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(PROJECT_ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}
loadEnv();

const DRY_RUN = process.argv.includes('--dry-run');
const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY || 'fc-154fe39152e94fc0bf97fccad833ba01';

const SOURCES = [
  'https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages',
  'https://www.fda.gov/news-events/fda-newsroom/press-announcements',
  'https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide+OR+tirzepatide+OR+BPC-157+OR+retatrutide&format=rss',
  'https://www.hhs.gov/about/news/index.html',
];

// ─── AUTHOR REF ───────────────────────────────────────────────────────────────
const AUTHOR_REF = { _type: 'reference', _ref: 'author-greenstone-team' };

// ─── BRAND VOICE SYSTEM PROMPT (news flavor) ──────────────────────────────────
const SYSTEM_PROMPT = `You are Dr. Michael Chen, PharmD — the editorial byline for Greenstone Peptides, a US-based retail peptide store.

You are writing a short news-summary blog post (400-600 words) about a fresh item from a regulatory or scientific source.

NON-NEGOTIABLE VOICE RULES:
- This is a retail store. It is NOT a clinic, telehealth service, medical practice, or pharmacy.
- Do NOT use: patient, clinician, prescriber, MSO, pharmacist, protocol, drug interaction, treat, treatment, therapy plan, medical advice, consult your doctor.
- Use instead: readers, the research community, published research, educational reference.
- Do NOT name any lab partner. Never identify the store's compounding lab.
- Use third person. No "we", "our patients", "our pharmacist", "our clinic".
- Do NOT give dosing instructions or recommendations.

FORBIDDEN WORDS (never use):
synergy, cutting-edge, game-changer, unlock, leverage, seamless, revolutionary, groundbreaking, paradigm, delve, dive into, embark.

STYLE:
- Active voice. Short, direct sentences.
- News-brief tone: what happened, context, what it signals.
- Reference the source publication by name in the prose.

STRUCTURE (400-600 words):
1. Opening paragraph: what the news is, in one paragraph
2. H2: Context — background the reader needs
3. H2: What It Signals — the takeaway for the peptide community
4. Closing paragraph with soft pointer to relevant product category if natural

OUTPUT FORMAT:
Return ONLY a single valid JSON object (no markdown fences) matching:

{
  "title": "string — under 70 chars",
  "excerpt": "string — 2 sentences, under 280 chars",
  "seoTitle": "string — under 70 chars",
  "seoDescription": "string — 150-160 chars",
  "tags": ["array", "of", "tags"],
  "readingTime": 3,
  "body": [
    { "type": "p", "text": "..." },
    { "type": "h2", "text": "..." }
  ]
}

Body block types allowed: "p", "h2", "h3", "blockquote". Target 6-10 blocks.`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function loadSeen() {
  return JSON.parse(readFileSync(SEEN_PATH, 'utf-8'));
}

function saveSeen(seen) {
  writeFileSync(SEEN_PATH, JSON.stringify(seen, null, 2) + '\n', 'utf-8');
}

function toPortableText(body) {
  return body.map((b, i) => {
    const key = `nblk-${i}-${Math.random().toString(36).slice(2, 8)}`;
    const style = b.type === 'p' ? 'normal' : b.type;
    return {
      _type: 'block',
      _key: key,
      style,
      markDefs: [],
      children: [{ _type: 'span', _key: key + 's', text: b.text, marks: [] }],
    };
  });
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

/**
 * Parse Firecrawl CLI markdown output to extract candidate item URLs + titles.
 * Keeps only http(s) links, dedupes, returns array of { url, title }.
 */
function extractItems(markdown, sourceUrl) {
  const items = [];
  const seen = new Set();
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let m;
  while ((m = linkRe.exec(markdown)) !== null) {
    const title = m[1].trim();
    const url = m[2].trim();
    if (seen.has(url)) continue;
    seen.add(url);
    // Skip nav links (e.g., "Home", "Menu", short/fluff titles)
    if (title.length < 25) continue;
    items.push({ url, title, source: sourceUrl });
  }
  return items;
}

async function scrapeSource(url) {
  // firecrawl scrape <url> --only-main-content
  // Pipe API key via env for the CLI.
  try {
    const { stdout } = await execFileP(
      'firecrawl',
      ['scrape', url, '--only-main-content'],
      { env: { ...process.env, FIRECRAWL_API_KEY: FIRECRAWL_KEY }, maxBuffer: 10 * 1024 * 1024 }
    );
    return stdout;
  } catch (err) {
    console.error(`  [WARN] Firecrawl failed for ${url}:`, err.message);
    return '';
  }
}

async function draftNewsPost(item) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userPrompt = `Write a 400-600 word news summary post.

Item title: ${item.title}
Source URL: ${item.url}
Source publication: ${item.source}

Use the item title and what a reader could reasonably learn from a public regulatory/news announcement. If the item is a published research abstract, summarize the finding and its context. Do NOT invent specific numbers or direct quotes — stay at the summary level.

Return only the JSON object per the system prompt spec.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = response.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  return JSON.parse(cleaned);
}

function buildSanityDoc(item, drafted) {
  const now = Date.now();
  const slug = slugify(drafted.title || item.title) + '-' + new Date().toISOString().slice(0, 10);
  return {
    _id: `drafts.news-${slug}-${now}`,
    _type: 'blogPost',
    title: drafted.title,
    slug: { _type: 'slug', current: slug },
    author: AUTHOR_REF,
    publishedAt: new Date().toISOString(),
    excerpt: drafted.excerpt,
    body: toPortableText(drafted.body || []),
    readingTime: drafted.readingTime || 3,
    featured: false,
    seoTitle: drafted.seoTitle,
    seoDescription: drafted.seoDescription,
    tags: drafted.tags || ['news'],
  };
}

function getSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    useCdn: false,
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export async function runNewsMonitor({ dryRun = DRY_RUN } = {}) {
  if (dryRun) {
    return {
      ok: true,
      track: 'news',
      dryRun: true,
      sources: SOURCES,
      action: `Would firecrawl ${SOURCES.length} sources, filter last-24h items, dedupe against seen-urls.json, draft 400-600 word Sonnet posts, and write Sanity drafts.`,
    };
  }

  const seen = loadSeen();
  const seenSet = new Set(seen.urls);
  const allFresh = [];

  for (const src of SOURCES) {
    const md = await scrapeSource(src);
    if (!md) continue;
    const items = extractItems(md, src).filter((it) => !seenSet.has(it.url));
    // Keep only the top 2 items per source to avoid runaway generation
    allFresh.push(...items.slice(0, 2));
  }

  if (allFresh.length === 0) {
    return { ok: true, track: 'news', fresh: 0, action: 'no-fresh-items' };
  }

  const client = getSanityClient();
  const results = [];

  for (const item of allFresh) {
    try {
      const drafted = await draftNewsPost(item);
      const doc = buildSanityDoc(item, drafted);
      const created = await client.create(doc);
      seenSet.add(item.url);
      results.push({ ok: true, sanityId: created._id, url: item.url, title: doc.title });
    } catch (err) {
      results.push({ ok: false, url: item.url, error: err.message });
    }
  }

  saveSeen({ urls: Array.from(seenSet) });

  return {
    ok: true,
    track: 'news',
    fresh: allFresh.length,
    results,
  };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  runNewsMonitor()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.ok ? 0 : 1);
    })
    .catch((err) => {
      console.error('News monitor error:', err);
      process.exit(1);
    });
}
