/**
 * Greenstone Peptides — Fix Kit Descriptions
 * Run: node scripts/fix-kit-descriptions.mjs
 *
 * Patches the `description` field on all kit products (format == "kit").
 * Replaces old copy that referenced "prescribed protocol" and "physician guidance"
 * with accurate retail-friendly copy focused on contents and sourcing.
 * Safe to re-run — uses patch().set() so existing data is replaced, not duplicated.
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, '../.env.local');
const envFile = readFileSync(envPath, 'utf-8');
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

// ─── PORTABLE TEXT HELPER ─────────────────────────────────────────────────────

function block(key, style, text) {
  return {
    _key: key,
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _key: key + 's', _type: 'span', marks: [], text }],
  };
}

// ─── KIT DESCRIPTION ─────────────────────────────────────────────────────────

const kitDescription = [
  block('kit-h2', 'h2', "What's in a Greenstone Starter Kit?"),
  block('kit-p1', 'normal', "Everything you need to get started with injectable peptide therapy. Each kit is assembled with quality supplies for safe, sterile self-administration at home."),
  block('kit-h3-inc', 'h3', "Kit Contents"),
  block('kit-p2', 'normal', "Each starter kit includes: individually wrapped alcohol prep pads, insulin-style syringes with fine-gauge needles (29-31G), adhesive bandages, and a printed quick-start guide with step-by-step injection instructions. All supplies are single-use and sterile-packaged."),
  block('kit-h3-sizes', 'h3', "Available Sizes"),
  block('kit-p3', 'normal', "Kits come in 5-day, 10-day, 15-day, and 20-day configurations. Choose the size that matches your protocol length. If you're not sure which size you need, start with a 5-day kit to get comfortable with the process."),
  block('kit-h3-quality', 'h3', "Quality & Sourcing"),
  block('kit-p4', 'normal', "All supplies in Greenstone Peptides starter kits meet medical-grade standards. Syringes and needles are manufactured under ISO 13485 quality management standards and are individually sealed for sterility."),
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\nGreenstone Peptides — Fix Kit Descriptions');
  console.log(`Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // Fetch all kit products
  const kits = await client.fetch(
    `*[_type == "product" && format == "kit"]{ _id, name }`
  );

  console.log(`Found ${kits.length} kit product(s).\n`);

  if (kits.length === 0) {
    console.log('No kit products found. Nothing to update.');
    return;
  }

  let updated = 0;
  let failed = 0;

  for (const kit of kits) {
    try {
      await client
        .patch(kit._id)
        .set({ description: kitDescription })
        .commit();

      console.log(`  OK    ${kit.name} (${kit._id})`);
      updated++;
    } catch (err) {
      console.error(`  ERROR ${kit.name} (${kit._id}): ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone.`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Total processed: ${kits.length}\n`);
}

run().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
