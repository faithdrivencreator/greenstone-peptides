/**
 * Greenstone Peptides — Daily Blog Orchestrator
 *
 * Routes by day of week (America/New_York):
 *   Mon / Wed / Fri → Track A (evergreen SEO, ~1500 words)
 *   Tue / Thu / Sat → Track B (news monitor, 400-600 words)
 *   Sun             → skip
 *
 * All posts are written as Sanity drafts (drafts.* _id). Never auto-publishes.
 *
 * Required env vars:
 *   - ANTHROPIC_API_KEY
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET      (defaults to "production")
 *   - SANITY_API_TOKEN
 *   - FIRECRAWL_API_KEY               (optional)
 *
 * Usage:
 *   node scripts/blog-daily.mjs             # live run
 *   node scripts/blog-daily.mjs --dry-run   # no API calls, no Sanity writes
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { runEvergreen } from './blog-evergreen-generate.mjs';
import { runNewsMonitor } from './blog/news-monitor.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RUN_LOG_PATH = resolve(__dirname, 'blog/run-log.json');

const DRY_RUN = process.argv.includes('--dry-run');

/** Return weekday name in America/New_York for today (or a given Date). */
function weekdayInET(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'America/New_York',
  });
  return fmt.format(date); // "Monday" ... "Sunday"
}

function pickTrack(weekday) {
  const evergreen = new Set(['Monday', 'Wednesday', 'Friday']);
  const news = new Set(['Tuesday', 'Thursday', 'Saturday']);
  if (evergreen.has(weekday)) return 'evergreen';
  if (news.has(weekday)) return 'news';
  return 'skip';
}

function appendRunLog(entry) {
  let log;
  try {
    log = JSON.parse(readFileSync(RUN_LOG_PATH, 'utf-8'));
  } catch {
    log = { runs: [] };
  }
  log.runs.push(entry);
  // Trim to last 200 runs to keep file manageable
  if (log.runs.length > 200) log.runs = log.runs.slice(-200);
  writeFileSync(RUN_LOG_PATH, JSON.stringify(log, null, 2) + '\n', 'utf-8');
}

async function main() {
  const startedAt = new Date().toISOString();
  const weekday = weekdayInET();
  const track = pickTrack(weekday);
  const base = { startedAt, weekday, track, dryRun: DRY_RUN };

  if (track === 'skip') {
    const entry = { ...base, ok: true, reason: 'sunday-skip', finishedAt: new Date().toISOString() };
    appendRunLog(entry);
    console.log(JSON.stringify(entry, null, 2));
    return entry;
  }

  let result;
  try {
    if (track === 'evergreen') {
      result = await runEvergreen({ dryRun: DRY_RUN });
    } else {
      result = await runNewsMonitor({ dryRun: DRY_RUN });
    }
  } catch (err) {
    result = { ok: false, error: err.message, stack: err.stack };
  }

  const entry = { ...base, finishedAt: new Date().toISOString(), result };
  appendRunLog(entry);
  console.log(JSON.stringify(entry, null, 2));
  return entry;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main()
    .then((entry) => {
      process.exit(entry.result && entry.result.ok === false ? 1 : 0);
    })
    .catch((err) => {
      console.error('Orchestrator fatal error:', err);
      process.exit(1);
    });
}

export { main, weekdayInET, pickTrack };
