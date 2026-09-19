import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)
  const query = typeof body?.query === 'string' ? body.query : ''

  if (!query || !config.public.sanityProjectId) {
    throw createError({ statusCode: 400, statusMessage: 'A Sanity query is required.' })
  }

  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    apiVersion: config.public.sanityApiVersion,
    useCdn: false
  })

  return await client.fetch(query, body.params || {}, { cache: 'no-store' })
})
