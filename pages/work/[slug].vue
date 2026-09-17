<script setup>
definePageMeta({
  key: (route) => route.fullPath
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const query = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, date, year, client, location, role, roles,
  "service": coalesce(services[0]->title, service->title),
  shortDescription, fullDescription, mainImage,
  galleryImages, videoUrl, seoTitle, seoDescription, socialImage,
  contentBlocks,
  openingLayout
}`

const { data: project, pending } = await useFreshSanityData(
  `project-${slug.value}`,
  () => fetchSanity(query, { slug: slug.value }),
  { watch: [slug], lazy: true, default: () => null }
)
const relatedQuery = `*[_type == "project"] | order(order asc, date desc){
  _id, title, date, year, role, roles, shortDescription,
  "slug": slug.current,
  "service": coalesce(services[0]->title, service->title),
  "services": services[]->title,
  mainImage,
  thumbnail
}`
const { data: relatedData } = await useFreshSanityData(
  'work-service-related-projects',
  async () => await fetchSanity(relatedQuery) || [],
  { lazy: true, default: () => [] }
)
const currentProject = computed(() => project.value)
const currentService = computed(() => serviceForProject(currentProject.value))
const serviceProjects = computed(() => relatedProjectsForService(
  currentService.value,
  (relatedData.value || []).map((item) => ({
    ...item,
    mainImageUrl: item.mainImageUrl || sanityImage(item.thumbnail) || sanityImage(item.mainImage)
  })),
  2,
  slug.value
))
const compactProjectTitle = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '')
const relatedProjectSubtext = (project) => [
  project.shortDescription,
  project.role || project.roles?.[0],
  project.service || project.services?.[0],
  project.year || project.date,
  currentService.value?.title
].filter(Boolean)[0] || ''
const relatedProjectItems = computed(() => {
  const service = currentService.value
  const current = currentProject.value
  if (!service || !current) return []

  const actual = serviceProjects.value.map((project) => ({
    title: project.title,
    _relatedKey: project._id || project.slug || project.title,
    _relatedHref: project.slug ? `/work/${project.slug}` : '',
    _relatedSubtext: relatedProjectSubtext(project)
  }))
  const knownTitles = [
    compactProjectTitle(current.title),
    ...actual.map((item) => compactProjectTitle(item.title))
  ].filter(Boolean)
  const fallback = (service.relatedProjectTitles || [])
    .filter((title) => {
      const compactTitle = compactProjectTitle(title)
      return compactTitle && !knownTitles.some((knownTitle) => knownTitle === compactTitle || knownTitle.includes(compactTitle) || compactTitle.includes(knownTitle))
    })
    .map((title) => ({
      title,
      _relatedKey: `related-${title}`,
      _relatedHref: '',
      _relatedSubtext: service.title
    }))

  return [...actual, ...fallback].slice(0, 2)
})

const mainImageUrl = computed(() => currentProject.value?.mainImageUrl || sanityImage(currentProject.value?.mainImage))
const galleryMedia = computed(() => currentProject.value?.galleryImages?.length ? currentProject.value.galleryImages : currentProject.value?.galleryImageUrls || [])
const projectMediaCaption = computed(() => {
  const project = currentProject.value
  if (!project) return ''
  return [
    project.service || 'Stills',
    project.role || project.roles?.[0] || ''
  ].filter(Boolean).join('. ')
})
const projectContentBlocks = computed(() => {
  if (!currentProject.value) return []
  if (currentProject.value.contentBlocks?.length) return currentProject.value.contentBlocks
  if (galleryMedia.value.length >= 2) {
    return [{
      _key: 'generated-project-media-pair',
      blockType: 'twoColumnMedia',
      layoutStyle: 'laneTwoColumn',
      captionCounter: `1 / 2`,
      caption: projectMediaCaption.value,
      image: galleryMedia.value[0],
      secondaryImage: galleryMedia.value[1]
    }]
  }
  if (galleryMedia.value.length === 1) {
    return [{
      _key: 'generated-project-single-image',
      blockType: 'fullWidthImage',
      layoutStyle: 'laneWideMedia',
      caption: projectMediaCaption.value,
      image: galleryMedia.value[0]
    }]
  }
  return []
})
const projectParagraph = computed(() => {
  const project = currentProject.value
  if (!project) return ''

  return project.fullDescription || project.shortDescription || ''
})
const layoutSeed = computed(() => slug.value.split('').reduce((total, letter) => total + letter.charCodeAt(0), 0))
const openingLayout = computed(() => currentProject.value?.openingLayout || 'auto')
const autoLayoutSections = computed(() => {
  const variations = [
    ['image', 'intro', 'blocks', 'video'],
    ['intro', 'image', 'blocks', 'video'],
    ['image', 'blocks', 'intro', 'video'],
    ['blocks', 'image', 'intro', 'video']
  ]

  return variations[layoutSeed.value % variations.length]
})
const orderedProjectSections = computed(() => {
  const fixed = {
    imageFirst: ['image', 'intro', 'blocks', 'video'],
    textFirst: ['intro', 'image', 'blocks', 'video'],
    blocksFirst: ['blocks', 'image', 'intro', 'video'],
    imageBlocksText: ['image', 'blocks', 'intro', 'video']
  }
  const order = fixed[openingLayout.value] || autoLayoutSections.value

  return order.filter((section) => {
    if (section === 'intro') return projectParagraph.value
    if (section === 'image') return mainImageUrl.value
    if (section === 'blocks') return projectContentBlocks.value.length
    if (section === 'video') return currentProject.value?.videoUrl
    return false
  })
})
useSeo({
  title: currentProject.value?.seoTitle || currentProject.value?.title || 'Project',
  description: currentProject.value?.seoDescription || currentProject.value?.shortDescription || 'Project page for Yana Studios.',
  image: sanityImage(currentProject.value?.socialImage) || mainImageUrl.value,
  path: `/work/${slug.value}`
})
</script>

<template>
  <div class="project-detail-page">
    <article v-if="currentProject" class="project-detail">
      <template v-for="section in orderedProjectSections" :key="section">
        <section v-if="section === 'intro'" class="project-detail-intro">
          <p class="project-detail-copy rich-text">{{ projectParagraph }}</p>
        </section>
        <figure v-else-if="section === 'image'" class="project-full-bleed-image">
          <img :src="mainImageUrl" :alt="currentProject.mainImage?.alt || currentProject.title" />
        </figure>
        <ProjectContentBlocks v-else-if="section === 'blocks'" :blocks="projectContentBlocks" />
        <section v-else-if="section === 'video'" class="project-video-block">
          <iframe class="video-frame" :src="currentProject.videoUrl" :title="currentProject.title" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen />
        </section>
      </template>
      <section v-if="relatedProjectItems.length" class="project-related-text" aria-label="Related projects">
        <p class="project-related-text__intro">Projects related to this service:</p>
        <div class="project-related-text__list">
          <template v-for="item in relatedProjectItems" :key="item._relatedKey">
            <NuxtLink v-if="item._relatedHref" class="project-related-text__item" :to="item._relatedHref">
              <span class="project-related-text__title">{{ item.title }}</span>
              <span v-if="item._relatedSubtext" class="project-related-text__subtext">{{ item._relatedSubtext }}</span>
            </NuxtLink>
            <article v-else class="project-related-text__item">
              <span class="project-related-text__title">{{ item.title }}</span>
              <span v-if="item._relatedSubtext" class="project-related-text__subtext">{{ item._relatedSubtext }}</span>
            </article>
          </template>
        </div>
      </section>
    </article>
    <section v-else-if="pending" class="project-detail project-detail-intro" aria-live="polite">
      <p class="project-detail-copy">Loading project...</p>
    </section>
    <section v-else class="project-detail project-detail-intro">
      <p class="project-detail-copy rich-text">Project not found.</p>
    </section>
  </div>
</template>
