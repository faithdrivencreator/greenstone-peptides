/**
 * Greenstone Peptides — Upload Image URL to Sanity
 *
 * Downloads an image from a URL (e.g. from Higgs Field CDN) and uploads it
 * to Sanity as a blog-hero image asset. Part of the Higgs Field image flow.
 *
 * Usage:
 *   node scripts/upload-url-to-sanity.mjs \
 *     --url "https://cdn.higgsfield.ai/..." \
 *     --filename "cinematic-dark-tirzepatide-dosing-1234567890.jpg" \
 *     --alt "Cinematic dark studio photograph for ..."
 *
 * Output (stdout, JSON):
 *   {"assetId":"image-abc123-2752x1536-jpg","filename":"..."}
 *
 * Required env vars (.env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LIBRARY_DIR = join(ROOT, 'public', 'images', 'blog-heroes');

// ─── ENV ──────────────────────────────────────────────────────────────────────

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
    console.error(`ERROR: Missing env var ${k} in .env.local`);
    process.exit(1);
  }
}

// ─── ARGS ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function arg(name, required = true) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || !args[idx + 1]) {
    if (required) { console.error(`ERROR: --${name} <value> is required`); process.exit(1); }
    return null;
  }
  return args[idx + 1];
}

const imageUrl  = arg('url');
const filename  = arg('filename');
const altText   = arg('alt', false) || '';

if (!imageUrl.startsWith('http')) {
  console.error(`ERROR: --url must be a full https:// URL`);
  process.exit(1);
}

// ─── DOWNLOAD ─────────────────────────────────────────────────────────────────

async function downloadImage(url) {
  console.error(`⬇️  Downloading image from: ${url.slice(0, 80)}...`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Greenstone-BlogPublisher/1.0' },
  });
  if (!res.ok) {
    throw new Error(`Download failed: HTTP ${res.status} from ${url}`);
  }
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const buffer = Buffer.from(await res.arrayBuffer());
  console.error(`✅ Downloaded ${(buffer.length / 1024).toFixed(1)} KB  (${contentType})`);
  return { buffer, contentType };
}

// ─── SANITY UPLOAD ────────────────────────────────────────────────────────────

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token:      process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn:     false,
});

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  try {
    const { buffer, contentType } = await downloadImage(imageUrl);

    // Save local archival copy
    mkdirSync(LIBRARY_DIR, { recursive: true });
    const localPath = join(LIBRARY_DIR, filename);
    writeFileSync(localPath, buffer);
    console.error(`💾 Saved local copy: public/images/blog-heroes/${filename}`);

    // Upload to Sanity
    console.error('☁️  Uploading to Sanity...');
    const asset = await sanity.assets.upload('image', buffer, {
      filename,
      contentType,
    });
    console.error(`✅ Sanity asset ID: ${asset._id}`);

    const out = { assetId: asset._id, filename, alt: altText };
    console.log(JSON.stringify(out));
    process.exit(0);
  } catch (err) {
    console.error(`❌ Upload failed: ${err.message}`);
    process.exit(1);
  }
})();
