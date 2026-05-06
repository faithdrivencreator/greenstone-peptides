/**
 * Greenstone Peptides — Patch Hero Image into an Existing Blog Post
 *
 * One-off helper: take an image file + a Sanity post _id, upload the image,
 * and patch the post's mainImage field. Useful for adding heroes to posts
 * that were published without one (e.g. before the image system was wired).
 *
 * Usage:
 *   node scripts/patch-blog-hero.mjs \
 *     --post-id post-2026-04-24-glp1-generation-gap \
 *     --image public/images/blog-heroes/glp1-comparison.png \
 *     --alt "Premium editorial photograph of three glass pharmaceutical vials"
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, extname, basename, isAbsolute, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

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

const postId = arg('post-id');
const imageArg = arg('image');
const altText = arg('alt', false) || 'Greenstone Peptides editorial photograph';

const imagePath = isAbsolute(imageArg) ? imageArg : join(ROOT, imageArg);
if (!existsSync(imagePath)) {
  console.error(`ERROR: Image file not found: ${imagePath}`);
  process.exit(1);
}

// ─── SANITY CLIENT ────────────────────────────────────────────────────────────

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log(`📥 Patching hero image into post "${postId}"`);
  console.log(`   Image: ${imagePath}`);

  // 1. Verify post exists
  const existing = await sanity.getDocument(postId);
  if (!existing) {
    console.error(`❌ Post "${postId}" not found in Sanity. Aborting.`);
    process.exit(1);
  }
  console.log(`   Existing title: "${existing.title}"`);

  // 2. Upload image
  const buffer = readFileSync(imagePath);
  const ext = extname(imagePath).toLowerCase().replace('.', '');
  const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  console.log(`☁️  Uploading image to Sanity...`);
  const asset = await sanity.assets.upload('image', buffer, {
    filename: basename(imagePath),
    contentType,
  });
  console.log(`   Asset _id: ${asset._id}`);

  // 3. Patch post
  console.log(`📝 Patching post.mainImage...`);
  await sanity
    .patch(postId)
    .set({
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: altText,
      },
    })
    .commit();

  const slug = existing.slug?.current;
  const url = slug
    ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store'}/learn/${slug}`
    : '(no slug on post)';

  console.log(`✅ Patched. Live URL: ${url}`);
  console.log(`   Allow ~5 min for Next.js ISR to refresh the page.`);
  process.exit(0);
})().catch((err) => {
  console.error(`❌ Patch failed: ${err.message}`);
  process.exit(1);
});
