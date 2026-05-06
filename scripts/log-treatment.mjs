/**
 * Greenstone Peptides — Log Treatment Entry
 *
 * Appends a treatment entry to scripts/blog/treatment-log.json.
 * Called after a successful Higgs Field image generation so the
 * category rotation tracker stays current.
 *
 * (When using the Gemini path via generate-blog-image.mjs directly,
 * the script writes to treatment-log.json itself. This helper is only
 * needed for the Higgs Field path, where image generation happens
 * outside the script via MCP tool call.)
 *
 * Usage:
 *   node scripts/log-treatment.mjs \
 *     --slug "tirzepatide-dosing-guide-beginner" \
 *     --treatment "cinematic-dark" \
 *     --category "photo" \
 *     --track "evergreen"
 *
 * Output (stdout, JSON):
 *   {"ok":true,"entry":{...}}
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const LOG_PATH   = resolve(__dirname, 'blog/treatment-log.json');

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

const slug      = arg('slug');
const treatment = arg('treatment');
const category  = arg('category');
const track     = arg('track');

// ─── WRITE ────────────────────────────────────────────────────────────────────

let log;
try {
  log = existsSync(LOG_PATH)
    ? JSON.parse(readFileSync(LOG_PATH, 'utf-8'))
    : { entries: [] };
} catch {
  log = { entries: [] };
}

const entry = {
  ts:        new Date().toISOString(),
  slug,
  treatment,
  category,
  track,
  source:    'higgs',
};

log.entries.push(entry);
if (log.entries.length > 90) log.entries = log.entries.slice(-90);

writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + '\n', 'utf-8');

console.error(`📋 Logged: ${treatment} (${category}) → treatment-log.json`);
console.log(JSON.stringify({ ok: true, entry }));
process.exit(0);
