/**
 * TEST SCRIPT — Warm Stoic Hero Direction (one-off candidate generator)
 *
 * Generates a single test hero in the new locked direction:
 *   Mood: warm modern stoic — cream, sand, sage, travertine, warm charcoal
 *   Medium: photographic base + subtle magazine-cover overlay
 *   Subject lane: VIAL / PRODUCT (today's test = Tesamorelin 5mg spotlight)
 *
 * Saves locally, uploads to Sanity, prints assetId. Does NOT modify the live
 * post or replace the existing hero — that's a separate manual step after Pete
 * approves the look.
 *
 * Usage:
 *   node scripts/test-warm-stoic-hero.mjs
 */

import { createClient } from '@sanity/client';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'blog-heroes', 'warm-stoic-tests');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Load .env.local manually (script runs outside Next.js env)
const envFile = resolve(ROOT, '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';

// ─── PROMPT — locked warm-stoic spotlight direction ──────────────────────────

const PROMPT = `Editorial product photograph for Greenstone Peptides — a premium 503A-compounded peptide brand. 16:9 horizontal magazine-cover composition.

SUBJECT
A single clear apothecary glass vial sits upright on a natural travertine stone surface. The vial is filled with a clear, colorless, perfectly clean sterile liquid — water-like in transparency — reaching about three-quarters of the way up the vial, with a small empty headspace beneath the crimp top. The liquid is utterly clear, no particulates, no cloudiness, no tint. Light passes through the liquid and casts a soft refractive highlight on the travertine behind the vial. NO powder, NO cake, NO crystals, NO cracked solid at the bottom — the product is a finished sterile solution.

The vial has a clean minimalist uncoated paper label wrapping the middle of the vial, printed entirely in deep warm charcoal ink. Label content, top to bottom, perfectly spelled and centered:

  Line 1 — Small serif italic in Cormorant Garamond: "Greenstone Peptides"
  Line 2 — Thin horizontal rule, warm gold ink (#B89B6A), about 60% of label width
  Line 3 — Bold sans-serif small caps, larger: "TESAMORELIN"
  Line 4 — Thin spaced sans-serif: "5 MG / VIAL"

Brushed aluminum crimp top with a small rubber stopper visible just below it. The vial sits slightly right of center to leave breathing space on the upper left.

LIGHTING
A single soft north-facing window light from the upper left. Morning quality, gentle diffusion, slow falloff. Soft long shadow falling toward the right. Subtle natural haze in the air. No artificial fill, no harsh highlights. The mood is quiet, contemplative, almost devotional.

COLOR ATMOSPHERE
A warm modern stoic environment dominated by soft cream parchment tones, warm sand mid-tones, natural travertine stone, soft sage green organic accents, and deep warm umber/charcoal anchors. The whole scene reads cream, sand, sage, and stone. Strictly avoid cool blues, clinical white, teal, cyan, neon, electric color, or any green other than soft sage.

ABSOLUTELY DO NOT render any literal printer color-bar, palette swatch strip, color reference card, gradient sample bar, or vertical stripes of color anywhere in the image. The palette guidance is for the scene's atmosphere only — never depict it as graphic strips.

MATERIALS IN FRAME
Hand-laid travertine slab as the surface (visible natural grain and porosity).
A loosely folded raw oatmeal-linen napkin trailing behind the vial at low angle.
A single small dried sage sprig laid flat on the linen for organic life.
The vial itself: frosted-clear glass with subtle natural reflections, matte uncoated paper label.

BRANDED MASTHEAD — top-center to top-left, magazine-cover style
Place a refined two-line masthead anchored in the upper portion of the cream background, never overlapping the vial:

  Line A (large, primary): "Greenstone Peptides" — set in Cormorant Garamond italic serif, deep warm charcoal #3A2F26, weight 500. Roughly 22% of frame width. Letter spacing slightly open.

  Line B (smaller, directly below Line A, centered to it): "PEPTIDE SOLUTIONS" — set in DM Sans or similar geometric sans, all caps, generously letter-spaced, in warm gold #B89B6A. Roughly 9% of frame width.

Both lines must be perfectly spelled, sharp, and legible. No drop shadow, no gradient, no decorative flourishes. Treat the masthead exactly like a Kinfolk or Cereal magazine masthead — restrained, confident, present but quiet.

CAMERA
Medium-format aesthetic, 80mm equivalent, f/4 aperture, ISO 100, slightly elevated three-quarter angle. Shallow but not aggressive depth of field — vial label and brand masthead both legible, background softly out of focus. Subtle natural film grain. Color depth and tonality of Kodak Portra 400.

MOOD
Warm modern stoic. Calm, grounded, premium, restrained. Quiet conviction — the visual equivalent of a measured paragraph rather than a sales pitch. Cereal magazine meets a 503A pharmacy. Apothecary editorial.

DO NOT INCLUDE
No powder, no lyophilized cake, no crystals, no granules, no solid material at the bottom of the vial — the contents are clear sterile liquid only. No color reference strips, no palette swatch bars, no vertical color blocks at the edges, no Pantone-style cards. No hospital or lab aesthetic. No scrubs, gloves, syringes, needles, IVs, or pills. No human hands. No clinical white walls. No glossy plastic surfaces. No chrome, glowing elements, lens flares, or HDR tone-mapping. No cyan, teal, or electric blue. No marketing starbursts, sale badges, sticker callouts, or QR codes. No multiple vials. No garbled, misspelled, or fake-looking text anywhere — every visible word must read correctly. No stock-photo medical clichés.`;

// ─── GEMINI CALL ──────────────────────────────────────────────────────────────

async function generate() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: PROMPT }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      imageConfig: { image_size: '2K' },
    },
  };

  console.error('📸 Generating WARM-STOIC test hero (Tesamorelin spotlight)');
  console.error(`   Model: ${GEMINI_MODEL}`);

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
    throw new Error('Gemini response missing image data: ' + JSON.stringify(data).slice(0, 600));
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

// ─── MAIN ────────────────────────────────────────────────────────────────────

const ts = Date.now();
const slug = 'warm-stoic-v3-tesamorelin';
const filename = `${slug}-${ts}.jpg`;
const localPath = join(OUT_DIR, filename);

const img = await generate();
writeFileSync(localPath, img.buffer);
console.error(`💾 Saved local: ${localPath}`);

console.error('☁️  Uploading to Sanity…');
const asset = await sanity.assets.upload('image', img.buffer, {
  filename,
  contentType: img.mimeType,
});
console.error(`✅ Asset ID: ${asset._id}`);

const altText = 'Warm-stoic editorial photograph of a Greenstone Tesamorelin 5mg lyophilized vial on travertine, with a soft sage sprig and linen.';

console.log(JSON.stringify({
  assetId:   asset._id,
  alt:       altText,
  filename,
  localPath: `public/images/blog-heroes/warm-stoic-tests/${filename}`,
  direction: 'warm-stoic-vial-spotlight',
}, null, 2));
