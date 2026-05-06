/**
 * Greenstone Peptides — Evergreen Blog Generator (Track A)
 *
 * Picks the next pending topic from scripts/blog/topic-queue.json,
 * drafts a ~1500-word article via the Anthropic SDK, and writes it
 * to Sanity as a DRAFT (drafts.* _id). Does NOT auto-publish.
 *
 * Required env vars:
 *   - ANTHROPIC_API_KEY       Anthropic API key for drafting
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET     (defaults to "production")
 *   - SANITY_API_TOKEN        Sanity write token
 *
 * Usage:
 *   node scripts/blog-evergreen-generate.mjs            # generate + write draft
 *   node scripts/blog-evergreen-generate.mjs --dry-run  # log what would happen, no writes, no API calls
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const QUEUE_PATH = resolve(__dirname, 'blog/topic-queue.json');

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

// ─── AUTHOR REF ───────────────────────────────────────────────────────────────
const AUTHOR_REF = { _type: 'reference', _ref: 'author-greenstone-team' };

// ─── BRAND VOICE SYSTEM PROMPT ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Dr. Michael Chen, PharmD — the editorial byline for Greenstone Peptides, a US-based retail peptide store.

Write educational blog content that reads like it's from a knowledgeable retail guide, not a clinic or pharmacy.

NON-NEGOTIABLE VOICE RULES:
- This is a retail store. It is NOT a clinic, telehealth service, medical practice, or pharmacy.
- Do NOT use the words: patient, clinician, prescriber, MSO, pharmacist, protocol, drug interaction, treat, treatment, therapy plan, medical advice, consult your doctor.
- Instead, refer to: readers, shoppers, researchers, the research community, published research, educational reference.
- Do NOT name any lab partner. The store sources from a US compounding lab — never identify it by name.
- Refer to yourself as "Dr. Michael Chen" only in the byline — NEVER say "I" or "my team" or "we at the pharmacy".
- Use third person throughout: "the research shows", "published trials report", "readers often ask".
- Do NOT give dosing instructions, do NOT recommend anyone take anything. Present research-based information only.
- Do NOT use phrases like "our patients", "our pharmacist", "our clinic", "we prescribe", "we recommend".

FORBIDDEN WORDS (Fluid Faith Solutions copy bans — never use):
synergy, cutting-edge, game-changer, unlock, leverage, seamless, revolutionary, groundbreaking, paradigm, delve, dive into, embark.

STYLE RULES:
- Active voice. Short, direct sentences.
- No excessive exclamation points (zero is fine).
- Avoid passive constructions.
- Cite published research by last-name-and-year when referencing findings (e.g., "Wilding et al., 2021 — NEJM").
- Open with a concrete hook, not a generic intro.

STRUCTURE (target ~1500 words):
1. Opening hook paragraph (1 short paragraph, no heading)
2. Several H2 sections with 2–4 paragraphs each
3. Optional H3 subsections where useful
4. Closing section ending with a soft call-to-action to browse the related product category on the store

OUTPUT FORMAT:
Return ONLY a single valid JSON object (no markdown fences, no commentary) with this exact shape:

{
  "title": "string — under 70 chars, matches the provided topic",
  "excerpt": "string — 2 sentences, under 280 chars, hooks the reader",
  "seoTitle": "string — under 70 chars, SEO-tuned",
  "seoDescription": "string — 150-160 chars, includes primary keyword",
  "tags": ["array", "of", "lowercase", "tags"],
  "readingTime": 7,
  "body": [
    { "type": "p", "text": "opening paragraph prose here" },
    { "type": "h2", "text": "First section heading" },
    { "type": "p", "text": "paragraph prose here" },
    { "type": "h3", "text": "optional subsection" },
    { "type": "p", "text": "more prose" }
  ]
}

Body blocks support types: "p" (paragraph), "h2", "h3", "blockquote". Nothing else. Target 12-22 body blocks total for ~1500 words.`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function loadQueue() {
  const raw = readFileSync(QUEUE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveQueue(queue) {
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n', 'utf-8');
}

function pickNextTopic(queue) {
  return queue.topics.find((t) => t.status === 'pending') || null;
}

function markPublished(queue, slug) {
  const t = queue.topics.find((x) => x.slug === slug);
  if (t) {
    t.status = 'published';
    t.publishedAt = new Date().toISOString();
  }
}

/** Convert the simple block-prose structure from Claude into Sanity PortableText. */
function toPortableText(body) {
  return body.map((b, i) => {
    const key = `blk-${i}-${Math.random().toString(36).slice(2, 8)}`;
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

function buildUserPrompt(topic) {
  return `Write a ~1500-word educational blog post for Greenstone Peptides.

Topic slug: ${topic.slug}
Working title: ${topic.title}
Primary keywords: ${topic.keywords.join(', ')}
Editorial angle: ${topic.angle}

Return only the JSON object per the system prompt spec.`;
}

async function draftWithAnthropic(topic) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }
  // Dynamic import so --dry-run does not require the SDK to be resolvable at load time.
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(topic) }],
  });

  const text = response.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();

  // Strip possible ```json fences defensively
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  return JSON.parse(cleaned);
}

function buildSanityDoc(topic, drafted) {
  const now = Date.now();
  return {
    _id: `drafts.blog-${topic.slug}-${now}`,
    _type: 'blogPost',
    title: drafted.title || topic.title,
    slug: { _type: 'slug', current: topic.slug },
    author: AUTHOR_REF,
    publishedAt: new Date().toISOString(),
    excerpt: drafted.excerpt,
    body: toPortableText(drafted.body || []),
    readingTime: drafted.readingTime || 7,
    featured: false,
    seoTitle: drafted.seoTitle,
    seoDescription: drafted.seoDescription,
    tags: drafted.tags || topic.keywords,
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
export async function runEvergreen({ dryRun = DRY_RUN } = {}) {
  const queue = loadQueue();
  const topic = pickNextTopic(queue);

  if (!topic) {
    return { ok: false, track: 'evergreen', reason: 'queue-empty' };
  }

  if (dryRun) {
    return {
      ok: true,
      track: 'evergreen',
      dryRun: true,
      picked: { slug: topic.slug, title: topic.title },
      action: `Would draft ~1500 words via Sonnet, write Sanity draft drafts.blog-${topic.slug}-<ts>, then mark topic published.`,
    };
  }

  const drafted = await draftWithAnthropic(topic);
  const doc = buildSanityDoc(topic, drafted);

  const client = getSanityClient();
  const created = await client.create(doc);

  markPublished(queue, topic.slug);
  saveQueue(queue);

  return {
    ok: true,
    track: 'evergreen',
    picked: { slug: topic.slug, title: topic.title },
    sanityId: created._id,
    title: doc.title,
  };
}

// CLI entry
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  runEvergreen()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.ok ? 0 : 1);
    })
    .catch((err) => {
      console.error('Evergreen generator error:', err);
      process.exit(1);
    });
}
