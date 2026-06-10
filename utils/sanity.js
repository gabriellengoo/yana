import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

let client
let builder

export const getSanityClient = () => {
  const config = useRuntimeConfig()
  const projectId = config.public.sanityProjectId

  if (!projectId) return null

  if (!client) {
    client = createClient({
      projectId,
      dataset: config.public.sanityDataset,
      apiVersion: config.public.sanityApiVersion,
      useCdn: true
    })
  }

  return client
}

export const sanityImage = (source) => {
  const sanityClient = getSanityClient()
  if (!source || !sanityClient) return ''
  if (!builder) builder = imageUrlBuilder(sanityClient)
  return builder.image(source).auto('format').fit('max').url()
}

export const fetchSanity = async (query, params = {}) => {
  const sanityClient = getSanityClient()
  if (!sanityClient) return null

  try {
    return await sanityClient.fetch(query, params)
  } catch (error) {
    console.warn('Sanity fetch failed:', error.message)
    return null
  }
}
