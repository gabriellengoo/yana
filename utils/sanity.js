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
      useCdn: false
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
    return await sanityClient.fetch(query, params, {
      cache: 'no-store'
    })
  } catch (error) {
    console.warn('Sanity fetch failed:', error.message)
    return null
  }
}

export const useFreshSanityData = (key, handler, options = {}) => useAsyncData(key, handler, {
  ...options,
  getCachedData: (dataKey, nuxtApp) => nuxtApp.isHydrating
    ? nuxtApp.payload.data[dataKey]
    : null
})
