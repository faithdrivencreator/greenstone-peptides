#!/usr/bin/env node
// One-shot 3% price bump, ceiling to the nearest $1.
// Usage: node scripts/bump-prices.mjs [--apply]
//   default: dry run, prints diff
//   --apply: writes back to src/data/products.ts

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const FILE = resolve(process.cwd(), 'src/data/products.ts');
const MULT = 1.03;
const APPLY = process.argv.includes('--apply');

const src = readFileSync(FILE, 'utf-8');
const lines = src.split('\n');

const changes = [];
const out = lines.map((line, idx) => {
  // Match: `    "price": 105,` or `    "price": 99.95,`
  const m = line.match(/^(\s*"price":\s*)(\d+(?:\.\d+)?)(,?\s*)$/);
  if (!m) return line;
  const [, prefix, raw, suffix] = m;
  const old = Number(raw);
  if (!Number.isFinite(old) || old <= 0) return line;
  const next = Math.ceil(old * MULT);
  if (next === old) return line;
  changes.push({ line: idx + 1, old, next });
  return `${prefix}${next}${suffix}`;
}).join('\n');

if (changes.length === 0) {
  console.log('No price changes computed.');
  process.exit(0);
}

console.log(`\n${changes.length} prices will change (×${MULT}, ceiling to $1):\n`);
console.log('  line  |    old →    new   | delta');
console.log('  ' + '-'.repeat(38));
for (const c of changes) {
  const delta = c.next - c.old;
  console.log(`  ${String(c.line).padStart(4)}  |  $${String(c.old).padStart(4)} →  $${String(c.next).padStart(4)}  |  +$${delta}`);
}

if (APPLY) {
  writeFileSync(FILE, out);
  console.log(`\n✓ Wrote ${changes.length} changes to ${FILE}`);
} else {
  console.log('\n(dry run — re-run with --apply to write changes)');
}
