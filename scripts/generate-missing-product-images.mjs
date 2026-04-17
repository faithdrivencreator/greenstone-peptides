/**
 * Generates product images for slugs that exist in Sanity but
 * were not covered by the initial generation script (slug naming differences).
 */
import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const TEMPLATES = {
  injectable:    path.join(ROOT, 'nanobanana-output', 'vial-template.png'),
  odt:           path.join(ROOT, 'nanobanana-output', 'odt-template.png'),
  'nasal-spray': path.join(ROOT, 'nanobanana-output', 'nasal-template.png'),
  kit:           path.join(ROOT, 'nanobanana-output', 'kit-template.png'),
}

const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'products')
const OUT_W = 1200
const OUT_H = 900
const LABEL_W = 280
const LABEL_H = 160

// Products keyed to actual Sanity slugs
const products = [
  // RECOVERY — slug variants with -ml suffix
  { slug: 'bpc-157-10mg-ml', name: 'BPC-157', strength: '10mg/mL', size: '5mL', format: 'injectable' },
  { slug: 'tb-500-10mg-ml',  name: 'TB-500',  strength: '10mg/mL', size: '5mL', format: 'injectable' },
  // ENERGY
  { slug: 'nad-plus-50mg',        name: 'NAD+',       strength: '50mg',     size: '5mL',  format: 'injectable' },
  { slug: 'nad-plus-200mg-ml',    name: 'NAD+',       strength: '200mg/mL', size: '5mL',  format: 'injectable' },
  { slug: 'nad-plus-nasal-spray', name: 'NAD+ Nasal', strength: '300mg/mL', size: '15mL', format: 'nasal-spray' },
  // RETATRUTIDE
  { slug: 'retatrutide-20mg-ml-1ml', name: 'Retatrutide', strength: '20mg/mL', size: '1mL', format: 'injectable' },
  { slug: 'retatrutide-20mg-ml-3ml', name: 'Retatrutide', strength: '20mg/mL', size: '3mL', format: 'injectable' },
  { slug: 'retatrutide-20mg-ml-5ml', name: 'Retatrutide', strength: '20mg/mL', size: '5mL', format: 'injectable' },
  // SEMAGLUTIDE INJECTABLE — 10mg/mL slug variant
  { slug: 'semaglutide-10mg-ml-5ml',    name: 'Semaglutide', strength: '10mg/mL',  size: '5mL',   format: 'injectable' },
  // SEMAGLUTIDE INJECTABLE — 2.5mg/mL slug variants with -ml-
  { slug: 'semaglutide-2-5mg-ml-0-5ml', name: 'Semaglutide', strength: '2.5mg/mL', size: '0.5mL', format: 'injectable' },
  { slug: 'semaglutide-2-5mg-ml-1ml',   name: 'Semaglutide', strength: '2.5mg/mL', size: '1mL',   format: 'injectable' },
  { slug: 'semaglutide-2-5mg-ml-2ml',   name: 'Semaglutide', strength: '2.5mg/mL', size: '2mL',   format: 'injectable' },
  { slug: 'semaglutide-2-5mg-ml-3ml',   name: 'Semaglutide', strength: '2.5mg/mL', size: '3mL',   format: 'injectable' },
  { slug: 'semaglutide-2-5mg-ml-4ml',   name: 'Semaglutide', strength: '2.5mg/mL', size: '4mL',   format: 'injectable' },
  // SEMAGLUTIDE INJECTABLE — 5mg/mL slug variant
  { slug: 'semaglutide-5mg-ml-5ml',     name: 'Semaglutide', strength: '5mg/mL',   size: '5mL',   format: 'injectable' },
  // SEMAGLUTIDE ODT
  { slug: 'semaglutide-0-5mg-odt-30ct', name: 'Semaglutide ODT', strength: '0.5mg', size: '30 tablets', format: 'odt' },
  { slug: 'semaglutide-0-5mg-odt-60ct', name: 'Semaglutide ODT', strength: '0.5mg', size: '60 tablets', format: 'odt' },
  { slug: 'semaglutide-0-5mg-odt-90ct', name: 'Semaglutide ODT', strength: '0.5mg', size: '90 tablets', format: 'odt' },
  { slug: 'semaglutide-1-5mg-odt-30ct', name: 'Semaglutide ODT', strength: '1.5mg', size: '30 tablets', format: 'odt' },
  { slug: 'semaglutide-1-5mg-odt-60ct', name: 'Semaglutide ODT', strength: '1.5mg', size: '60 tablets', format: 'odt' },
  { slug: 'semaglutide-1-5mg-odt-90ct', name: 'Semaglutide ODT', strength: '1.5mg', size: '90 tablets', format: 'odt' },
  // TIRZEPATIDE INJECTABLE — slug variants
  { slug: 'tirzepatide-10mg-ml-2ml',  name: 'Tirzepatide', strength: '10mg/mL', size: '2mL', format: 'injectable' },
  { slug: 'tirzepatide-10mg-ml-4ml',  name: 'Tirzepatide', strength: '10mg/mL', size: '4mL', format: 'injectable' },
  { slug: 'tirzepatide-10mg-ml-5ml',  name: 'Tirzepatide', strength: '10mg/mL', size: '5mL', format: 'injectable' },
  { slug: 'tirzepatide-15mg-1ml',     name: 'Tirzepatide', strength: '15mg/mL', size: '1mL', format: 'injectable' },
  { slug: 'tirzepatide-20mg-1ml',     name: 'Tirzepatide', strength: '20mg/mL', size: '1mL', format: 'injectable' },
  // TIRZEPATIDE ODT
  { slug: 'tirzepatide-0-5mg-odt-30ct', name: 'Tirzepatide ODT', strength: '0.5mg', size: '30 tablets', format: 'odt' },
  { slug: 'tirzepatide-0-5mg-odt-60ct', name: 'Tirzepatide ODT', strength: '0.5mg', size: '60 tablets', format: 'odt' },
  { slug: 'tirzepatide-0-5mg-odt-90ct', name: 'Tirzepatide ODT', strength: '0.5mg', size: '90 tablets', format: 'odt' },
  // COMBO — slug variant
  { slug: 'tirzepatide-glycine-20mg-5mg', name: 'Tirzepatide + Glycine', strength: '20mg/5mg', size: '5mL', format: 'injectable' },
]

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function createLabelSvg(name, strength, size, width = LABEL_W, height = LABEL_H) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" rx="4" fill="white" fill-opacity="0.92"/>
      <rect x="0" y="0" width="${width}" height="3" fill="#1a3a2a"/>
      <text x="${width / 2}" y="28" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="bold" fill="#1a3a2a" letter-spacing="3">GREENSTONE PEPTIDES</text>
      <line x1="40" y1="38" x2="${width - 40}" y2="38" stroke="#c9a96e" stroke-width="1"/>
      <text x="${width / 2}" y="72" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#1a1a1a">${escapeXml(name)}</text>
      <text x="${width / 2}" y="98" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#555">${escapeXml(strength)}</text>
      <text x="${width / 2}" y="120" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#777">${escapeXml(size)}</text>
      <rect x="0" y="${height - 3}" width="${width}" height="3" fill="#1a3a2a"/>
    </svg>
  `)
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let success = 0
  let failed = 0

  for (const product of products) {
    const { slug, name, strength, size, format } = product
    const templatePath = TEMPLATES[format]

    if (!templatePath || !existsSync(templatePath)) {
      console.error(`✗ ${slug}: missing template for format "${format}"`)
      failed++
      continue
    }

    const outPath = path.join(OUTPUT_DIR, `${slug}.png`)

    try {
      const labelSvg = createLabelSvg(name, strength, size)
      const labelLeft = Math.round((OUT_W - LABEL_W) / 2)
      const labelTop  = Math.round((OUT_H - LABEL_H) / 2)

      await sharp(templatePath)
        .resize(OUT_W, OUT_H, { fit: 'cover', position: 'centre' })
        .composite([{ input: labelSvg, top: labelTop, left: labelLeft }])
        .png({ compressionLevel: 8 })
        .toFile(outPath)

      console.log(`✓ ${slug}`)
      success++
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${success} generated, ${failed} failed.`)
}

main()
