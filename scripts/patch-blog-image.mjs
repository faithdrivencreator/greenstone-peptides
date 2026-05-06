/**
 * Greenstone Peptides — Patch a published blog post's mainImage
 *
 * Used to swap the hero image on a post that has already been published to
 * Sanity, without re-publishing the entire document.
 *
 * Usage:
 *   node scripts/patch-blog-image.mjs \
 *     --id post-2026-04-25-bpc157-10mg-spotlight \
 *     --asset image-6254e6ebcfa5d7f66636bba0c805a73be6f13850-2752x1536-jpg \
 *     --alt "Stylized anatomical illustration of tendon fibers and peptide chain"
 *
 *   node scripts/patch-blog-image.mjs ... --dry-run
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const id = arg('id');
const asset = arg('asset');
const alt = arg('alt');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

(async () => {
  try {
    console.log(`🔧 Patching mainImage on ${id}`);
    console.log(`   asset: ${asset}`);
    console.log(`   alt:   ${alt}`);

    if (DRY_RUN) {
      console.log('🟡 DRY RUN — no Sanity write performed.');
      process.exit(0);
    }

    const result = await client
      .patch(id)
      .set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset },
          alt,
        },
      })
      .commit();

    console.log(`✅ Patched: ${result._id} (rev ${result._rev})`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ Patch failed: ${err.message}`);
    process.exit(1);
  }
})();
