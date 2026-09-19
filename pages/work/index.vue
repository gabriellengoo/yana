<script setup>
const query = `{
  "page": *[_type == "sitePage" && path == "/work"][0]{
    title,
    introduction,
    seoTitle,
    seoDescription,
    socialImage
  },
  "projects": *[_type == "project"] | order(order asc, date desc){
    _id, title, date, year,
    mainImage,
    thumbnail,
    "mainImageDimensions": mainImage.asset->metadata.dimensions,
    "thumbnailDimensions": thumbnail.asset->metadata.dimensions,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  }
}`

const { data } = await useFreshSanityData('work-projects', async () => await fetchSanity(query) || { page: null, projects: [] })
const hiddenProjectTerms = ['test', 'bluebackground', 'cyberminimalism', 'mkeway', 'placeholder']
const projectKey = (project = {}) => `${project.title || ''} ${project.slug || ''}`
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')
const isPublishedSiteProject = (project = {}) => {
  const key = projectKey(project)
  return key && !hiddenProjectTerms.some((term) => key.includes(term))
}
const projects = computed(() => {
  const publishedProjects = (data.value?.projects || []).filter(isPublishedSiteProject).map((project) => ({
    ...project,
    mainImageUrl: sanityImage(project.thumbnail) || sanityImage(project.mainImage),
    imageOrientation: imageOrientation(project.thumbnailDimensions || project.mainImageDimensions)
  })).filter((project) => project.mainImageUrl)

  return publishedProjects
})
const imageOrientation = (dimensions = {}) => {
  if (!dimensions?.width || !dimensions?.height) return 'portrait'
  return dimensions.width > dimensions.height ? 'landscape' : 'portrait'
}
const page = computed(() => data.value?.page || {
  title: 'Overview',
  introduction: ''
})

useSeo({
  title: page.value.seoTitle || page.value.title || 'Work',
  description: page.value.seoDescription || page.value.introduction || 'Project archive for Yana Studios and Rhyana.',
  image: sanityImage(page.value.socialImage),
  path: '/work'
})
</script>

<template>
  <section class="work-overview-page" aria-labelledby="work-title">
    <h1 id="work-title" class="sr-only">{{ page.title || 'Work' }}</h1>
    <div class="work-overview-grid">
      <NuxtLink
        v-for="project in projects"
        :key="project._id || project.slug || project.title"
        class="work-overview-item"
        :class="`work-overview-item--${project.imageOrientation || 'portrait'}`"
        :to="project.slug ? `/work/${project.slug}` : '/work'"
      >
        <img :src="project.mainImageUrl" :alt="project.thumbnail?.alt || project.mainImage?.alt || project.title" loading="lazy" />
        <span>{{ project.title }}</span>
      </NuxtLink>
    </div>
    <p v-if="!projects.length" class="empty-state">Projects will appear here when published.</p>
  </section>
</template>
