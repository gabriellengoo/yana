import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from '@sanity/client'

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.tif', '.tiff'])
const folderArg = process.argv[2]
const dryRun = process.argv.includes('--dry-run')

const env = {
  projectId: process.env.SANITY_PROJECT_ID || process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || '3jsw2c0t',
  dataset: process.env.SANITY_DATASET || process.env.NUXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.NUXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_STUDIO_TOKEN
}

if (!folderArg) {
  console.error('Usage: npm run sanity:upload-images -- /path/to/images')
  process.exit(1)
}

const root = path.resolve(folderArg)

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`Image folder not found: ${root}`)
  process.exit(1)
}

const getImageFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const fullPath = path.join(dir, entry.name)
  if (entry.isDirectory()) return getImageFiles(fullPath)
  if (!entry.isFile()) return []
  return imageExtensions.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : []
})

const files = getImageFiles(root)

if (!files.length) {
  console.log(`No supported image files found in ${root}`)
  process.exit(0)
}

if (dryRun) {
  console.log(`Found ${files.length} image file(s):`)
  files.forEach((file) => console.log(`- ${path.relative(root, file)}`))
  process.exit(0)
}

if (!env.token) {
  console.error('Missing Sanity write token. Set SANITY_AUTH_TOKEN or SANITY_WRITE_TOKEN before running this script.')
  process.exit(1)
}

const client = createClient({
  projectId: env.projectId,
  dataset: env.dataset,
  apiVersion: env.apiVersion,
  token: env.token,
  useCdn: false
})

console.log(`Uploading ${files.length} image file(s) to Sanity ${env.projectId}/${env.dataset}...`)

for (const file of files) {
  const relativePath = path.relative(root, file)
  const title = path.basename(file, path.extname(file))
  const asset = await client.assets.upload('image', createReadStream(file), {
    filename: path.basename(file),
    label: title,
    title,
    source: {
      name: 'Dropbox import',
      id: relativePath,
      url: relativePath
    }
  })

  console.log(`Uploaded ${relativePath} -> ${asset._id}`)
}

console.log('Done.')
