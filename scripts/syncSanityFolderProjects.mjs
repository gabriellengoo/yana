import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from '@sanity/client'

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.tif', '.tiff'])
const args = process.argv.slice(2)

const readArg = (name) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : ''
}

const hasFlag = (name) => args.includes(name)

const rootArg = readArg('--root') || args.find((arg) => !arg.startsWith('--'))
const dryRun = hasFlag('--dry-run')
const createProjects = hasFlag('--create-projects')
const featuredOnHome = hasFlag('--featured-on-home')
const uploadMissing = hasFlag('--upload-missing')
const limitFolders = (readArg('--only') || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const env = {
  projectId: process.env.SANITY_PROJECT_ID || process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || '3jsw2c0t',
  dataset: process.env.SANITY_DATASET || process.env.NUXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.NUXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_STUDIO_TOKEN
}

const titleOverrides = new Map([
  ['b fixed it exhibtion', 'B-fixed It Exhibition'],
  ['offcie x asics', 'Office x Asics'],
  ['movment study ea', 'Movement Study EA'],
  ['fola x arya star', 'Fola X Arya Starr'],
  ['footlocker x salomon', 'Footlocker X Salomon'],
  ['laneige c say now', 'Laneige C Say Now']
])

const slugOverrides = new Map([
  ['b fixed it exhibtion', 'b-fixed-it-exhibition'],
  ['designer gaze', 'new-wave-designer-gaze'],
  ['fola x arya star', 'fola-x-arya-starr'],
  ['sharkkini summer', 'sharkkini']
])

const usage = [
  'Usage:',
  '  npm run sanity:sync-folder-projects -- --root "/Users/admin/Downloads/gabs finals" --dry-run',
  '',
  'Options:',
  '  --create-projects       Create project docs for folders that do not already exist.',
  '  --upload-missing        Upload local folder images that are not already in Sanity.',
  '  --featured-on-home      Mark created/updated projects as featured on the homepage.',
  '  --only "Folder A,Folder B"  Sync only selected folder names.',
  '  --dry-run               Print changes without writing.'
].join('\n')

if (!rootArg) {
  console.error(usage)
  process.exit(1)
}

if (!dryRun && !env.token) {
  console.error('Missing Sanity write token. Set SANITY_AUTH_TOKEN or SANITY_WRITE_TOKEN before running this script.')
  process.exit(1)
}

const root = path.resolve(rootArg)

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`Folder not found: ${root}`)
  process.exit(1)
}

const normalize = (value) => String(value || '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

const slugify = (value) => normalize(value)
  .replace(/\band\b/g, 'x')
  .replace(/\s+/g, '-')
  .replace(/^-+|-+$/g, '')

const titleCase = (value) => String(value || '')
  .replace(/[-_]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\w\S*/g, (word) => {
    const lower = word.toLowerCase()
    if (['x', 'ea', 'pby'].includes(lower)) return lower.toUpperCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  })

const folderToProject = (folderName) => {
  const key = normalize(folderName)
  const title = titleOverrides.get(key) || titleCase(folderName)
  const slug = slugOverrides.get(key) || slugify(title)
  return { folderName, key, title, slug }
}

const getFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const fullPath = path.join(dir, entry.name)
  if (entry.isDirectory()) return getFiles(fullPath)
  if (!entry.isFile()) return []
  if (!imageExtensions.has(path.extname(entry.name).toLowerCase())) return []
  const size = statSync(fullPath).size
  return [{
    fullPath,
    relativePath: path.relative(root, fullPath),
    basename: path.basename(fullPath),
    size
  }]
})

const folders = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => folderToProject(entry.name))
  .filter((folder) => !limitFolders.length || limitFolders.some((name) => normalize(name) === folder.key))
  .map((folder) => ({
    ...folder,
    files: getFiles(path.join(root, folder.folderName))
  }))
  .filter((folder) => folder.files.length)

if (!folders.length) {
  console.log(`No image folders found in ${root}.`)
  process.exit(0)
}

const client = createClient({
  projectId: env.projectId,
  dataset: env.dataset,
  apiVersion: env.apiVersion,
  token: env.token,
  useCdn: false
})

const [projects, assets] = await Promise.all([
  client.fetch('*[_type == "project"]{_id, title, "slug": slug.current}'),
  client.fetch('*[_type == "sanity.imageAsset"]{_id, originalFilename, title, size, source, metadata { dimensions }}')
])

const projectsBySlug = new Map(projects.filter((project) => project.slug).map((project) => [project.slug, project]))
const assetsByExactFile = new Map()

for (const asset of assets) {
  const filename = asset.originalFilename || asset.title || ''
  if (!filename) continue
  const keys = [
    `${filename}::${asset.size || ''}`,
    `${filename.toLowerCase()}::${asset.size || ''}`
  ]
  for (const key of keys) {
    if (!assetsByExactFile.has(key)) assetsByExactFile.set(key, [])
    assetsByExactFile.get(key).push(asset)
  }

  const sourcePath = asset.source?.id || asset.source?.url || ''
  if (sourcePath) {
    const sourceKey = sourcePath.toLowerCase()
    if (!assetsByExactFile.has(sourceKey)) assetsByExactFile.set(sourceKey, [])
    assetsByExactFile.get(sourceKey).push(asset)
  }
}

const imageItem = (asset) => ({
  _type: 'image',
  _key: asset._id.replace(/^image-/, '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 48),
  asset: {
    _type: 'reference',
    _ref: asset._id
  }
})

const addAssetIndex = (asset) => {
  const filename = asset.originalFilename || asset.title || ''
  if (filename) {
    const keys = [
      `${filename}::${asset.size || ''}`,
      `${filename.toLowerCase()}::${asset.size || ''}`
    ]
    for (const key of keys) {
      if (!assetsByExactFile.has(key)) assetsByExactFile.set(key, [])
      assetsByExactFile.get(key).push(asset)
    }
  }

  const sourcePath = asset.source?.id || asset.source?.url || ''
  if (sourcePath) {
    const sourceKey = sourcePath.toLowerCase()
    if (!assetsByExactFile.has(sourceKey)) assetsByExactFile.set(sourceKey, [])
    assetsByExactFile.get(sourceKey).push(asset)
  }
}

const matchAssets = (folder) => {
  const used = new Set()
  return folder.files.flatMap((file) => {
    const candidates = [
      `${file.basename}::${file.size}`,
      `${file.basename.toLowerCase()}::${file.size}`,
      file.relativePath.toLowerCase()
    ].flatMap((key) => assetsByExactFile.get(key) || [])

    const asset = candidates.find((candidate) => !used.has(candidate._id))
    if (!asset) return []
    used.add(asset._id)
    return [{ file, asset }]
  })
}

const missingFilesFor = (operation) => {
  const matchedPaths = new Set(operation.matches.map((match) => match.file.relativePath))
  return operation.files.filter((file) => !matchedPaths.has(file.relativePath))
}

const operations = folders.map((folder) => ({
  ...folder,
  project: projectsBySlug.get(folder.slug),
  matches: matchAssets(folder)
}))

console.log(`Root: ${root}`)
console.log(`Found ${folders.length} folder(s) with images.`)
console.log('')

for (const operation of operations) {
  const missingCount = operation.files.length - operation.matches.length
  const missingFiles = missingFilesFor(operation)
  const projectLabel = operation.project ? `${operation.project.title} (${operation.slug})` : `new project: ${operation.title} (${operation.slug})`
  console.log(`${operation.folderName} -> ${projectLabel}`)
  console.log(`  ${operation.matches.length}/${operation.files.length} image(s) matched${missingCount ? `, ${missingCount} missing` : ''}.`)
  if (missingFiles.length) {
    const examples = missingFiles.slice(0, 5).map((file) => file.basename).join(', ')
    console.log(`  Missing examples: ${examples}${missingFiles.length > 5 ? ', ...' : ''}`)
    if (!uploadMissing) console.log('  Add --upload-missing to upload these from the local folder before patching.')
  }
  if (!operation.project && !createProjects) console.log('  Skipping write unless --create-projects is passed.')
}

if (dryRun) {
  console.log('')
  console.log('Dry run only. No changes written.')
  process.exit(0)
}

for (const operation of operations) {
  if (uploadMissing) {
    const missingFiles = missingFilesFor(operation)
    for (const file of missingFiles) {
      const title = path.basename(file.basename, path.extname(file.basename))
      const asset = await client.assets.upload('image', createReadStream(file.fullPath), {
        filename: file.basename,
        label: title,
        title,
        source: {
          name: 'Folder project sync',
          id: file.relativePath,
          url: file.relativePath
        }
      })
      addAssetIndex(asset)
      operation.matches.push({ file, asset })
      console.log(`Uploaded ${file.relativePath} -> ${asset._id}`)
    }
  }

  if (!operation.matches.length) continue

  let project = operation.project
  if (!project) {
    if (!createProjects) continue
    project = await client.create({
      _type: 'project',
      title: operation.title,
      slug: { _type: 'slug', current: operation.slug },
      featuredOnHome,
      shortDescription: ''
    })
  }

  const images = operation.matches.map(({ asset }) => imageItem(asset))
  const firstImage = images[0]
  await client
    .patch(project._id)
    .set({
      title: operation.project?.title || operation.title,
      galleryImages: images,
      mainImage: firstImage,
      thumbnail: firstImage,
      ...(featuredOnHome ? { featuredOnHome: true } : {})
    })
    .commit({ autoGenerateArrayKeys: true })

  console.log(`Updated ${operation.title}: ${images.length} image(s).`)
}

console.log('Done.')
