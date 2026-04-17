/**
 * Greenstone Peptides — Upload AI-Generated Product Images to Sanity
 * Run: node scripts/upload-new-product-images.mjs
 *
 * Uploads 18 unique images from nanobanana-output/ once each,
 * then patches all 50 active products with the correct image reference.
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ─── ENV ─────────────────────────────────────────────────────────────────────

const envPath = path.join(ROOT, '.env.local')
if (!existsSync(envPath)) {
  console.error('Missing .env.local — cannot read Sanity credentials')
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.trim() && !l.trim().startsWith('#'))
    .map(l => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token     = env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── IMAGE MAP ───────────────────────────────────────────────────────────────
// key: logical image id  →  { file, label, altSuffix }

const IMAGE_DIR = path.join(ROOT, 'nanobanana-output')

const IMAGE_CATALOG = {
  'sema-5mg':         { file: 'product_photography_of_a_single__7.png',   label: 'Semaglutide 5mg/mL' },
  'sema-2-5mg':       { file: 'product_photography_of_a_single__18.png',  label: 'Semaglutide 2.5mg/mL' },
  'sema-10mg':        { file: 'product_photography_of_a_single__19.png',  label: 'Semaglutide 10mg/mL' },
  'sema-odt':         { file: 'product_photography_of_a_single__33.png',  label: 'Semaglutide ODT' },
  'tirz-10mg':        { file: 'product_photography_of_a_single__20.png',  label: 'Tirzepatide 10mg/mL' },
  'tirz-15mg':        { file: 'product_photography_of_a_single__21.png',  label: 'Tirzepatide 15mg/mL' },
  'tirz-20mg':        { file: 'product_photography_of_a_single__23.png',  label: 'Tirzepatide 20mg/mL' },
  'tirz-odt':         { file: 'product_photography_of_a_single__34.png',  label: 'Tirzepatide ODT' },
  'retatrutide':      { file: 'product_photography_of_a_single__16.png',  label: 'Retatrutide' },
  'bpc-157':          { file: 'product_photography_of_a_single__24.png',  label: 'BPC-157' },
  'tb-500':           { file: 'product_photography_of_a_single__25.png',  label: 'TB-500' },
  'nad-injectable':   { file: 'product_photography_of_a_single__26.png',  label: 'NAD+ Injectable' },
  'nad-nasal':        { file: 'product_photography_of_a_single__35.png',  label: 'NAD+ Nasal Spray' },
  'ghk-cu':           { file: 'product_photography_of_a_single__27.png',  label: 'GHK-Cu' },
  'mots-c':           { file: 'product_photography_of_a_single__28.png',  label: 'MOTS-c' },
  'sermorelin':       { file: 'product_photography_of_a_single__29.png',  label: 'Sermorelin' },
  'tesamorelin':      { file: 'product_photography_of_a_single__30.png',  label: 'Tesamorelin' },
  'sema-nad-combo':   { file: 'product_photography_of_a_single__31.png',  label: 'Semaglutide/NAD+ Combo' },
  'tirz-glycine':     { file: 'product_photography_of_a_single__32.png',  label: 'Tirzepatide/Glycine Combo' },
  'starter-kit':      { file: 'product_photography_of_a_small_r_2.png',   label: 'Starter Kit' },
}

// ─── MATCHING LOGIC ──────────────────────────────────────────────────────────

/**
 * Given a product's slug, name, strength, and format — return the image catalog key.
 * Returns null if no image applies.
 */
function resolveImageKey(product) {
  const slug    = (product.slug?.current || '').toLowerCase()
  const name    = (product.name          || '').toLowerCase()
  const strength = (product.strength     || '').toLowerCase()
  const format   = (product.format       || '').toLowerCase()

  // ── Starter Kits ──────────────────────────────────────────────────────
  if (format === 'kit' || slug.includes('kit') || slug.includes('starter')) {
    return 'starter-kit'
  }

  // ── Combos (check before single-peptide rules) ─────────────────────────
  // semaglutide + NAD combo
  if (
    (slug.includes('semaglutide') || slug.includes('sema')) &&
    (slug.includes('nad') || name.includes('nad'))
  ) {
    return 'sema-nad-combo'
  }
  // tirzepatide + glycine combo
  if (
    (slug.includes('tirzepatide') || slug.includes('tirz')) &&
    (slug.includes('glycine') || name.includes('glycine'))
  ) {
    return 'tirz-glycine'
  }

  // ── Semaglutide ────────────────────────────────────────────────────────
  if (slug.includes('semaglutide') || name.includes('semaglutide')) {
    // ODT first
    if (format === 'odt' || slug.includes('odt')) {
      return 'sema-odt'
    }
    // injectable — match by concentration
    if (slug.includes('10mg') || strength.includes('10mg')) return 'sema-10mg'
    if (slug.includes('5mg')  || strength.includes('5mg'))  return 'sema-5mg'
    if (slug.includes('2-5mg') || strength.includes('2.5mg')) return 'sema-2-5mg'
    // fallback for any remaining sema injectable
    return 'sema-2-5mg'
  }

  // ── Tirzepatide ───────────────────────────────────────────────────────
  if (slug.includes('tirzepatide') || name.includes('tirzepatide')) {
    if (format === 'odt' || slug.includes('odt')) {
      return 'tirz-odt'
    }
    if (slug.includes('20mg') || strength.includes('20mg')) return 'tirz-20mg'
    if (slug.includes('15mg') || strength.includes('15mg')) return 'tirz-15mg'
    if (slug.includes('10mg') || strength.includes('10mg')) return 'tirz-10mg'
    return 'tirz-10mg'
  }

  // ── Retatrutide ───────────────────────────────────────────────────────
  if (slug.includes('retatrutide') || name.includes('retatrutide')) {
    return 'retatrutide'
  }

  // ── BPC-157 ───────────────────────────────────────────────────────────
  if (slug.includes('bpc') || name.includes('bpc')) {
    return 'bpc-157'
  }

  // ── TB-500 ────────────────────────────────────────────────────────────
  if (slug.includes('tb-500') || slug.includes('tb500') || name.includes('tb-500') || name.includes('tb500') || name.includes('thymosin beta')) {
    return 'tb-500'
  }

  // ── NAD+ — nasal before injectable ────────────────────────────────────
  if (slug.includes('nad') || name.includes('nad')) {
    if (
      format === 'nasal-spray' ||
      slug.includes('nasal') ||
      name.includes('nasal')
    ) {
      return 'nad-nasal'
    }
    return 'nad-injectable'
  }

  // ── GHK-Cu ───────────────────────────────────────────────────────────
  if (slug.includes('ghk') || name.includes('ghk')) {
    return 'ghk-cu'
  }

  // ── MOTS-c ───────────────────────────────────────────────────────────
  if (slug.includes('mots') || name.includes('mots')) {
    return 'mots-c'
  }

  // ── Sermorelin ────────────────────────────────────────────────────────
  if (slug.includes('sermorelin') || name.includes('sermorelin')) {
    return 'sermorelin'
  }

  // ── Tesamorelin ───────────────────────────────────────────────────────
  if (slug.includes('tesamorelin') || name.includes('tesamorelin')) {
    return 'tesamorelin'
  }

  return null
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\nGreenstone Peptides — Upload AI Product Images`)
  console.log(`Project: ${projectId} / ${dataset}\n`)

  // 1. Fetch all active products
  console.log('Fetching active products from Sanity...')
  const products = await client.fetch(
    `*[_type == "product" && active == true]{ _id, slug, name, strength, format }`
  )
  console.log(`Found ${products.length} active products\n`)

  // 2. Determine which image keys are actually needed
  const neededKeys = new Set()
  const productImageMap = new Map() // _id -> imageKey

  for (const product of products) {
    const key = resolveImageKey(product)
    if (key) {
      neededKeys.add(key)
      productImageMap.set(product._id, key)
    } else {
      productImageMap.set(product._id, null)
    }
  }

  // 3. Upload each needed image exactly once
  console.log(`Uploading ${neededKeys.size} unique images...\n`)
  const assetCache = new Map() // imageKey -> asset._id

  for (const key of neededKeys) {
    const entry = IMAGE_CATALOG[key]
    if (!entry) {
      console.warn(`  WARN: No catalog entry for key "${key}" — skipping`)
      continue
    }

    const filePath = path.join(IMAGE_DIR, entry.file)
    if (!existsSync(filePath)) {
      console.warn(`  WARN: File not found: ${entry.file} — skipping key "${key}"`)
      continue
    }

    try {
      const buffer = readFileSync(filePath)
      const asset = await client.assets.upload('image', buffer, {
        filename:    entry.file,
        contentType: 'image/png',
      })
      assetCache.set(key, asset._id)
      console.log(`  Uploaded [${key}] → ${asset._id}`)
    } catch (err) {
      console.error(`  ERROR uploading [${key}]: ${err.message}`)
    }
  }

  // 4. Patch each product with the correct image asset
  console.log(`\nPatching ${products.length} products...\n`)
  let matched = 0
  let skipped = 0
  let failed  = 0

  for (const product of products) {
    const slug = product.slug?.current || product._id
    const key  = productImageMap.get(product._id)

    if (!key) {
      console.warn(`  SKIP [no match]  ${slug}`)
      skipped++
      continue
    }

    const assetId = assetCache.get(key)
    if (!assetId) {
      console.warn(`  SKIP [no asset]  ${slug} (key: ${key})`)
      skipped++
      continue
    }

    try {
      await client
        .patch(product._id)
        .set({
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt:   `${product.name} — Greenstone Peptides`,
          },
        })
        .commit()

      console.log(`  OK  [${key}]  ${slug}`)
      matched++
    } catch (err) {
      console.error(`  ERR  ${slug}: ${err.message}`)
      failed++
    }
  }

  console.log(`\n--- DONE ---`)
  console.log(`  Images uploaded: ${assetCache.size} of ${neededKeys.size} needed`)
  console.log(`  Products patched: ${matched}`)
  console.log(`  Products skipped (no match/asset): ${skipped}`)
  console.log(`  Products failed: ${failed}`)
  console.log(`  Total active products: ${products.length}\n`)
}

run().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
