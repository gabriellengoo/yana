export const useSeo = (meta = {}) => {
  const config = useRuntimeConfig()
  const title = meta.title ? `${meta.title} | Yana Studios` : 'Yana Studios | Rhyana'
  const description = meta.description || 'A minimal archive for creative direction, production, movement direction and cultural projects by Rhyana.'
  const image = meta.image || ''

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogImage: image,
    twitterCard: image ? 'summary_large_image' : 'summary'
  })

  useHead({
    link: [{ rel: 'canonical', href: `${config.public.siteUrl}${meta.path || useRoute().path}` }]
  })
}
