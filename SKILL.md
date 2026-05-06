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
- Hero images: generated fresh each day via Google Gemini (Nano Banana / gemini-3-pro-image-preview). Free tier — no cost per image.
- Required env in .env.local: SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, GEMINI_API_KEY

## Workflow — execute in order

### 1. Determine today's track (America/New_York timezone)
Use bash: `TZ=America/New_York date +%A` to get the weekday name.

Track routing:
- **Mon / Wed / Fri** → Evergreen long-form (~1400-1600 words). Topic from `scripts/blog/topic-queue.json`. Hero track: **evergreen**.
- **Tue / Thu / Sat** → Product spotlight (~600-900 words). Rotate products by ISO week. Hero track: **spotlight**.
- **Sun** → Short FAQ post (~500-700 words) on previously covered peptide. Hero track: **faq**.

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

### 4. Generate hero image — PRIMARY: Higgs Field MCP, FALLBACK: Gemini

**The non-negotiable rule:** Every hero must visually communicate what the specific post is about. A reader seeing only the image — before reading a word — must sense the topic. Generic vial on white = rejected, always.

---

#### 4A. Get treatment plan from the generator script

```bash
cd /Users/pedrofluriach/Desktop/FFS/02-The-Lab/greenstone-rx/greenstone-rx
node scripts/generate-blog-image.mjs \
  --track <evergreen|spotlight|faq> \
  --topic "<post title>" \
  --tags "<tag1,tag2,tag3>" \
  --slug "<post-slug>" \
  --print-prompt
```

This outputs a JSON plan with four things: `treatment`, `category`, `prompt` (the full image generation prompt), and `higgs` (the recommended Higgs Field model + params). It does **not** call any image API — it only decides *what* to generate and *how*.

```json
{
  "treatment": "cinematic-dark",
  "category":  "photo",
  "altText":   "Cinematic dark studio photograph for ...",
  "prompt":    "TREATMENT: CINEMATIC-DARK...",
  "higgs": {
    "model":        "cinematic_studio_2_5",
    "aspect_ratio": "16:9",
    "params":       { "resolution": "2k" }
  }
}
```

**The 12 treatments and their Higgs Field model routing:**

| Treatment | Higgs Model | Why |
|---|---|---|
| `editorial-scene` | `flux_2` (pro, 2K) | Black Forest Labs — tightest prompt adherence, great for composed still life |
| `cinematic-dark` | `cinematic_studio_2_5` (2K) | Higgsfield's cinema engine — built for dramatic, high-contrast stills |
| `hyper-macro` | `cinematic_studio_2_5` (4K) | Need extreme surface detail; cinema quality at maximum resolution |
| `lifestyle-minimal` | `flux_2` (pro, 2K) | Clean, precise rendering of minimal spaces |
| `clinical-context` | `flux_2` (max, 2K) | Max variant for product photography accuracy |
| `molecular-3d` | `cinematic_studio_2_5` (4K) | Cinema engine renders 3D sci-fi molecular structures beautifully |
| `tissue-anatomy` | `nano_banana_2` (2K) | Google's versatile premium model, good illustration quality |
| `scientific-diagram` | `gpt_image_2` (high, 2K) | OpenAI — best text rendering and diagram precision of any model |
| `flat-editorial` | `grok_image` (pro) | xAI — expressive, high-contrast, handles bold graphic design well |
| `comparative-split` | `nano_banana_2` (2K) | Reliable composition control for split-frame layouts |
| `concept-metaphor` | `soul_cinematic` | Higgsfield's concept art engine — cinematic and evocative |
| `bold-infographic` | `gpt_image_2` (high, 2K) | OpenAI — best for data visualization + text labels |

**Override treatment** (only when needed): add `--treatment <name>` to the command above.

---

#### 4B. Generate the image via Higgs Field MCP

Call the Higgs Field `generate_image` MCP tool using the `model`, `aspect_ratio`, `params`, and `prompt` from the plan JSON:

```
model:        <higgs.model from plan JSON>
aspect_ratio: "16:9"
prompt:       <prompt from plan JSON>
+ spread all higgs.params as top-level fields (e.g. resolution: "2k", quality: "high", mode: "pro")
```

The MCP returns a result containing image URL(s). Extract the first image URL from the result.

---

#### 4C. Upload image to Sanity

```bash
node scripts/upload-url-to-sanity.mjs \
  --url "<image URL from Higgs Field result>" \
  --filename "<treatment>-<slug>-<timestamp>.jpg" \
  --alt "<altText from plan JSON>"
```

Output (last line, JSON): `{"assetId":"image-abc123-...","filename":"...","alt":"..."}`
Capture `assetId`.

---

#### 4D. Log the treatment

```bash
node scripts/log-treatment.mjs \
  --slug "<post-slug>" \
  --treatment "<treatment from plan JSON>" \
  --category "<category from plan JSON>" \
  --track "<evergreen|spotlight|faq>"
```

This writes to `scripts/blog/treatment-log.json` so tomorrow's run knows what category was just used and enforces rotation correctly.

---

#### Fallback A — if Higgs Field MCP fails

Run the Gemini path (no `--print-prompt`, no `--dry-run`):
```bash
node scripts/generate-blog-image.mjs \
  --track <track> --topic "<title>" --tags "<tags>" --slug "<slug>"
```
This calls Gemini, uploads to Sanity, and writes to treatment-log.json all in one step.
Output: `{"assetId":"image-...","alt":"...","filename":"...","treatment":"...","category":"..."}`

#### Fallback B — if Gemini also fails

```bash
node scripts/pick-blog-image.mjs --track <track> --topic "<title>" --tags "<tags>" --slug "<slug>"
```
Picks from previously generated images in `public/images/blog-heroes/`.

#### Fallback C — if all three fail

Set `mainImage: null`, continue to publish, note clearly in report.

---

**Credit note:** Higgs Field's Ultimate plan has credits. High-res models (4K, quality:high) cost more per generation. `hyper-macro` and `molecular-3d` use 4K — use sparingly if credits are low. Check balance with the `balance` MCP tool if unsure.

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
    "alt": "Cinematic dark studio photograph for ...",
    "treatment": "cinematic-dark",
    "category": "photo"
  }
}
```

**Always pass `treatment` and `category` through to the post JSON.** The publish script writes `treatment` to `publish-log.json` and the generator has already written to `treatment-log.json` — both logs stay in sync so tomorrow's run has full rotation history.

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
🖼  Hero: <filename> · Treatment: <treatment used>
🎨 Image source: <Gemini|Library fallback|Failed>
```

## Patching a hero after publish
If a published post needs a new hero (e.g., the first attempt was off):
```bash
node scripts/patch-blog-image.mjs \
  --id <post-_id> \
  --asset <new-image-asset-id> \
  --alt "<descriptive alt text>"
```

## Safety rails
- If `topic-queue.json` exhausted on evergreen day, fall back to Sunday-style FAQ post, notify in report.
- If `blog-publish.mjs` fails, don't retry blindly. Check post JSON for issues (seoTitle > 70 chars, missing fields), fix, re-run once. If it fails twice: save to `scripts/blog/queue/FAILED-YYYY-MM-DD.json`, report clearly, stop.
- Never delete or modify other Sanity content. Publisher script only touches `blogPost` documents.
- Blog detail URL is ALWAYS `/learn/<slug>`, never `/blog/<slug>`.
- Gemini has a daily free quota. If you hit a 429, note it in the report — Pete may need to upgrade or wait for reset.
- **Image creative rule (HARD):** never publish a plain unbranded vial on a blank background. If the only thing the generator produced is a generic bottle, regenerate with a different treatment.
