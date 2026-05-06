/**
 * Greenstone Peptides — Daily Blog Hero Image Generator
 *
 * Two-mode utility for hero image generation:
 *
 *   • DEFAULT MODE — `--print-prompt`
 *     Picks the day's treatment, builds the treatment-aware prompt, and prints
 *     a JSON spec including the recommended Higgsfield model + params. The
 *     scheduled task (Claude agent) then calls the Higgsfield MCP
 *     `generate_image` tool with those values, polls for completion, and pipes
 *     the resulting CDN URL through `scripts/upload-url-to-sanity.mjs` to
 *     produce the same `{assetId, alt, filename}` contract.
 *
 *   • FALLBACK MODE — direct call (no `--print-prompt`)
 *     Calls Google Gemini's image generation API directly, uploads the bytes
 *     to Sanity, and prints the same JSON contract. Only used when the
 *     Higgsfield MCP path is unavailable; `GEMINI_API_KEY` must be set.
 *
 * --- v4 (2026-05-05) — HIGGSFIELD-FIRST, NANO BANANA PRO DEFAULT ---
 *
 * Per Pete's directive (2026-05-05), the default model is now `nano_banana_2`
 * (Google Nano Banana Pro). `gpt_image_2` (OpenAI GPT Image 2) is reserved
 * for treatments that benefit from inline text rendering — `scientific-diagram`
 * and `bold-infographic`. Soul models (`soul_*`) are NEVER used for blog
 * heroes; Soul is reserved for character/UGC/runway/portrait work.
 *
 * --- v3 (2026-04-29) — 12-TREATMENT SYSTEM / CATEGORY ROTATION ---
 *
 * ROOT PROBLEMS FIXED IN THIS VERSION:
 *
 *   1. TREATMENT TRACKING — now uses a dedicated `scripts/blog/treatment-log.json`
 *      that this script writes to directly after every successful generation.
 *      No longer depends on publish-log.json (which often had treatment: null).
 *
 *   2. CATEGORY ROTATION — replaces treatment-name rotation. Four categories
 *      (photo / illustration / graphic / conceptual) are enforced so the same
 *      visual type NEVER runs back-to-back. Within each category, the specific
 *      treatment is chosen by topic signals + slug hash.
 *
 *   3. DISTINCT VISUAL DNA — all 12 treatments have separate color palettes,
 *      lighting setups, and rendering styles. "Cream and sage" is no longer
 *      copy-pasted across every prompt.
 *
 *   4. GEMINI-OPTIMIZED PROMPTS — camera/lens/lighting specs, explicit palette
 *      hex values, and strong negative prompt section.
 *
 * TREATMENT CATALOG (12 treatments, 4 categories):
 *
 *   PHOTO:
 *     editorial-scene     Warm contextual still life, morning window light
 *     cinematic-dark      Single sidelight, deep navy/charcoal, noir-clinical
 *     hyper-macro         Extreme macro, biological textures, teal-gold palette
 *     lifestyle-minimal   Premium wellness lifestyle, pale morning light, clean spaces
 *     clinical-context    Product in deliberate lab/clinical scene, marble + steel
 *
 *   ILLUSTRATION:
 *     molecular-3d        Photoreal 3D peptide/molecular render, midnight-blue bg
 *     tissue-anatomy      Stylized anatomical illustration, ivory bg, wine-crimson tissue
 *     scientific-diagram  Precision line art technical diagram, white bg, navy ink
 *
 *   GRAPHIC:
 *     flat-editorial      Bold flat design, deep navy bg, cream + sage shapes, amber accent
 *     comparative-split   Split-frame editorial comparison, warm vs cool panels
 *
 *   CONCEPTUAL:
 *     concept-metaphor    Visual metaphor, full creative latitude, palette follows concept
 *     bold-infographic    Artistic data visualization, dark forest-green bg, cream lines
 *
 * CATEGORY ROTATION RULE:
 *   Never use the same category two posts in a row.
 *   Preferred rotation: photo → illustration/conceptual → photo → graphic → repeat
 *
 * Usage:
 *   node scripts/generate-blog-image.mjs \
 *     --track evergreen \
 *     --topic "The Tirzepatide Dosing Ladder: A Beginner Reference" \
 *     --tags "tirzepatide,tirzepatide dosing,GLP-1" \
 *     --slug tirzepatide-dosing-guide-beginner
 *
 *   # Force a specific treatment:
 *   node scripts/generate-blog-image.mjs ... --treatment cinematic-dark
 *   # Dry run — shows prompt, no API call, no upload:
 *   node scripts/generate-blog-image.mjs ... --dry-run
 *
 * Output (stdout LAST line, JSON):
 *   • Default mode (--print-prompt):
 *     {"treatment":"...","category":"...","altText":"...","prompt":"...",
 *      "higgs":{"model":"nano_banana_2","aspect_ratio":"16:9","params":{"resolution":"2k"}}}
 *   • Fallback mode (direct Gemini call):
 *     {"assetId":"image-abc123-...","alt":"...","filename":"...","treatment":"...","category":"..."}
 *
 * Required env vars (.env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 *   GEMINI_API_KEY  (only required if invoking the fallback Gemini path)
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LIBRARY_DIR = join(ROOT, 'public', 'images', 'blog-heroes');
const TREATMENT_LOG = resolve(__dirname, 'blog/treatment-log.json');

const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';

// ─── HIGGS FIELD MODEL ROUTING ────────────────────────────────────────────────
//
// 2026-05-05 — Per Pete's directive, the daily blog hero default is now
// `nano_banana_2` (Google Nano Banana Pro). Soul models are NEVER used for
// blog heroes (Soul is reserved for character/UGC/runway/portrait work).
// `gpt_image_2` is retained as a per-treatment override target for treatments
// that benefit specifically from its text-rendering and diagram strengths.
// Treatment-specific PROMPTS drive the visual variety; the model + resolution
// stay tightly constrained.
//
// Aspect ratio is always 16:9 for blog heroes. Resolution is always 2k for
// most treatments. `cinematic-dark`, `hyper-macro`, and `molecular-3d` get 4k
// since they benefit most from extra detail. `scientific-diagram` and
// `bold-infographic` route to GPT Image 2 because that model handles inline
// text rendering and diagrammatic precision better than Nano Banana.

const HIGGS_DEFAULT     = { model: 'nano_banana_2', aspect_ratio: '16:9', params: { resolution: '2k' } };
const HIGGS_DEFAULT_4K  = { model: 'nano_banana_2', aspect_ratio: '16:9', params: { resolution: '4k' } };
const HIGGS_TEXT_MODEL  = { model: 'gpt_image_2',   aspect_ratio: '16:9', params: { resolution: '2k', quality: 'high' } };

const HIGGS_MODELS = {
  'editorial-scene':    HIGGS_DEFAULT,
  'cinematic-dark':     HIGGS_DEFAULT_4K,
  'hyper-macro':        HIGGS_DEFAULT_4K,
  'lifestyle-minimal':  HIGGS_DEFAULT,
  'clinical-context':   HIGGS_DEFAULT,
  'molecular-3d':       HIGGS_DEFAULT_4K,
  'tissue-anatomy':     HIGGS_DEFAULT,
  'scientific-diagram': HIGGS_TEXT_MODEL,
  'flat-editorial':     HIGGS_DEFAULT,
  'comparative-split':  HIGGS_DEFAULT,
  'concept-metaphor':   HIGGS_DEFAULT,
  'bold-infographic':   HIGGS_TEXT_MODEL,
};

// ─── ENV ──────────────────────────────────────────────────────────────────────

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
// SANITY env vars are required for both Higgsfield and Gemini paths.
// GEMINI_API_KEY is only required when the Gemini direct-call fallback is
// invoked (i.e. without --print-prompt). The default Higgsfield workflow
// never reads GEMINI_API_KEY.
for (const k of ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_TOKEN']) {
  if (!process.env[k]) {
    console.error(`ERROR: Missing required env var ${k} in .env.local`);
    process.exit(1);
  }
}

// ─── ARGS ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN      = args.includes('--dry-run');
const PRINT_PROMPT = args.includes('--print-prompt');

function arg(name, required = true) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || !args[idx + 1]) {
    if (required) { console.error(`ERROR: --${name} <value> is required`); process.exit(1); }
    return null;
  }
  return args[idx + 1];
}

const track           = arg('track');
const topic           = arg('topic');
const tagsRaw         = arg('tags', false);
const slug            = arg('slug');
const treatmentOverride = arg('treatment', false);
const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

if (!['evergreen', 'spotlight', 'faq'].includes(track)) {
  console.error(`ERROR: --track must be evergreen, spotlight, or faq`);
  process.exit(1);
}

// ─── TREATMENT DEFINITIONS ────────────────────────────────────────────────────
//
// Each treatment has:
//   category    photo | illustration | graphic | conceptual
//   palette     Color DNA, specific hex values — NOT shared with other treatments
//   lighting    Explicit lighting setup (photo treatments)
//   camera      Lens + aperture (photo treatments)
//   style       Full Gemini prompt instruction block
//   allowText   Whether small annotation text is acceptable

const TREATMENTS = {

  // ============================================================
  // PHOTO
  // ============================================================

  'editorial-scene': {
    category: 'photo',
    palette: 'warm cream #F5F0E8, soft sage #7B9E87, pale terracotta accent #C4845A, morning light gold highlights',
    lighting: 'Soft north-facing window light. Natural diffuse. Warm shadow fill from a cream-colored reflector. No specular highlights.',
    camera:   'Hasselblad medium format feel. 85mm. f/2.8 shallow depth of field on the hero object.',
    style: `Warm contextual editorial still life. The opening image of a Wired Health feature story or a Kinfolk spread.
Thoughtfully composed objects that create genuine thematic meaning for the specific article topic.
Not a generic wellness shelf. Choose textures, tools, materials, or surfaces that evoke what the article is actually about.
Generous breathing room. Very shallow depth of field — the hero object in focus, background softly blurred.
Composition: subject in the central or lower third, slightly overhead (55°), clean negative space above.
Color temperature: warm. Mood: unhurried, intelligent, morning. The image whispers the topic.`,
    allowText: false,
  },

  'cinematic-dark': {
    category: 'photo',
    palette: 'deep charcoal #1A1A2E background, deep navy #16213E shadows, single warm tungsten highlight #E8A87C, cool indigo shadow fill #0F3460',
    lighting: 'Single hard Fresnel spot from stage left. Dramatic 4:1 ratio. Deep shadows with retained shadow detail. Cool indigo fill card on shadow side.',
    camera:   '50mm lens. f/1.4. Razor-thin depth of field. Subject pin-sharp against near-black background.',
    style: `Dramatic dark studio photography. Noir-clinical aesthetic. Deep charcoal and navy background.
A single hard sidelight sculpts the subject — intense texture, shadow, and form.
The subject: a single meaningful object or material that connects directly to the article topic.
Isolated, sculpted, quiet. Warm amber-tungsten highlight on the subject surface against cool indigo shadow.
Think: Apple product photography meets clinical research journal cover. Precision and consequence.
This is not danger or horror. It is concentrated, expert, authoritative.
Mood: the image says "this subject deserves your full attention."`,
    allowText: false,
  },

  'hyper-macro': {
    category: 'photo',
    palette: 'deep teal-blue dark-field background #0D2137, crystalline gold-amber structures #D4A853, ice-white specular highlights, midnight-blue deep shadows',
    lighting: 'Transmitted macro ring light. Extreme specular highlights on crystalline surfaces. Dark field illumination — background absorbs all light.',
    camera:   '100mm macro lens. f/8. Extreme close-up. Millimeter-scale subject fills the frame. Tack-sharp across the subject plane.',
    style: `Extreme macro photography of a biological, chemical, or physical texture that is specific to the article topic.
Ideas: crystalline amino acid structures, lyophilized peptide powder surface, cell membrane cross-section geometry,
a vial stopper surface at extreme magnification, the lattice of a protein scaffold.
Deep teal-blue dark-field background. The subject glitters — crystalline gold-amber with ice-white specular highlights.
The image should feel almost alien: beautiful, precise, unexpected. A Nature cover shot.
The viewer may not immediately know what they're seeing — but they feel it is important and exact.
Mood: scientific wonder, biological precision, complexity at the molecular scale.`,
    allowText: false,
  },

  'lifestyle-minimal': {
    category: 'photo',
    palette: 'bleached white #FAFAFA, warm blond wood #D4B896, pale morning sky blue #EAF0F6, soft sage linen #C5D5C5',
    lighting: 'Diffuse pale morning sunlight from the right. High-key exposure. Lifted shadows, soft and clean. No strong contrast.',
    camera:   '35mm lens. f/5.6. Environmental shot. Subject set in its wider context, generous negative space.',
    style: `Premium wellness lifestyle photography. Zero clinical imagery. Zero medical equipment. No products visible.
A clean aspirational physical space that implies intentional health without showing anything medical.
Pale morning light through a window. Warm blond wood surfaces, linen textures, simple ceramic or glass vessels.
An indirect reference to the article topic through atmosphere and context:
a clean surface prepared with intention, a notebook and glass of water, morning routine stillness.
Composition: high-key, spacious, subject in the lower or middle third. Never cluttered.
Mood: deliberate, calm, aspirational. "This is what choosing your health looks like at 7am."`,
    allowText: false,
  },

  'clinical-context': {
    category: 'photo',
    palette: 'cool white Carrara marble #F8F8F5, brushed steel #8A9BA8, warm amber glass highlight #C4845A, clinical white #FFFFFF',
    lighting: 'Overhead studio strobe. Product photography quality — clean, even, professional. Subtle specular on glass and metal surfaces.',
    camera:   '90mm macro. f/8. Sharp focus across the full subject. Marble or matte brushed steel surface as base.',
    style: `Premium clinical product photograph. The focal subject is a Greenstone-style amber or clear glass vial.
But NEVER against a plain blank background. The vial is placed in a deliberate scene that tells the story of the article.
Scene props connected to the topic: lab equipment, anatomical reference objects, sterile gauze, a precision dropper,
sample trays, printed COA document at the edge of frame, scientific measurement instruments, a clean pipette.
Cool white marble or matte brushed steel base. Clean overhead studio light. Sharp vial, soft background context.
Composition: vial in foreground, scene context receding gently into shallow-DOF background.
Mood: trustworthy, precise, professional. "This is made with deliberate care."`,
    allowText: false,
  },

  // ============================================================
  // ILLUSTRATION
  // ============================================================

  'molecular-3d': {
    category: 'illustration',
    palette: 'deep midnight blue #050A1A to space black background, luminous sage-cyan bonds #5FBFAD, warm amber active residues #E8A43C, pearl-white backbone',
    lighting: 'Cinematic three-point global illumination. Subsurface scattering on bonds. Ambient occlusion in gaps between atoms.',
    camera:   'Rendered wide-angle (24mm equivalent). Slight low angle. Depth-of-field focused on the key active region.',
    style: `Premium photoreal 3D render of the peptide chain, amino acid sequence, receptor complex, or molecular structure
that is SPECIFICALLY connected to this article's topic. Represent the actual biology being discussed.
Midnight-blue to space-black background. The molecular structure glows from within —
luminous sage-cyan bonds, amber hot spots on active residues, pearl-white backbone.
Cinematic three-point lighting, subsurface scattering. Hyper-detailed geometry, ambient occlusion in gaps.
The structure should read like a Nature journal cover — precise, luminous, scientifically suggestive.
Composition: molecule fills the frame at a dynamic 30° angle. Key region in sharp focus, outer edges in soft DOF.
Mood: scientific mastery. Complexity made beautiful. Intelligence made visible.`,
    allowText: false,
  },

  'tissue-anatomy': {
    category: 'illustration',
    palette: 'ivory/cream background #FAF8F2, warm wine-crimson tissue structures #8B2F4A, rich gold annotation highlights #C9972B, precise charcoal outlines #2D2D2D',
    lighting: 'Flat medical illustration light — clean, shadowless, optimized for biological clarity.',
    camera:   'Illustration. Clean cross-section, macro anatomical view, or layered tissue structure.',
    style: `Stylized editorial anatomical illustration of the tissue or biological system most relevant to this article.
Match the biology to the article: tendon and ligament fibers for recovery posts; adipocytes for metabolic topics;
dermal layers and collagen for skin; neuronal networks for cognitive; vascular tree for circulation; gut lining for GI.
The style sits between a premium modern medical textbook and a contemporary design studio — not cartoonish, not cold.
Ivory background. Wine-crimson for living tissue structure. Gold for annotation and connective highlights. Precise charcoal outlines.
Use a cross-section or macro magnification view so the specific biology is legible, dramatic, and beautiful.
Mood: knowledgeable, educational, visually compelling. Science you want to look at.`,
    allowText: false,
  },

  'scientific-diagram': {
    category: 'illustration',
    palette: 'pure white background #FFFFFF, midnight navy primary lines and text #0D1B4B, single sage-green accent #5E8F6E, very light grey grid #F0F0F0',
    lighting: 'No lighting. Clean flat technical illustration.',
    camera:   'Illustration. Isometric or orthographic projection. Precise line weights.',
    style: `Precision technical line art diagram that directly visualizes the mechanism, process, or data in this article.
Match the diagram to the content: dosing titration timeline with labeled steps and dose-response curve;
mechanism pathway with labeled receptor arrows; molecule comparison table with structural diagrams;
bioavailability absorption-over-time curve with annotations; step-by-step protocol with numbered stages.
Pure white background. Midnight navy for all primary lines and abstract label elements.
Single sage-green accent on the most important line, bar, or callout.
Typography is sparse, sans-serif, abstract placeholder labels only — no real marketing copy.
This is the visual language of a premium medical journal figure, redesigned by a contemporary design studio.
Wired magazine meets the New England Journal of Medicine. The diagram is SPECIFIC to this article's content.
Mood: authoritative, exact, trustworthy. Clinical intelligence in its clearest visual form.`,
    allowText: true,
  },

  // ============================================================
  // GRAPHIC
  // ============================================================

  'flat-editorial': {
    category: 'graphic',
    palette: 'deep navy background #0D1B4B, warm cream shapes #F5F0E8, sage-green mid-tones #5E8F6E, amber accent detail #D4843A',
    lighting: 'No lighting. Bold flat graphic. Zero shadows, zero gradients.',
    camera:   'Graphic design. Editorial poster composition. Strong visual hierarchy.',
    style: `Bold modern flat design illustration. Bauhaus aesthetic meets clinical editorial.
Deep navy background. Geometric shapes, simplified organic forms, and deliberate negative space.
Cream and sage shapes are the primary visual language. One amber accent detail draws the eye.
The composition should tell the story of the article topic through graphic abstraction —
not through photographic representation.
Think: a poster for an intelligent medical conference, designed by a premium contemporary studio.
NO photography. NO 3D rendering. NO gradients. Pure flat vector-illustration aesthetic.
Strong visual hierarchy, intentional shape relationships, confident negative space.
Mood: modern, clear, confident. The graphic language of intelligent health.`,
    allowText: false,
  },

  'comparative-split': {
    category: 'graphic',
    palette: 'warm cream left panel #F5F0E8, cool grey-blue right panel #D4DCE8, midnight navy divider #0D1B4B, warm light left, cool light right',
    lighting: 'Slightly warmer light temperature on left panel (#F5F0E8 feel), slightly cooler on right (#D4DCE8 feel) — reinforces the visual contrast.',
    camera:   'Graphic composition. Both panels equal size, side-by-side. Both in sharp focus.',
    style: `Premium editorial split-frame composition designed for visual comparison between two subjects.
Two or three equal panels side-by-side, each representing one subject in the comparison.
Left panel: warm cream atmosphere, first subject in context and detail.
Right panel: cool grey-blue, second subject with contrasting visual tone.
Consistent composition within each panel — same angle, same scale — so comparison reads immediately.
A thin midnight navy divider separates the panels cleanly.
Subtle visual progression cue where relevant (smaller/dimmer left, larger/brighter right to imply evolution or difference).
Both panels must represent the SPECIFIC subjects being compared in this article.
Mood: intelligent editorial comparison. Clarity. Authority.`,
    allowText: false,
  },

  // ============================================================
  // CONCEPTUAL
  // ============================================================

  'concept-metaphor': {
    category: 'conceptual',
    palette: 'Choose the palette that SERVES the specific metaphor — do NOT default to cream and sage. Examples: deep gold and midnight for repair/healing; forest green and cream for growth; steel blue and amber for precision/measurement; terracotta and bone for warmth/human themes.',
    lighting: 'Choose the lighting that serves the metaphor — natural, studio, or ambient as the concept requires.',
    camera:   'Choose the angle and depth that best communicates the metaphor.',
    style: `Sophisticated visual metaphor that captures the conceptual core of this specific article.
This is the most art-directed treatment. The image makes the viewer think before they read.
Draw from a rich metaphor vocabulary — choose ONE that fits this exact article topic:
  • Kintsugi gold-veined repair — for healing, recovery, tissue repair articles
  • A single mountain ridge ascending through cloud — for dose escalation, titration, progression
  • Flowing ribbons of light through space — for cellular signaling, receptor activation
  • Precision instruments (calipers, balance scale, compass) — for measurement, titration, dosing accuracy
  • Geological strata layers — for layered mechanisms, history, foundations
  • A still pool surface broken by a single droplet — for receptor activation, biological initiation
  • Faceted crystal refracting light into a spectrum — for bioavailability, absorption, metabolic conversion
  • A seed cracking through dense stone — for biological initiation, first therapeutic response
Choose the metaphor that is SPECIFIC to this article — not a generic science image.
Then choose a palette that serves the metaphor emotionally, NOT the standard sage-and-cream.
Composition: cinematic, intentional, magazine cover quality. Premium conceptual photography or hyperreal illustration.
Mood: the image should make a thoughtful person pause and feel something before they read.`,
    allowText: false,
  },

  'bold-infographic': {
    category: 'conceptual',
    palette: 'deep forest green background #1B4332 OR deep navy #0D1B4B, cream diagram lines #F5F0E8, white label elements, single amber data highlight #E8A43C',
    lighting: 'No lighting. Full-bleed background color, flat graphic.',
    camera:   'Graphic design. Full-bleed. Large confident elements fill the frame.',
    style: `Artistic data visualization hero — where a scientific diagram becomes bold editorial art.
Full-bleed deep forest green or deep navy background. Cream and white diagram lines, sparse abstract labels.
The visualization represents something REAL from this article's content:
  • Dose-response curve with labeled steps
  • Comparison bar chart between mechanisms or outcomes
  • A mechanism flow with labeled stages
  • A timeline of the titration protocol
  • A molecular comparison between two structures
Rendered as art, not as a slide deck. Large, confident graphic elements fill the frame.
Think: the opening spread of a data-driven magazine feature, where the visualization is designed to stop the scroll.
Single amber accent on the most important data point, line, or callout.
Mood: intelligent, bold, visually arresting. "This post has something specific to show you."`,
    allowText: true,
  },
};

// ─── CATEGORY MAP ─────────────────────────────────────────────────────────────

const CATEGORY_TREATMENTS = {
  photo:        ['editorial-scene', 'cinematic-dark', 'hyper-macro', 'lifestyle-minimal', 'clinical-context'],
  illustration: ['molecular-3d', 'tissue-anatomy', 'scientific-diagram'],
  graphic:      ['flat-editorial', 'comparative-split'],
  conceptual:   ['concept-metaphor', 'bold-infographic'],
};

// Preferred macro rotation — photo is most common, others interleave
const CATEGORY_ROTATION = [
  'photo', 'illustration', 'photo', 'graphic',
  'photo', 'conceptual',   'photo', 'illustration',
  'photo', 'graphic',      'photo', 'conceptual',
];

// ─── TREATMENT LOG ────────────────────────────────────────────────────────────

function readTreatmentLog() {
  try {
    if (!existsSync(TREATMENT_LOG)) return { entries: [] };
    return JSON.parse(readFileSync(TREATMENT_LOG, 'utf-8'));
  } catch {
    return { entries: [] };
  }
}

function writeTreatmentLog(entry) {
  const log = readTreatmentLog();
  log.entries.push(entry);
  if (log.entries.length > 90) log.entries = log.entries.slice(-90);
  writeFileSync(TREATMENT_LOG, JSON.stringify(log, null, 2) + '\n', 'utf-8');
}

function recentEntries(n = 4) {
  return readTreatmentLog().entries.slice(-n);
}

// ─── TREATMENT PICKER ────────────────────────────────────────────────────────
//
// Strategy:
//   1. Read recent entries to get last category and last treatment
//   2. Determine target category — enforce no same-category repeat
//   3. Apply topic signals to possibly override the target category
//   4. Pick specific treatment within the target category using topic sub-signals

function pickTreatment(track, topic, tags, slug) {
  const t = (topic || '').toLowerCase();
  const tagStr = tags.join(' ').toLowerCase();
  const combined = `${t} ${tagStr}`;

  const recent = recentEntries(4);
  const lastCategory  = recent.length ? recent[recent.length - 1].category  : null;
  const lastTreatment = recent.length ? recent[recent.length - 1].treatment : null;
  const recentTreatmentSet = new Set(recent.map(e => e.treatment));

  // Hash for deterministic-but-varied selection within a category
  const hash = createHash('md5').update(slug || topic || 'x').digest();

  // Step 1: Find next category from rotation, skipping the last-used one
  const rotationOffset = hash[0] % CATEGORY_ROTATION.length;
  let targetCategory = null;
  for (let i = 0; i < CATEGORY_ROTATION.length; i++) {
    const candidate = CATEGORY_ROTATION[(rotationOffset + i) % CATEGORY_ROTATION.length];
    if (candidate !== lastCategory) { targetCategory = candidate; break; }
  }
  if (!targetCategory) targetCategory = lastCategory === 'photo' ? 'illustration' : 'photo';

  // Step 2: Topic signal overrides — only fire if override category != lastCategory
  function tryCat(cat) { return cat !== lastCategory ? cat : null; }

  if (/\bvs\b|versus|compared|comparison|side.by.side|generations|generation gap/.test(t)) {
    const c = tryCat('graphic'); if (c) targetCategory = c;
  } else if (/mechanism|pathway|receptor|agonist|signaling|how it works|how does/.test(combined)) {
    const c = tryCat('illustration'); if (c) targetCategory = c;
  } else if (/tissue|tendon|ligament|collagen|adipos|adipocyte|neuron|vascular|skin|hair|gut lining|cell biology/.test(combined)) {
    const c = tryCat('illustration'); if (c) targetCategory = c;
  } else if (/counterfeit|fake|quality|coa|certificate|sourcing|regulatory|503[ab]|usp 797|fda rule|compounding law/.test(combined)) {
    const c = tryCat('photo'); if (c) targetCategory = c; // cinematic-dark
  } else if (/\bfaq\b|glossary|terminology|what is a|beginners guide|first.time|overview/.test(combined)) {
    const c = tryCat('conceptual'); if (c) targetCategory = c;
  } else if (/macro|crystalline|lyophilized|freeze.dried|molecular scale/.test(combined)) {
    const c = tryCat('photo'); if (c) targetCategory = c; // hyper-macro
  }

  // Step 3: Pick specific treatment within the target category
  const pool = CATEGORY_TREATMENTS[targetCategory];
  const freshPool = pool.filter(tx => !recentTreatmentSet.has(tx));
  const selectionPool = freshPool.length > 0 ? freshPool : pool;

  let selected = null;

  if (targetCategory === 'photo') {
    if (/counterfeit|fake|quality|coa|regulatory|fda|usp|price|cost|breakdown|503/.test(combined)) {
      selected = 'cinematic-dark';
    } else if (/macro|crystalline|lyophilized|freeze.dried|molecular scale/.test(combined)) {
      selected = 'hyper-macro';
    } else if (/protocol|reconstitution|storage|shipping|cold.chain|how to|technique|injection|routine/.test(combined)) {
      selected = selectionPool.includes('lifestyle-minimal') ? 'lifestyle-minimal' : 'editorial-scene';
    } else if (/product|spotlight|vial|concentration|formulation/.test(combined)) {
      const productPool = ['clinical-context', 'cinematic-dark', 'editorial-scene', 'hyper-macro'];
      const fresh = productPool.filter(tx => !recentTreatmentSet.has(tx));
      const p = fresh.length > 0 ? fresh : productPool;
      selected = p[hash[1] % p.length];
    } else {
      // Default photo: prefer editorial-scene unless just used
      selected = (selectionPool.includes('editorial-scene') && lastTreatment !== 'editorial-scene')
        ? 'editorial-scene'
        : selectionPool[hash[1] % selectionPool.length];
    }
  } else if (targetCategory === 'illustration') {
    if (/tissue|tendon|ligament|collagen|adipos|skin|hair|gut|brain|neuron|vascular|anatomy/.test(combined)) {
      selected = 'tissue-anatomy';
    } else if (/diagram|protocol|step|ladder|titration|schedule|timeline|dosing|protocol/.test(combined)) {
      selected = 'scientific-diagram';
    } else {
      selected = 'molecular-3d';
    }
    if (selected === lastTreatment && selectionPool.length > 1) {
      selected = selectionPool.find(tx => tx !== lastTreatment) || selected;
    }
  } else if (targetCategory === 'graphic') {
    selected = /\bvs\b|versus|comparison|compared|generations|side.by.side/.test(t)
      ? 'comparative-split'
      : 'flat-editorial';
    if (selected === lastTreatment) {
      selected = pool.find(tx => tx !== lastTreatment) || selected;
    }
  } else if (targetCategory === 'conceptual') {
    selected = /faq|glossary|question|beginner|what is|overview|basics/.test(combined)
      ? 'bold-infographic'
      : 'concept-metaphor';
    if (selected === lastTreatment) {
      selected = pool.find(tx => tx !== lastTreatment) || selected;
    }
  }

  return selected || selectionPool[hash[0] % selectionPool.length];
}

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────

function buildPrompt(treatmentKey, topic, tags) {
  const def = TREATMENTS[treatmentKey];
  const tagHint = tags.length
    ? `Specific subject cues for this article: ${tags.slice(0, 5).join(', ')}.`
    : '';

  const baseNegatives = [
    'No people, no faces, no hands, no visible human body parts of any kind.',
    'No syringes in use, no medical procedures being performed on a person.',
    'No prescription drug bottle labeling, Rx symbols, or pharmaceutical brand identifiers.',
    'No generic "vial on plain white background" — every image must be specific and intentional.',
    'The image must be sharp and in focus — no unwanted blur, no soft-focus haze on the subject.',
    'No real-world brand logos, real company names, or watermarks.',
  ];
  const textNegative = def.allowText
    ? 'Any text must be ABSTRACT and MINIMAL — short placeholder labels only (e.g. "GLP-1", "T½", "15mg") — sparse and intentional, never dense copy or real marketing language.'
    : 'Absolutely no text, words, letters, numbers, logos, or labels anywhere in the image.';

  const lines = [
    `TREATMENT: ${treatmentKey.toUpperCase()} (${def.category})`,
    ``,
    `COLOR PALETTE: ${def.palette}`,
    def.lighting ? `LIGHTING: ${def.lighting}` : null,
    def.camera   ? `LENS / CAMERA: ${def.camera}` : null,
    ``,
    `VISUAL STYLE:`,
    def.style,
    ``,
    `SUBJECT — MOST IMPORTANT DIRECTIVE:`,
    `This is the hero image for a blog post titled: "${topic}"`,
    tagHint || null,
    `Translate the specific topic of this article into the visual treatment described above.`,
    `A reader seeing only this image — before reading a single word — must sense what the article is about.`,
    `Do NOT produce a generic science or wellness image. Do NOT produce a generic vial photo.`,
    `Be SPECIFIC to this exact article topic.`,
    ``,
    `OUTPUT FORMAT: Landscape 16:9, full-width blog hero. Ultra-high quality, sharp, magazine-grade.`,
    ``,
    `PROHIBITIONS — any of these will cause the image to be rejected:`,
    ...baseNegatives.map(n => `• ${n}`),
    `• ${textNegative}`,
  ].filter(l => l !== null);

  return lines.join('\n');
}

// ─── ALT TEXT ─────────────────────────────────────────────────────────────────

const ALT_LEADS = {
  'editorial-scene':    'Editorial still life for',
  'cinematic-dark':     'Cinematic dark studio photograph for',
  'hyper-macro':        'Extreme macro photograph illustrating',
  'lifestyle-minimal':  'Minimal wellness lifestyle image for',
  'clinical-context':   'Clinical context photograph for',
  'molecular-3d':       'Premium 3D molecular illustration for',
  'tissue-anatomy':     'Anatomical illustration for',
  'scientific-diagram': 'Technical diagram illustrating',
  'flat-editorial':     'Bold editorial graphic for',
  'comparative-split':  'Split-frame visual comparison for',
  'concept-metaphor':   'Visual metaphor representing',
  'bold-infographic':   'Bold data visualization for',
};

function buildAltText(treatmentKey, topic) {
  const lead = ALT_LEADS[treatmentKey] || 'Editorial illustration for';
  return `${lead} ${topic}`.slice(0, 280);
}

// ─── RESOLVE TREATMENT ────────────────────────────────────────────────────────

let treatmentKey;
if (treatmentOverride) {
  if (!TREATMENTS[treatmentOverride]) {
    console.error(`ERROR: Unknown --treatment "${treatmentOverride}".`);
    console.error(`Valid treatments: ${Object.keys(TREATMENTS).join(', ')}`);
    process.exit(1);
  }
  treatmentKey = treatmentOverride;
  console.error(`ℹ️  Treatment manually overridden to: ${treatmentKey}`);
} else {
  treatmentKey = pickTreatment(track, topic, tags, slug);
}

const treatmentDef = TREATMENTS[treatmentKey];
const prompt   = buildPrompt(treatmentKey, topic, tags);
const altText  = buildAltText(treatmentKey, topic);

// ─── GEMINI API ───────────────────────────────────────────────────────────────

async function generateImage(promptText) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'Gemini fallback path invoked but GEMINI_API_KEY is not set in .env.local. ' +
      'Higgsfield (Nano Banana Pro) is now the default — call this script with ' +
      '--print-prompt and orchestrate generate_image via the Higgsfield MCP instead.'
    );
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: promptText }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      imageConfig: { image_size: '2K' },
    },
  };

  if (DRY_RUN) {
    console.error('🟡 DRY RUN — not calling Gemini. Treatment + prompt printed below.');
    console.error(`\n📋 Treatment: ${treatmentKey}  |  Category: ${treatmentDef.category}\n`);
    console.error('═══════════════════════ PROMPT ═══════════════════════');
    console.error(promptText);
    console.error('══════════════════════════════════════════════════════\n');
    return null;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errBody.slice(0, 600)}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const inlineData = parts.find(p => p.inlineData)?.inlineData;

  if (!inlineData?.data) {
    throw new Error('Gemini response missing image data. Full response: ' + JSON.stringify(data).slice(0, 800));
  }

  return {
    mimeType: inlineData.mimeType || 'image/jpeg',
    buffer:   Buffer.from(inlineData.data, 'base64'),
  };
}

// ─── SANITY UPLOAD ────────────────────────────────────────────────────────────

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token:     process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

async function uploadToSanity(buffer, filename, contentType) {
  const asset = await sanity.assets.upload('image', buffer, { filename, contentType });
  return asset._id;
}

// ─── PRINT-PROMPT MODE ────────────────────────────────────────────────────────
//
// --print-prompt: outputs the full treatment plan as JSON and exits immediately.
// No Gemini API call, no Sanity upload, no treatment-log write.
//
// This is the entry point for the Higgs Field flow — Claude calls this first
// to get the treatment selection, prompt, and Higgs model recommendation, then
// calls the Higgs Field MCP generate_image tool with those values.
//
// Output shape:
//   {
//     "treatment": "cinematic-dark",
//     "category":  "photo",
//     "altText":   "Cinematic dark studio photograph for ...",
//     "prompt":    "TREATMENT: CINEMATIC-DARK...",
//     "higgs": {
//       "model":        "cinematic_studio_2_5",
//       "aspect_ratio": "16:9",
//       "params":       { "resolution": "2k" }
//     }
//   }

if (PRINT_PROMPT) {
  const higgsConfig = HIGGS_MODELS[treatmentKey] || HIGGS_MODELS['editorial-scene'];
  const out = {
    treatment:    treatmentKey,
    category:     treatmentDef.category,
    altText,
    prompt,
    higgs: {
      model:        higgsConfig.model,
      aspect_ratio: higgsConfig.aspect_ratio,
      params:       higgsConfig.params,
    },
  };
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  try {
    console.error(`📸 Generating hero`);
    console.error(`   Track:     ${track}`);
    console.error(`   Treatment: ${treatmentKey}  (${treatmentDef.category})`);
    console.error(`   Topic:     ${topic}`);
    console.error(`   Model:     ${GEMINI_MODEL}`);

    const result = await generateImage(prompt);

    if (DRY_RUN) {
      const out = {
        assetId: null, alt: altText, filename: null,
        treatment: treatmentKey, category: treatmentDef.category, dryRun: true,
      };
      console.log(JSON.stringify(out));
      process.exit(0);
    }

    const ext      = result.mimeType.includes('jpeg') ? 'jpg' : 'png';
    const filename = `${treatmentKey}-${slug || 'hero'}-${Date.now()}.${ext}`;

    mkdirSync(LIBRARY_DIR, { recursive: true });
    writeFileSync(join(LIBRARY_DIR, filename), result.buffer);
    console.error(`💾 Saved: public/images/blog-heroes/${filename}`);

    console.error('☁️  Uploading to Sanity...');
    const assetId = await uploadToSanity(result.buffer, filename, result.mimeType);
    console.error(`✅ Asset ID: ${assetId}`);

    // Write to dedicated treatment log immediately — before publish step
    writeTreatmentLog({
      ts:        new Date().toISOString(),
      slug:      slug || 'unknown',
      treatment: treatmentKey,
      category:  treatmentDef.category,
      track,
    });
    console.error(`📋 Logged → treatment-log.json: ${treatmentKey} (${treatmentDef.category})`);

    const out = { assetId, alt: altText, filename, treatment: treatmentKey, category: treatmentDef.category };
    console.log(JSON.stringify(out));
    process.exit(0);

  } catch (err) {
    console.error(`❌ Image generation failed: ${err.message}`);
    process.exit(1);
  }
})();
