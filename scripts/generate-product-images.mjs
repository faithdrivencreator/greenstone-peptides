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

const products = [
  // KITS
  { slug: '5-day-starter-kit',  name: '5-Day Starter Kit',  strength: 'Varies', size: '5-day supply',  format: 'kit' },
  { slug: '10-day-starter-kit', name: '10-Day Starter Kit', strength: 'Varies', size: '10-day supply', format: 'kit' },
  { slug: '15-day-starter-kit', name: '15-Day Starter Kit', strength: 'Varies', size: '15-day supply', format: 'kit' },
  { slug: '20-day-starter-kit', name: '20-Day Starter Kit', strength: 'Varies', size: '20-day supply', format: 'kit' },
  // RECOVERY
  { slug: 'bpc-157-5mg',    name: 'BPC-157',    strength: '5mg/mL',  size: '5mL', format: 'injectable' },
  { slug: 'bpc-157-10mg',   name: 'BPC-157',    strength: '10mg/mL', size: '5mL', format: 'injectable' },
  { slug: 'tb-500-5mg',     name: 'TB-500',     strength: '5mg/mL',  size: '5mL', format: 'injectable' },
  { slug: 'tb-500-10mg',    name: 'TB-500',     strength: '10mg/mL', size: '5mL', format: 'injectable' },
  { slug: 'ghk-cu-50mg',    name: 'GHK-Cu',     strength: '50mg',    size: '5mL', format: 'injectable' },
  { slug: 'tesamorelin-5mg',name: 'Tesamorelin', strength: '5mg',    size: '5mL', format: 'injectable' },
  // ENERGY / LONGEVITY
  { slug: 'nad-50mg',        name: 'NAD+',       strength: '50mg',      size: '5mL',  format: 'injectable' },
  { slug: 'nad-200mg',       name: 'NAD+',       strength: '200mg/mL',  size: '5mL',  format: 'injectable' },
  { slug: 'nad-nasal-300mg', name: 'NAD+ Nasal', strength: '300mg/mL',  size: '15mL', format: 'nasal-spray' },
  { slug: 'mots-c-20mg',     name: 'MOTS-c',     strength: '20mg',      size: '5mL',  format: 'injectable' },
  { slug: 'sermorelin-4mg',  name: 'Sermorelin', strength: '4mg',       size: '5mL',  format: 'injectable' },
  // SEMAGLUTIDE INJECTABLE
  { slug: 'semaglutide-2-5mg-0-5ml', name: 'Semaglutide', strength: '2.5mg/mL', size: '0.5mL', format: 'injectable' },
  { slug: 'semaglutide-2-5mg-1ml',   name: 'Semaglutide', strength: '2.5mg/mL', size: '1mL',   format: 'injectable' },
  { slug: 'semaglutide-2-5mg-2ml',   name: 'Semaglutide', strength: '2.5mg/mL', size: '2mL',   format: 'injectable' },
  { slug: 'semaglutide-5mg-1ml',     name: 'Semaglutide', strength: '5mg/mL',   size: '1mL',   format: 'injectable' },
  { slug: 'semaglutide-5mg-2ml',     name: 'Semaglutide', strength: '5mg/mL',   size: '2mL',   format: 'injectable' },
  { slug: 'semaglutide-5mg-3ml',     name: 'Semaglutide', strength: '5mg/mL',   size: '3mL',   format: 'injectable' },
  { slug: 'semaglutide-5mg-4ml',     name: 'Semaglutide', strength: '5mg/mL',   size: '4mL',   format: 'injectable' },
  { slug: 'semaglutide-5mg-5ml',     name: 'Semaglutide', strength: '5mg/mL',   size: '5mL',   format: 'injectable' },
  { slug: 'semaglutide-10mg-2ml',    name: 'Semaglutide', strength: '10mg/mL',  size: '2mL',   format: 'injectable' },
  // SEMAGLUTIDE ODT
  { slug: 'semaglutide-odt-0-5mg-30ct', name: 'Semaglutide ODT', strength: '0.5mg', size: '30 tablets', format: 'odt' },
  { slug: 'semaglutide-odt-0-5mg-60ct', name: 'Semaglutide ODT', strength: '0.5mg', size: '60 tablets', format: 'odt' },
  { slug: 'semaglutide-odt-1-5mg-30ct', name: 'Semaglutide ODT', strength: '1.5mg', size: '30 tablets', format: 'odt' },
  // TIRZEPATIDE INJECTABLE
  { slug: 'tirzepatide-10mg-1ml', name: 'Tirzepatide', strength: '10mg/mL', size: '1mL', format: 'injectable' },
  { slug: 'tirzepatide-10mg-2ml', name: 'Tirzepatide', strength: '10mg/mL', size: '2mL', format: 'injectable' },
  { slug: 'tirzepatide-10mg-3ml', name: 'Tirzepatide', strength: '10mg/mL', size: '3mL', format: 'injectable' },
  { slug: 'tirzepatide-15mg-2ml', name: 'Tirzepatide', strength: '15mg/mL', size: '2mL', format: 'injectable' },
  { slug: 'tirzepatide-15mg-3ml', name: 'Tirzepatide', strength: '15mg/mL', size: '3mL', format: 'injectable' },
  { slug: 'tirzepatide-15mg-4ml', name: 'Tirzepatide', strength: '15mg/mL', size: '4mL', format: 'injectable' },
  { slug: 'tirzepatide-15mg-5ml', name: 'Tirzepatide', strength: '15mg/mL', size: '5mL', format: 'injectable' },
  { slug: 'tirzepatide-20mg-2ml', name: 'Tirzepatide', strength: '20mg/mL', size: '2mL', format: 'injectable' },
  { slug: 'tirzepatide-20mg-3ml', name: 'Tirzepatide', strength: '20mg/mL', size: '3mL', format: 'injectable' },
  { slug: 'tirzepatide-20mg-4ml', name: 'Tirzepatide', strength: '20mg/mL', size: '4mL', format: 'injectable' },
  { slug: 'tirzepatide-20mg-5ml', name: 'Tirzepatide', strength: '20mg/mL', size: '5mL', format: 'injectable' },
  // TIRZEPATIDE ODT
  { slug: 'tirzepatide-odt-0-5mg-30ct', name: 'Tirzepatide ODT', strength: '0.5mg', size: '30 tablets', format: 'odt' },
  { slug: 'tirzepatide-odt-0-5mg-60ct', name: 'Tirzepatide ODT', strength: '0.5mg', size: '60 tablets', format: 'odt' },
  { slug: 'tirzepatide-odt-0-5mg-90ct', name: 'Tirzepatide ODT', strength: '0.5mg', size: '90 tablets', format: 'odt' },
  // RETATRUTIDE
  { slug: 'retatrutide-20mg-1ml', name: 'Retatrutide', strength: '20mg/mL', size: '1mL', format: 'injectable' },
  { slug: 'retatrutide-20mg-3ml', name: 'Retatrutide', strength: '20mg/mL', size: '3mL', format: 'injectable' },
  { slug: 'retatrutide-20mg-5ml', name: 'Retatrutide', strength: '20mg/mL', size: '5mL', format: 'injectable' },
  // COMBOS
  { slug: 'semaglutide-nad-combo',       name: 'Semaglutide + NAD+',     strength: '2.5mg/50mg', size: '5mL', format: 'injectable' },
  { slug: 'tirzepatide-glycine-combo',   name: 'Tirzepatide + Glycine',  strength: '20mg/5mg',   size: '5mL', format: 'injectable' },
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
    console.log(`Created ${OUTPUT_DIR}`)
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

      // Resize template to 1200x900, then composite label centered
      const labelLeft = Math.round((OUT_W - LABEL_W) / 2)
      const labelTop  = Math.round((OUT_H - LABEL_H) / 2)

      await sharp(templatePath)
        .resize(OUT_W, OUT_H, { fit: 'cover', position: 'centre' })
        .composite([{
          input: labelSvg,
          top: labelTop,
          left: labelLeft,
        }])
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
