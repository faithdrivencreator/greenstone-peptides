import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Read .env.local manually (no dotenv dependency)
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

const IMAGE_DIR = path.join(ROOT, 'public', 'images', 'products')

async function uploadImages() {
  console.log(`Fetching active products from Sanity (${projectId}/${dataset})...`)
  const products = await client.fetch(
    `*[_type == "product" && active == true]{ _id, slug, name }`
  )
  console.log(`Found ${products.length} active products in Sanity\n`)

  let success = 0
  let skipped = 0
  let failed  = 0

  for (const product of products) {
    const slug = product.slug?.current
    if (!slug) {
      console.warn(`⚠ ${product._id} has no slug — skipping`)
      skipped++
      continue
    }

    const imagePath = path.join(IMAGE_DIR, `${slug}.png`)
    if (!existsSync(imagePath)) {
      console.warn(`⚠ No image file for slug: ${slug}`)
      skipped++
      continue
    }

    try {
      const imageBuffer = readFileSync(imagePath)

      const asset = await client.assets.upload('image', imageBuffer, {
        filename:    `${slug}.png`,
        contentType: 'image/png',
      })

      await client
        .patch(product._id)
        .set({
          image: {
            _type:  'image',
            asset:  { _type: 'reference', _ref: asset._id },
            alt:    `${product.name} — Greenstone Peptides`,
          },
        })
        .commit()

      console.log(`✓ ${slug} → ${asset._id}`)
      success++
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${success} uploaded, ${skipped} skipped, ${failed} failed.`)
}

uploadImages()
