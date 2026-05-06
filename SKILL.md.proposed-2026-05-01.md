---
name: greenstone-daily-blog-post
description: Auto-publish a daily SEO/GEO blog post to greenstonewellness.store at 7 AM EST
---

You are publishing today's daily SEO blog post for Greenstone Peptides (greenstonewellness.store). Auto-publish mode — the post goes live with no human review. Be sharp, clinical, and commercially aware. This drives the SEO/GEO program until the site has more traffic.

## Working directory
/Users/pedrofluriach/Desktop/FFS/02-The-Lab/greenstone-rx/greenstone-rx

## IMPORTANT site facts (verified)
- Blog detail URL pattern: `/learn/<slug>` (NOT `/blog/<slug>` — that route does not exist)
- Listing page: `/learn` (Next.js ISR with revalidate=300, posts appear within ~5 min)
- Sanity is the CMS; publisher script writes directly to it
- Hero images: generated fresh each day via the **Higgsfield connector** using model **`gpt_image_2`** (OpenAI GPT Image 2). 2k resolution, high quality. Plenty of credits on the Ultimate plan.
- Required env in .env.local: SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET. (GEMINI_API_KEY is no longer required — kept only as a legacy fallback path; if absent, skip Gemini fallback entirely.)

## Workflow — execute in order

### 1. Determine today's track (America/New_York timezone)
Use bash: `TZ=America/New_York date +%A` to get the weekday name.

Track routing:
- **Mon / Wed / Fri** → Evergreen long-form (~1400-1600 words). Topic from `scripts/blog/topic-queue.json`. Hero style: **evergreen** (clinical editorial).
- **Tue / Thu / Sat** → Product spotlight (~600-900 words). Rotate products by ISO week. Hero style: **spotlight** (product photography).
- **Sun** → Short FAQ post (~500-700 words) on previously covered peptide. Hero style: **faq** (abstract molecular).

### 2. Pick today's topic
**Evergreen days:** Read `scripts/blog/topic-queue.json`. Find FIRST topic with `status === "pending"`. Use its `slug`, `title`, `keywords`, `angle`.

**Product spotlight days:** Use `TZ=America/New_York date +%V` for ISO week, index into rotation. Products:
- BPC-157 5mg / 10mg/mL → `bpc157-5mg`, `bpc157-10mg`
- TB-500 5mg / 10mg/mL → `tb500-5mg`, `tb500-10mg`
- GHK-Cu 50mg → `ghkcu-50mg`
- Tesamorelin 5mg → `tesamorelin-5mg`
- NAD+ 50mg / 200mg / Nasal → `nad-50mg`, `nad-200mg`, `nad-nasal`
- MOTS-c 20mg → `motsc-20mg`
- Sermorelin 4mg → `sermorelin-4mg`
- Semaglutide ODT → `sema-odt-05-30`
- Starter Kits → `kit-5day`, `kit-10day`, `kit-15day`, `kit-20day`

**Sunday FAQ:** Pick a peptide from previously published posts (check `scripts/blog/publish-log.json`). Focused FAQ-style post. Optimize for AI citation (clear question headers, direct answers, lists).

### 3. Write the post

Brand voice — clinical, calm conviction, modern stoic. Educational, not hype. Reference 503A compounding, USA-sourced, third-party tested where applicable. Never make medical claims, dosing recommendations, or efficacy claims beyond published literature. Include somewhere natural: "Greenstone Peptides content is educational and does not constitute medical advice. Peptide therapies should be discussed with a licensed healthcare provider."

SEO/GEO requirements:
- Title: 50-65 chars, primary keyword early
- seoTitle: max 70 chars
- seoDescription: 140-160 chars
- excerpt: 200-280 chars
- Body: H2 every 200-400 words, occasional H3, scannable bullets, numbered steps for procedural content
- Tags: 4-7 relevant
- Reading time: estimate honestly (220 wpm)

### 4. Generate hero image (PRIMARY — Higgsfield `gpt_image_2`)

The image flow has FOUR steps. Do them in this order:

**4a. Get the treatment + prompt** (no API call, no upload):

```bash
cd /Users/pedrofluriach/Desktop/FFS/02-The-Lab/greenstone-rx/greenstone-rx
node scripts/generate-blog-image.mjs --print-prompt \
  --track <evergreen|spotlight|faq> \
  --topic "<post title>" \
  --tags "<tag1,tag2,tag3>" \
  --slug "<post-slug>"
```

This outputs JSON containing `treatment`, `category`, `altText`, `prompt`, and a `higgs` block. The picker enforces category rotation against `scripts/blog/treatment-log.json` so the same visual style never runs back-to-back. The `higgs` block always returns `gpt_image_2` as the model — the script was rewired in 2026-05-01.

You may pass `--treatment <name>` to manually override. Valid treatments: `editorial-scene`, `cinematic-dark`, `hyper-macro`, `lifestyle-minimal`, `clinical-context`, `molecular-3d`, `tissue-anatomy`, `scientific-diagram`, `flat-editorial`, `comparative-split`, `concept-metaphor`, `bold-infographic`. Override when the topic has an obvious visual fit the picker missed (e.g. data-heavy article → `bold-infographic` or `scientific-diagram`).

**4b. Generate the image via the Higgsfield MCP.** Always use model `gpt_image_2`, aspect `16:9`, params `{ resolution: "2k", quality: "high" }` (or `4k` for `cinematic-dark`, `hyper-macro`, `molecular-3d`). Pete's directive: every blog hero ships from `gpt_image_2`.

Call the Higgsfield connector tool `generate_image` with:
- `model`: `gpt_image_2`
- `aspect_ratio`: `16:9`
- `prompt`: the prompt string from step 4a
- `params.resolution`: `2k` (or `4k` per the higgs block)
- `params.quality`: `high`

The call returns immediately with `status: "pending"` and a job `id`. Poll with `job_display` until `status === "completed"`. The result has `results.rawUrl` — a CloudFront URL pointing to the PNG. (Typical render: 30-90 seconds.)

**4c. Upload the Higgsfield URL to Sanity:**

```bash
node scripts/upload-url-to-sanity.mjs \
  --url "<results.rawUrl from Higgsfield>" \
  --filename "<treatment>-<slug>-<unix-ms>.png" \
  --alt "<altText from step 4a>"
```

Output JSON last line: `{"assetId":"image-...","filename":"...","alt":"..."}`. Capture `assetId` for the post JSON. The script also saves a local archival copy to `public/images/blog-heroes/`.

**4d. Append to treatment log** so the next day's picker doesn't repeat the look:

```bash
node -e '
const fs=require("fs");
const path="scripts/blog/treatment-log.json";
let log = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path,"utf-8")) : {entries:[]};
log.entries.push({ts:new Date().toISOString(), slug:"<slug>", treatment:"<treatment>", category:"<category>", track:"<track>", source:"higgsfield-gpt_image_2"});
if (log.entries.length>90) log.entries = log.entries.slice(-90);
fs.writeFileSync(path, JSON.stringify(log,null,2)+"\n","utf-8");
'
```

**Fallback — if the Higgsfield job errors or never completes:** run the library picker as backup:
```bash
node scripts/pick-blog-image.mjs --track <track> --topic "<title>" --tags "<tags>" --slug "<slug>"
```
This picks from previously generated images in `public/images/blog-heroes/` and uploads to Sanity. Same output JSON shape.

**If BOTH fail:** Set `mainImage: null`, continue to publish, note in report.

### 5. Build post JSON
Save to `scripts/blog/queue/YYYY-MM-DD.json`:

```json
{
  "id": "post-YYYY-MM-DD-<short-slug>",
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "tags": ["...", "..."],
  "readingTime": 8,
  "featured": false,
  "publishedAt": "<ISO 8601 NOW>",
  "body": [ /* Portable Text blocks */ ],
  "relatedProducts": ["bpc157-5mg"],
  "mainImage": {
    "assetId": "image-abc123-...",
    "alt": "Premium clinical photograph...",
    "treatment": "<treatment-key>"
  }
}
```

Portable Text helpers (each block unique `_key`):
- Paragraph: `{ "_type": "block", "_key": "p1", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "_key": "p1s", "text": "...", "marks": [] }] }`
- H2: `"style": "h2"` · H3: `"style": "h3"` · Blockquote: `"style": "blockquote"`
- List item: add `"listItem": "bullet"` (or `"number"`) and `"level": 1`
- Bold/italic: `"marks": ["strong"]` or `"marks": ["em"]`

### 6. Publish
```bash
node scripts/blog-publish.mjs --post scripts/blog/queue/YYYY-MM-DD.json
```
Pushes to Sanity as published doc, prints live URL at `/learn/<slug>`.

### 7. Update topic queue (evergreen days only)
Change used topic's `status` from `"pending"` to `"published"`, add `"publishedAt": "<ISO 8601>"`.

### 8. Report
```
✅ Published: <title>
🔗 https://greenstonewellness.store/learn/<slug>
📚 Listing: https://greenstonewellness.store/learn (visible within 5 min via ISR)
📊 Track: <evergreen|spotlight|faq> · Words: <approx> · Reading time: <N> min
🖼  Hero: <filename uploaded to Sanity, or "MISSING">
🎨 Image source: <Higgsfield gpt_image_2 | Library fallback | Failed>
🎨 Treatment: <treatment-key> (<category>)
```

## Safety rails
- If `topic-queue.json` exhausted on evergreen day, fall back to Sunday-style FAQ post, notify in report.
- If `blog-publish.mjs` fails, don't retry blindly. Check post JSON for issues (seoTitle > 70 chars, missing fields), fix, re-run once. If it fails twice: save to `scripts/blog/queue/FAILED-YYYY-MM-DD.json`, report clearly, stop.
- Never delete or modify other Sanity content. Publisher only touches `blogPost` documents.
- Blog detail URL is ALWAYS `/learn/<slug>`, never `/blog/<slug>`.
- Higgsfield credits: check the `balance` MCP tool if you suspect rate limiting. Ultimate plan, healthy headroom — but don't burn credits on retries. If a `gpt_image_2` job fails, fall through to the library picker rather than re-trying twice.
- Use the Higgsfield connector tools, never call provider APIs (OpenAI, Gemini, etc.) directly.
