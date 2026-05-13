import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
if (!existsSync(envPath)) { console.error('ERROR: .env.local not found'); process.exit(1); }
for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

const DOC_ID = 'post-2026-05-11-mots-c';

const imageInserts = [
  {
    afterKey: 'p-payoff',
    block: {
      _type: 'image', _key: 'img-opening-infographic',
      asset: { _type: 'reference', _ref: 'image-11887755d6535d31b1d5f1c5f791756f1725aeb3-2752x1536-png' },
      alt: 'Mitochondrial MOTS-c signaling pathway overview from mitochondria to AMPK activation, MOTS-c mitochondrial peptide',
    },
  },
  {
    afterKey: 'p-s1-1',
    block: {
      _type: 'image', _key: 'img-s1-contextual',
      asset: { _type: 'reference', _ref: 'image-9f94a242550938f643d492c20ae12d8eec9ae29d-2752x1536-png' },
      alt: 'Molecular biology research journal and scientific materials on dark slate surface, MOTS-c mitochondrial peptide research',
    },
  },
  {
    afterKey: 'p-mech1',
    block: {
      _type: 'image', _key: 'img-s1-supporting',
      asset: { _type: 'reference', _ref: 'image-1cc2bec6b0436f0750c7c282caee02480d1fa34c-2752x1536-png' },
      alt: 'Scientific cellular energy metabolism visualization with dark stone and crystalline elements, MOTS-c AMPK pathway research',
    },
  },
  {
    afterKey: 'h2-s3',
    block: {
      _type: 'image', _key: 'img-s3-lifestyle',
      asset: { _type: 'reference', _ref: 'image-3ed0013228c7cd8e22434d1bccc96547bacd0ac2-2752x1536-png' },
      alt: 'Research notebook and morning wellness ritual on warm wooden surface, MOTS-c mitochondrial peptide longevity research',
    },
  },
  {
    afterKey: 'h2-s4',
    block: {
      _type: 'image', _key: 'img-s4-benefits',
      asset: { _type: 'reference', _ref: 'image-fa81de2382a67d8a57ad1fb542275806b0382a46-2752x1536-png' },
      alt: 'Premium laboratory quality assurance tools and sterile compounding standards, MOTS-c peptide sourcing',
    },
  },
];

async function patch() {
  const doc = await client.fetch('*[_id == $id][0]{ body }', { id: DOC_ID });
  if (!doc) { console.error('Doc not found:', DOC_ID); process.exit(1); }

  const body = [...doc.body];
  console.log('Current body blocks:', body.length);

  for (const { afterKey, block } of imageInserts) {
    const idx = body.findIndex(b => b._key === afterKey);
    if (idx === -1) { console.warn('Anchor key not found:', afterKey); continue; }
    body.splice(idx + 1, 0, block);
    console.log('  Inserted', block._key, 'after', afterKey);
  }

  console.log('New body blocks:', body.length);
  await client.patch(DOC_ID).set({ body }).commit();
  console.log('Patched successfully.');
}

patch().catch(err => { console.error(err.message); process.exit(1); });
