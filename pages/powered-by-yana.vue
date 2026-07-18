<script setup>
const query = `{
  "page": *[_type == "poweredByYanaPage"][0]{
    title,
    introduction,
    sections,
    callsToAction,
    seoTitle,
    seoDescription,
    socialImage,
    selectedProjects[]->{
      _id, title, date, shortDescription, mainImage, thumbnail,
      "slug": slug.current,
      "service": coalesce(services[0]->title, service->title, role)
    }
  },
  "entries": *[_type == "poweredByYanaEntry"] | order(order asc, date desc){
    _id, title, date, description, images, externalLink,
    "slug": slug.current
  },
  "fallbackProjects": *[_type == "project" && isPoweredByYana == true] | order(order asc, date desc){
    _id, title, date, shortDescription, mainImage, thumbnail,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  }
}`

const { data } = await useAsyncData('powered-by-yana', () => fetchSanity(query))
const page = computed(() => ({
  ...placeholderPages.poweredByYana,
  ...(data.value?.page || {})
}))
const projects = computed(() => {
  const publishedProjects = (page.value.selectedProjects?.length ? page.value.selectedProjects : data.value?.fallbackProjects || []).map((project) => ({
    ...project,
    mainImageUrl: sanityImage(project.thumbnail) || sanityImage(project.mainImage)
  }))

  return publishedProjects.length ? publishedProjects : placeholderProjects
})
const entries = computed(() => {
  const publishedEntries = (data.value?.entries || []).map((entry) => ({
    ...entry,
    imageUrl: sanityImage(entry.images?.[0])
  })).filter((entry) => entry.imageUrl)

  return publishedEntries.length ? publishedEntries : placeholderInitiatives
})
const poweredItems = computed(() => {
  if (entries.value.length) {
    return entries.value.map((entry) => ({
      _id: entry._id,
      title: entry.title,
      text: entry.description || entry.date || entry.title,
      imageUrl: entry.imageUrl,
      imageAlt: entry.images?.[0]?.alt || entry.title,
      href: entry.externalLink
    }))
  }

  return projects.value.map((project) => ({
    _id: project._id,
    title: project.title,
    text: project.shortDescription || project.service || project.title,
    imageUrl: project.mainImageUrl,
    imageAlt: project.title,
    href: project.slug ? `/work/${project.slug}` : ''
  }))
})

useSeo({
  title: page.value.seoTitle || page.value.title || 'Powered By Yana',
  description: page.value.seoDescription || page.value.introduction || 'Original initiatives, exhibitions, activations and cultural projects.',
  image: sanityImage(page.value.socialImage),
  path: '/powered-by-yana'
})
</script>

<template>
  <section class="page-pad powered-page">
    <div v-if="poweredItems.length" class="powered-list">
      <article v-for="item in poweredItems" :key="item._id" class="powered-item">
        <component
          :is="item.href ? 'a' : 'div'"
          class="powered-item__image"
          :href="item.href || undefined"
          :target="item.href?.startsWith('http') ? '_blank' : undefined"
          :rel="item.href?.startsWith('http') ? 'noreferrer' : undefined"
        >
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.imageAlt" loading="lazy" />
        </component>
        <p class="powered-item__text">{{ item.text }}</p>
      </article>
    </div>
    <div v-else class="empty-state">Powered By Yana entries will appear here when published.</div>
  </section>
</template>
