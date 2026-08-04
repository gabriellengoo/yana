import process from 'node:process'
import { createClient } from '@sanity/client'

const args = process.argv.slice(2)
const readArg = (name) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : ''
}
const hasFlag = (name) => args.includes(name)

const projectSlug = readArg('--project')
const tag = readArg('--tag')
const filename = readArg('--filename')
const field = readArg('--field') || 'galleryImages'
const limit = Number(readArg('--limit') || 200)
const dryRun = hasFlag('--dry-run')
const replace = hasFlag('--replace')
const setMain = hasFlag('--set-main')
const setThumbnail = hasFlag('--set-thumbnail')

const env = {
  projectId: process.env.SANITY_PROJECT_ID || process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || '3jsw2c0t',
  dataset: process.env.SANITY_DATASET || process.env.NUXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.NUXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_STUDIO_TOKEN
}

const usage = [
  'Usage:',
  '  npm run sanity:attach-assets -- --project project-slug --tag tag-name',
  '  npm run sanity:attach-assets -- --project project-slug --filename sharkkini',
  '',
  'Options:',
  '  --field galleryImages     Project image array field to patch. Defaults to galleryImages.',
  '  --replace                 Replace the existing field instead of appending.',
  '  --set-main                Set mainImage to the first matching asset.',
  '  --set-thumbnail           Set thumbnail to the first matching asset.',
  '  --limit 200               Maximum matched assets.',
  '  --dry-run                 Print what would change without writing.'
].join('\n')

if (!projectSlug || (!tag && !filename)) {
  console.error(usage)
  process.exit(1)
}

if (!dryRun && !env.token) {
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

const assetFilters = [
  '_type == "sanity.imageAsset"',
  'defined(url)',
  tag ? 'references(*[_type == "media.tag" && name.current == $tag]._id)' : '',
  filename ? '(originalFilename match $filename || title match $filename || source.id match $filename)' : ''
].filter(Boolean).join(' && ')

const query = `{
  "project": *[_type == "project" && slug.current == $projectSlug][0]{_id, title, "slug": slug.current},
  "assets": *[${assetFilters}] | order(coalesce(originalFilename, title, _createdAt) asc)[0...$limit]{
    _id,
    originalFilename,
    title,
    url,
    metadata { dimensions }
  }
}`

let data

try {
  data = await client.fetch(query, {
    projectSlug,
    tag,
    filename: filename ? `*${filename}*` : '',
    limit
  })
} catch (error) {
  console.error(`Sanity query failed: ${error.message}`)
  process.exit(1)
}

if (!data.project) {
  console.error(`Project not found for slug: ${projectSlug}`)
  process.exit(1)
}

if (!data.assets.length) {
  console.log(`No matching image assets found for ${tag ? `tag "${tag}"` : `filename "${filename}"`}.`)
  process.exit(0)
}

const imageItems = data.assets.map((asset) => ({
  _type: 'image',
  _key: asset._id.replace(/^image-/, '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 48),
  asset: {
    _type: 'reference',
    _ref: asset._id
  }
}))

console.log(`Project: ${data.project.title} (${data.project.slug})`)
console.log(`Matched ${data.assets.length} image asset(s):`)
data.assets.forEach((asset) => {
  const size = asset.metadata?.dimensions ? `${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height}` : 'unknown size'
  console.log(`- ${asset.originalFilename || asset.title || asset._id} (${size})`)
})

if (dryRun) {
  console.log('Dry run only. No changes written.')
  process.exit(0)
}

let patch = client.patch(data.project._id)

if (replace) {
  patch = patch.set({ [field]: imageItems })
} else {
  patch = patch.setIfMissing({ [field]: [] }).append(field, imageItems)
}

if (setMain) patch = patch.set({ mainImage: imageItems[0] })
if (setThumbnail) patch = patch.set({ thumbnail: imageItems[0] })

await patch.commit({ autoGenerateArrayKeys: true })

console.log(`Updated ${data.project.title}: ${replace ? 'replaced' : 'appended'} ${data.assets.length} image(s) in ${field}.`)
if (setMain) console.log('Set mainImage from first matched asset.')
if (setThumbnail) console.log('Set thumbnail from first matched asset.')
