/**
 * Greenstone Peptides — Hero Image Picker (Curated Library)
 *
 * Reads images from public/images/blog-heroes/ and picks the best fit
 * for today's post. No API call — uses files Pete batch-generated manually
 * in ChatGPT/Higgs Field. Uploads the chosen image to Sanity (dedupes by
 * hash, so re-uploads return the same assetId) and outputs JSON for the
 * scheduled task to attach to the post's `mainImage` field.
 *
 * Library convention: filenames are prefixed with track and may include
 * keyword hints, e.g.:
 *   evergreen-glp1-vials.png        → track: evergreen, keywords: glp1, vials
 *   evergreen-bpc157-marble.png     → track: evergreen, keywords: bpc157, marble
 *   spotlight-vial-amber.png        → track: spotlight, keywords: vial, amber
 *   faq-molecular-helix.png         → track: faq, keywords: molecular, helix
 *
 * Picker logic:
 *   1. Filter to files matching today's track prefix
 *   2. Score by keyword overlap with --tags
 *   3. Prefer images NOT used in the last 14 days (anti-repeat)
 *   4. Tiebreak randomly
 *
 * Usage:
 *   node scripts/pick-blog-image.mjs \
 *     --track evergreen \
 *     --topic "BPC-157 vs TB-500 recovery comparison" \
 *     --tags "bpc-157,tb-500,recovery" \
 *     --slug bpc157-vs-tb500
 *
 *   node scripts/pick-blog-image.mjs ... --dry-run
 *
 * Output (stdout LAST line, JSON):
 *   {"assetId":"image-abc123-...","alt":"Premium clinical photograph...",
 *    "filename":"evergreen-glp1-vials.png"}
 *
 * Required env (read from .env.local):
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET
 *   - SANITY_API_TOKEN
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LIBRARY_DIR = join(ROOT, 'public', 'images', 'blog-heroes');
const USAGE_LOG = join(__dirname, 'blog', 'hero-usage-log.json');

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

for (const k of ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_TOKEN']) {
  if (!process.env[k]) {
    console.error(`ERROR: Missing required env var ${k} in .env.local`);
    process.exit(1);
  }
}

// ─── ARG PARSER ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function arg(name, required = true) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || !args[idx + 1]) {
    if (required) {
      console.error(`ERROR: --${name} <value> is required`);
      process.exit(1);
    }
    return null;
  }
  return args[idx + 1];
}

const DRY_RUN = args.includes('--dry-run');
const track = arg('track');
const topic = arg('topic');
const tagsRaw = arg('tags', false);
const slug = arg('slug', false);
const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : [];

if (!['evergreen', 'spotlight', 'faq'].includes(track)) {
  console.error(`ERROR: --track must be one of: evergreen, spotlight, faq (got "${track}")`);
  process.exit(1);
}

// ─── LIBRARY SCAN ─────────────────────────────────────────────────────────────

if (!existsSync(LIBRARY_DIR)) {
  console.error(`ERROR: Library directory missing: ${LIBRARY_DIR}`);
  console.error('Generate hero images manually (e.g. in ChatGPT/Higgs Field) and drop them here.');
  console.error('Naming convention: <track>-<keyword>-<keyword>.png');
  console.error('Example: evergreen-glp1-vials.png  spotlight-bpc157-amber.png  faq-molecular-helix.png');
  process.exit(1);
}

const VALID_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const allFiles = readdirSync(LIBRARY_DIR)
  .filter((f) => VALID_EXT.has(extname(f).toLowerCase()))
  .filter((f) => !f.startsWith('.'));

const trackFiles = allFiles.filter((f) => f.toLowerCase().startsWith(`${track}-`));

if (trackFiles.length === 0) {
  console.error(`ERROR: No images found for track "${track}" in ${LIBRARY_DIR}`);
  console.error(`Files in library: ${allFiles.length}`);
  console.error('Need files prefixed with "' + track + '-" (e.g. ' + track + '-vials.png)');
  process.exit(1);
}

// ─── USAGE LOG (anti-repeat) ──────────────────────────────────────────────────

function loadUsageLog() {
  try {
    return JSON.parse(readFileSync(USAGE_LOG, 'utf-8'));
  } catch {
    return { uses: [] };
  }
}

function saveUsageLog(log) {
  if (log.uses.length > 500) log.uses = log.uses.slice(-500);
  writeFileSync(USAGE_LOG, JSON.stringify(log, null, 2) + '\n', 'utf-8');
}

const usageLog = loadUsageLog();
const recentlyUsed = new Set(
  usageLog.uses
    .filter((u) => Date.now() - new Date(u.ts).getTime() < 14 * 24 * 3600 * 1000)
    .map((u) => u.filename)
);

// ─── SCORE & PICK ─────────────────────────────────────────────────────────────

function scoreFile(filename, tags) {
  // Strip track prefix + extension, get keyword tokens
  const stem = basename(filename, extname(filename))
    .replace(new RegExp(`^${track}-`, 'i'), '')
    .toLowerCase();
  const tokens = stem.split(/[-_\s]+/).filter(Boolean);

  // Keyword match score: count how many post tags appear in filename tokens
  let kw = 0;
  for (const tag of tags) {
    const norm = tag.replace(/[^a-z0-9]+/g, '');
    if (tokens.some((t) => t.replace(/[^a-z0-9]+/g, '').includes(norm) || norm.includes(t.replace(/[^a-z0-9]+/g, '')))) {
      kw++;
    }
  }
  // Recency penalty
  const recencyPenalty = recentlyUsed.has(filename) ? -10 : 0;
  // Random tiebreaker
  const jitter = Math.random();
  return kw * 100 + recencyPenalty + jitter;
}

const ranked = trackFiles
  .map((f) => ({ filename: f, score: scoreFile(f, tags) }))
  .sort((a, b) => b.score - a.score);

const picked = ranked[0];
console.error(`📸 Library has ${trackFiles.length} ${track} images.`);
console.error(`   Top 3 ranked: ${ranked.slice(0, 3).map((r) => `${r.filename} (${r.score.toFixed(2)})`).join(', ')}`);
console.error(`✓ Picked: ${picked.filename}`);

// ─── ALT TEXT ─────────────────────────────────────────────────────────────────

function buildAltText(track, topic) {
  const lead = {
    evergreen: 'Premium editorial photograph illustrating',
    spotlight: 'Clinical product photograph for',
    faq: 'Abstract scientific illustration related to',
  }[track];
  return `${lead} ${topic}`.slice(0, 280);
}
const altText = buildAltText(track, topic);

// ─── SANITY UPLOAD (idempotent via dedup) ─────────────────────────────────────

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

async function uploadToSanity(filepath, filename) {
  const buffer = readFileSync(filepath);
  const ext = extname(filename).toLowerCase().replace('.', '');
  const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  const asset = await sanity.assets.upload('image', buffer, { filename, contentType });
  return asset._id;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  const filepath = join(LIBRARY_DIR, picked.filename);

  if (DRY_RUN) {
    const out = {
      assetId: null,
      alt: altText,
      filename: picked.filename,
      dryRun: true,
    };
    console.log(JSON.stringify(out));
    process.exit(0);
  }

  try {
    console.error(`☁️  Uploading to Sanity (dedupe by hash)...`);
    const assetId = await uploadToSanity(filepath, picked.filename);
    console.error(`✅ Asset ID: ${assetId}`);

    usageLog.uses.push({
      ts: new Date().toISOString(),
      track,
      slug: slug || null,
      filename: picked.filename,
      assetId,
    });
    saveUsageLog(usageLog);

    const out = { assetId, alt: altText, filename: picked.filename };
    console.log(JSON.stringify(out));
    process.exit(0);
  } catch (err) {
    console.error(`❌ Upload failed: ${err.message}`);
    process.exit(1);
  }
})();
