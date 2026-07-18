<script setup>
const query = `{
  "page": *[_type == "sitePage" && path == "/gallery"][0]{
    title,
    introduction,
    seoTitle,
    seoDescription,
    socialImage
  },
  "entries": *[_type == "galleryEntry"] | order(order asc, date desc){
    _id, title, date, image,
    "service": coalesce(service->title, role),
    "projectSlug": linkedProject->slug.current
  }
}`

const { data } = await useAsyncData('gallery-entries', () => fetchSanity(query))
const page = computed(() => ({
  ...placeholderPages.gallery,
  ...(data.value?.page || {})
}))
const entries = computed(() => {
  const publishedEntries = (data.value?.entries || []).map((entry) => ({
    ...entry,
    imageUrl: sanityImage(entry.image)
  })).filter((entry) => entry.imageUrl)

  return publishedEntries.length ? publishedEntries : placeholderGalleryEntries
})

useSeo({
  title: page.value.seoTitle || page.value.title || 'Gallery',
  description: page.value.seoDescription || page.value.introduction || 'Editorial image archive for Yana Studios.',
  image: sanityImage(page.value.socialImage),
  path: '/gallery'
})
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>{{ page.title || 'Gallery' }}</h1>
      <p v-if="page.introduction">{{ page.introduction }}</p>
    </div>
    <GalleryGrid :entries="entries" />
  </section>
</template>
