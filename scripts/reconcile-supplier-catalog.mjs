#!/usr/bin/env node
// Reconciles /tmp/greenstone-supplier-catalog.json against src/data/products.ts.
// Uses token-based fingerprint matching (compound + strength + volume/count).

import { readFileSync } from 'fs';
import { resolve } from 'path';

const supplier = JSON.parse(readFileSync('/tmp/greenstone-supplier-catalog.json', 'utf-8'));
const supplierProducts = supplier.filter(s => !['shipping-fee', 'test'].includes(s.type));

const src = readFileSync(resolve(process.cwd(), 'src/data/products.ts'), 'utf-8');
const productMatches = [...src.matchAll(/\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"slug":\s*"([^"]+)"[\s\S]*?"price":\s*(\d+(?:\.\d+)?)[\s\S]*?"active":\s*(true|false)\s*\}/g)];
const local = productMatches.map(m => ({
  id: m[1], name: m[2], slug: m[3], price: Number(m[4]), active: m[5] === 'true',
}));

// Fingerprint extractor: returns a string like "tirzepatide|10mg|3ml" for matching.
// Strips format keywords, normalizes strength/volume tokens.
function fingerprint(name) {
  let s = name.toLowerCase();
  // Special-case kits
  const kitMatch = s.match(/(\d+)[\s-]*day.*kit/);
  if (kitMatch) return `kit|${kitMatch[1]}day`;
  // Compound names with hyphens and special chars
  s = s.replace(/[(),]/g, ' ');
  // Pull out numeric tokens of interest: strength (mg, mg/ml), volume (ml), count (ct, tablets)
  const tokens = [];
  // Compound name = first 1-2 words before a number
  const compoundMatch = s.match(/^([a-z\-+\/]+(?:\s+[a-z\-+\/]+)?)/);
  let compound = compoundMatch ? compoundMatch[1].trim() : '';
  // Normalize: tb-500, bpc-157, ghk-cu, nad+, mots-c — drop alt names in parens
  compound = compound.split(/\s+/)[0]; // first word only for compound id
  tokens.push(compound);
  // Strength: e.g. "10mg/ml", "10mg", "55/22mg", "20mg/200mg"
  const strengthMatches = [...s.matchAll(/(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)*)\s*mg(?:\/ml)?/g)];
  if (strengthMatches.length) {
    tokens.push(strengthMatches[0][1] + 'mg');
  }
  // Volume: prefer the explicit "Nml" or "(Nml vial)"
  const volMatches = [...s.matchAll(/(\d+(?:\.\d+)?)\s*ml\b/g)];
  if (volMatches.length) {
    // Take last ml number (avoid mg/ml confusion)
    tokens.push(volMatches[volMatches.length - 1][1] + 'ml');
  }
  // Count: ODT/tablets
  const ctMatches = s.match(/(\d+)\s*(?:ct|tablet)/);
  if (ctMatches) tokens.push(ctMatches[1] + 'ct');
  // Format hint for ODT/nasal/cream
  if (/\bodt\b|tablet/.test(s)) tokens.push('odt');
  if (/nasal\s*spray/.test(s)) tokens.push('nasal');
  return tokens.join('|');
}

// Build maps
const supplierByFp = new Map();
for (const s of supplierProducts) {
  const fp = fingerprint(s.name);
  if (!supplierByFp.has(fp)) supplierByFp.set(fp, []);
  supplierByFp.get(fp).push(s);
}
const localByFp = new Map();
for (const p of local) {
  const fp = fingerprint(p.name);
  if (!localByFp.has(fp)) localByFp.set(fp, []);
  localByFp.get(fp).push(p);
}

// Matched
const matched = [];
const missingOnSite = [];
const orphans = [];

for (const [fp, sArr] of supplierByFp) {
  if (localByFp.has(fp)) {
    for (const s of sArr) {
      const p = localByFp.get(fp)[0];
      matched.push({ supplier: s, local: p, fp });
    }
  } else {
    for (const s of sArr) missingOnSite.push({ ...s, fp });
  }
}
for (const [fp, pArr] of localByFp) {
  if (!supplierByFp.has(fp)) {
    for (const p of pArr) orphans.push({ ...p, fp });
  }
}

console.log(`\nSupplier catalog: ${supplierProducts.length} real products`);
console.log(`Local catalog:    ${local.length} products (${local.filter(p => p.active).length} active)\n`);

console.log(`MATCHED (${matched.length})\n`);
console.log(`  ${'NAME (supplier)'.padEnd(50)} | COST    | RETAIL  | MARGIN  | MARGIN%`);
console.log('  ' + '-'.repeat(86));
matched.sort((a, b) => (a.local.price - a.supplier.cost) / a.local.price - (b.local.price - b.supplier.cost) / b.local.price);
for (const m of matched) {
  const margin = m.local.price - m.supplier.cost;
  const pct = (margin / m.local.price) * 100;
  const name = (m.supplier.name.length > 48 ? m.supplier.name.slice(0, 47) + '…' : m.supplier.name).padEnd(50);
  const cost = `$${m.supplier.cost.toFixed(2)}`.padStart(7);
  const retail = `$${m.local.price.toFixed(2)}`.padStart(7);
  const mg = `$${margin.toFixed(2)}`.padStart(7);
  const p = `${pct.toFixed(1)}%`.padStart(7);
  const flag = pct < 25 ? ' ⚠️' : (pct > 60 ? ' 🔥' : '');
  console.log(`  ${name} | ${cost} | ${retail} | ${mg} | ${p}${flag}`);
}

console.log(`\nMISSING ON OUR SITE — supplier has, we don't (${missingOnSite.length})`);
for (const s of missingOnSite) console.log(`  - ${s.name}  (cost $${s.cost.toFixed(2)})`);

console.log(`\nORPHANS — on our site, supplier dropped (${orphans.length})`);
for (const p of orphans) console.log(`  - ${p.name}  (price $${p.price}, active=${p.active}, slug=${p.slug})`);
