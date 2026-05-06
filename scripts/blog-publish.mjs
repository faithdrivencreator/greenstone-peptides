/**
 * Greenstone Peptides — Daily Blog Publisher
 *
 * Reads a post JSON file written by Claude (in Cowork session) and pushes it
 * to Sanity as a PUBLISHED document (not a draft). Idempotent via _id.
 *
 * Usage:
 *   node scripts/blog-publish.mjs --post path/to/post.json
 *   node scripts/blog-publish.mjs --post path/to/post.json --dry-run
 *
 * Required env vars (read from .env.local):
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET
 *   - NEXT_PUBLIC_SANITY_API_VERSION
 *   - SANITY_API_TOKEN  (write-access)
 *   - NEXT_PUBLIC_SITE_URL  (used for verification)
 *
 * Expected post JSON shape (minimum):
 *   {
 *     "id": "post-2026-04-24-bpc157-vs-tb500",
 *     "title": "BPC-157 vs TB-500: Which Recovery Peptide Is Right For You?",
 *     "slug": "bpc157-vs-tb500-recovery-comparison",
 *     "excerpt": "Both BPC-157 and TB-500 are recovery peptides, but...",
 *     "seoTitle": "BPC-157 vs TB-500: Recovery Peptide Comparison Guide",
 *     "seoDescription": "Side-by-side comparison of BPC-157 and TB-500...",
 *     "tags": ["bpc-157", "tb-500", "recovery", "peptide-comparison"],
 *     "readingTime": 8,
 *     "featured": false,
 *     "body": [ /* Portable Text blocks * / ]
 *   }
 *
 * Optional:
 *   "publishedAt"  ISO 8601 — defaults to NOW
 *   "author"       defaults to author-greenstone-team
 *   "category"     string slug — looked up by ID `category-{slug}` if present
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── ENV LOADER ───────────────────────────────────────────────────────────────

const envPath = resolve(__dirname, '../.env.local');
if (!existsSync(envPath)) {
  console.error(`ERROR: .env.local not found at ${envPath}`);
  process.exit(1);
}
for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const REQUIRED = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN',
];
for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.error(`ERROR: Missing required env var ${k} in .env.local`);
    process.exit(1);
  }
}

// ─── ARG PARSER ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const postArgIdx = args.indexOf('--post');
if (postArgIdx === -1 || !args[postArgIdx + 1]) {
  console.error('ERROR: --post <path-to-post.json> is required');
  console.error('Example: node scripts/blog-publish.mjs --post scripts/blog/queue/2026-04-24.json');
  process.exit(1);
}
const postPath = resolve(args[postArgIdx + 1]);
if (!existsSync(postPath)) {
  console.error(`ERROR: Post file not found: ${postPath}`);
  process.exit(1);
}

const post = JSON.parse(readFileSync(postPath, 'utf-8'));

// ─── VALIDATION ───────────────────────────────────────────────────────────────

const REQUIRED_POST_FIELDS = ['id', 'title', 'slug', 'body'];
for (const f of REQUIRED_POST_FIELDS) {
  if (!post[f]) {
    console.error(`ERROR: Post is missing required field: ${f}`);
    process.exit(1);
  }
}
if (!Array.isArray(post.body) || post.body.length === 0) {
  console.error('ERROR: Post body must be a non-empty array of Portable Text blocks');
  process.exit(1);
}
if (post.seoTitle && post.seoTitle.length > 70) {
  console.warn(`WARN: seoTitle is ${post.seoTitle.length} chars (max 70). Will be rejected by Sanity.`);
}
if (post.seoDescription && post.seoDescription.length > 160) {
  console.warn(`WARN: seoDescription is ${post.seoDescription.length} chars (max 160). Will be rejected by Sanity.`);
}
if (post.excerpt && post.excerpt.length > 300) {
  console.warn(`WARN: excerpt is ${post.excerpt.length} chars (max 300). Will be rejected by Sanity.`);
}

// ─── BUILD DOCUMENT ───────────────────────────────────────────────────────────

const AUTHOR_REF = {
  _type: 'reference',
  _ref: post.author || 'author-greenstone-team',
};

const doc = {
  _id: post.id, // No "drafts." prefix → this is a PUBLISHED document
  _type: 'blogPost',
  title: post.title,
  slug: { _type: 'slug', current: post.slug },
  author: AUTHOR_REF,
  publishedAt: post.publishedAt || new Date().toISOString(),
  excerpt: post.excerpt || '',
  body: post.body,
  readingTime: post.readingTime || estimateReadingTime(post.body),
  featured: post.featured === true,
  seoTitle: post.seoTitle || post.title.slice(0, 70),
  seoDescription: post.seoDescription || (post.excerpt || '').slice(0, 160),
  tags: Array.isArray(post.tags) ? post.tags : [],
};

if (post.category) {
  doc.categories = [{ _type: 'reference', _ref: `category-${post.category}` }];
}
if (post.relatedProducts && Array.isArray(post.relatedProducts)) {
  doc.relatedProducts = post.relatedProducts.map((slug) => ({
    _type: 'reference',
    _ref: `product-${slug}`,
  }));
}
// mainImage: { assetId: "image-abc123-...", alt: "..." }
if (post.mainImage && post.mainImage.assetId) {
  doc.mainImage = {
    _type: 'image',
    asset: { _type: 'reference', _ref: post.mainImage.assetId },
    alt: post.mainImage.alt || post.title,
  };
}

function estimateReadingTime(body) {
  const text = body
    .filter((b) => b._type === 'block')
    .flatMap((b) => (b.children || []).map((c) => c.text || ''))
    .join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220)); // 220 wpm avg reading
}

// ─── PUBLISH ──────────────────────────────────────────────────────────────────

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

async function publish() {
  console.log(`\n📝 Publishing: ${doc.title}`);
  console.log(`   _id:  ${doc._id}`);
  console.log(`   slug: ${doc.slug.current}`);
  console.log(`   tags: ${doc.tags.join(', ') || '(none)'}`);
  console.log(`   reading time: ${doc.readingTime} min\n`);

  if (DRY_RUN) {
    console.log('🟡 DRY RUN — no Sanity write performed.');
    console.log('Document that WOULD be sent:');
    console.log(JSON.stringify(doc, null, 2).slice(0, 800) + '...\n');
    return { ok: true, dryRun: true, id: doc._id };
  }

  // Pre-flight: detect a draft of the same _id and discard it (auto-publish path)
  const draftId = `drafts.${doc._id}`;
  try {
    const existingDraft = await client.getDocument(draftId);
    if (existingDraft) {
      console.log(`   (Found existing draft ${draftId} — deleting before publish)`);
      await client.delete(draftId);
    }
  } catch {
    /* no draft — fine */
  }

  // createOrReplace makes this idempotent — safe to re-run for the same _id
  const result = await client.createOrReplace(doc);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';
  const url = `${siteUrl}/learn/${doc.slug.current}`;
  const listingUrl = `${siteUrl}/learn`;

  console.log(`✅ Published to Sanity: ${result._id}`);
  console.log(`🔗 Live URL: ${url}`);
  console.log(`📚 Listing: ${listingUrl}`);
  console.log(`   ⚠ Next.js ISR caches /learn for 5 min (revalidate = 300).`);
  console.log(`   New post appears in listing within 5 min, detail URL works on first visit.`);

  return { ok: true, id: result._id, url };
}

// ─── RUN-LOG ──────────────────────────────────────────────────────────────────

const RUN_LOG = resolve(__dirname, 'blog/publish-log.json');

function appendRunLog(entry) {
  let log;
  try {
    log = JSON.parse(readFileSync(RUN_LOG, 'utf-8'));
  } catch {
    log = { runs: [] };
  }
  log.runs.push(entry);
  if (log.runs.length > 365) log.runs = log.runs.slice(-365);
  writeFileSync(RUN_LOG, JSON.stringify(log, null, 2) + '\n', 'utf-8');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

publish()
  .then((res) => {
    appendRunLog({
      ts: new Date().toISOString(),
      title: doc.title,
      slug: doc.slug.current,
      id: doc._id,
      // Record the image treatment so the generator's anti-repeat picker can
      // see what we shipped recently and avoid stacking the same look.
      treatment: post.mainImage?.treatment || null,
      ...res,
    });
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Publish failed:', err.message);
    appendRunLog({
      ts: new Date().toISOString(),
      title: doc.title,
      slug: doc.slug.current,
      id: doc._id,
      ok: false,
      error: err.message,
    });
    process.exit(1);
  });
