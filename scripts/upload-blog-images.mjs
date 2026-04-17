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

const IMAGE_DIR = path.join(ROOT, 'nanobanana-output')

// Mapping: blog post title (substring match) → image filename
// Order matches publishedAt desc (post 1 = most recent)
const TITLE_TO_IMAGE = [
  { titleFragment: "Beginner's Guide to Peptide Therapy",      file: 'professional_editorial_photo_for.png'     },
  { titleFragment: 'What Is BPC-157',                          file: 'professional_editorial_photo_for_1.png'   },
  { titleFragment: 'Why Your Peptides Might Be Counterfeit',   file: 'professional_editorial_photo_for_2.png'   },
  { titleFragment: "Research Peptide Crackdown",               file: 'professional_editorial_photo_for_4.png'   },
  { titleFragment: 'GHK-Cu',                                   file: 'professional_editorial_photo_for_3.png'   },
  { titleFragment: 'How to Store Peptides',                    file: 'professional_editorial_photo_for_5.png'   },
  { titleFragment: 'NAD+',                                     file: 'professional_editorial_photo_for_6.png'   },
  { titleFragment: 'What Is Retatrutide',                      file: 'professional_editorial_photo_for_7.png'   },
  { titleFragment: 'RFK Jr',                                   file: 'professional_editorial_photo_for_8.png'   },
  { titleFragment: 'Semaglutide vs',                           file: 'professional_editorial_photo_for_9.png'   },
  { titleFragment: 'Sermorelin vs',                            file: 'professional_editorial_photo_for_10.png'  },
  { titleFragment: 'TB-500 vs BPC-157',                        file: 'professional_editorial_photo_for_11.png'  },
  { titleFragment: 'Tirzepatide Dosing',                       file: 'professional_editorial_photo_for_12.png'  },
  { titleFragment: 'USA-Compounded Peptides Cost',             file: 'professional_editorial_photo_for_13.png'  },
  { titleFragment: 'USP 797',                                  file: 'professional_editorial_photo_for_14.png'  },
]

const FALLBACK_FILE = 'professional_editorial_photo_for_5.png'

function resolveImageForPost(title) {
  for (const mapping of TITLE_TO_IMAGE) {
    if (title.includes(mapping.titleFragment)) {
      const filePath = path.join(IMAGE_DIR, mapping.file)
      if (existsSync(filePath)) return { file: mapping.file, filePath }
      // File missing — use fallback
      console.warn(`  ⚠ Image file missing for "${mapping.file}" — using fallback`)
      return { file: FALLBACK_FILE, filePath: path.join(IMAGE_DIR, FALLBACK_FILE) }
    }
  }
  // No mapping found — use fallback
  console.warn(`  ⚠ No mapping found for title: "${title}" — using fallback`)
  return { file: FALLBACK_FILE, filePath: path.join(IMAGE_DIR, FALLBACK_FILE) }
}

async function uploadBlogImages() {
  console.log(`Fetching blog posts from Sanity (${projectId}/${dataset})...`)
  const posts = await client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) { _id, title, slug }`
  )
  console.log(`Found ${posts.length} blog posts\n`)

  // Upload each unique image file once, cache asset IDs
  const assetCache = new Map() // file → asset._id

  let success = 0
  let skipped = 0
  let failed  = 0

  for (const post of posts) {
    const { file, filePath } = resolveImageForPost(post.title)
    console.log(`Processing: "${post.title}"`)
    console.log(`  Image: ${file}`)

    try {
      let assetId = assetCache.get(file)

      if (!assetId) {
        console.log(`  Uploading ${file} to Sanity assets...`)
        const imageBuffer = readFileSync(filePath)
        const asset = await client.assets.upload('image', imageBuffer, {
          filename:    file,
          contentType: 'image/png',
        })
        assetId = asset._id
        assetCache.set(file, assetId)
        console.log(`  Uploaded → ${assetId}`)
      } else {
        console.log(`  Reusing cached asset → ${assetId}`)
      }

      await client
        .patch(post._id)
        .set({
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt:   post.title,
          },
        })
        .commit()

      console.log(`  ✓ Patched mainImage on post ${post._id}\n`)
      success++
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}\n`)
      failed++
    }
  }

  console.log(`Done. ${success} posts updated, ${skipped} skipped, ${failed} failed.`)
  console.log(`${assetCache.size} unique image(s) uploaded to Sanity assets.`)
}

uploadBlogImages()
