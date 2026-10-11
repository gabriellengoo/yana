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
      _id, title, date, shortDescription, role, roles, mainImage, thumbnail, galleryImages,
      "slug": slug.current,
      "service": coalesce(services[0]->title, service->title, role)
    }
  },
  "entries": *[_type == "poweredByYanaEntry"] | order(order asc, date desc){
    _id, title, date, description, images, externalLink,
    "slug": slug.current
  },
  "fallbackProjects": *[_type == "project" && isPoweredByYana == true] | order(order asc, date desc){
    _id, title, date, shortDescription, role, roles, mainImage, thumbnail, galleryImages,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  },
  "eventProjects": *[_type == "project"] | order(order asc, date desc){
    _id, title, date, shortDescription, role, roles, mainImage, thumbnail, galleryImages,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  }
}`

const { data } = await useFreshSanityData('powered-by-yana', () => fetchSanity(query))
const page = computed(() => ({
  ...(data.value?.page || {})
}))
const poweredIntro = computed(() => page.value.introduction || 'PBY is our culturally observant in-house creative lab. A home for original ideas, experiences and cultural projects developed and produced by the studio. These are the concepts we create simply because we believe they deserve to exist.')
const expectedPoweredProjects = [
  'Find Your Tribe: One Year Strong',
  'BFIXEDIT: The Exhibition',
  'Off The Record',
  'Fish Tank Shoot',
  'Cyber Minimalism'
]
const eventKeywords = [
  'event',
  'events',
  'pop up',
  'pop-up',
  'launch',
  'party',
  'live',
  'activation',
  'exhibition',
  'experience',
  'experiential',
  'mailer',
  'gifting',
  'community',
  'installation',
  'set design',
  'powered by yana'
]
const isEventLikeProject = (project = {}) => {
  const searchable = [
    project.title,
    project.shortDescription,
    project.role,
    ...(project.roles || []),
    project.service
  ].filter(Boolean).join(' ').toLowerCase()

  return eventKeywords.some((keyword) => searchable.includes(keyword))
}
const hiddenProjectTerms = ['test', 'bluebackground', 'mkeway', 'placeholder']
const projectKey = (project = {}) => `${project.title || ''} ${project.slug || ''}`
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')
const isPublishedSiteProject = (project = {}) => {
  const key = projectKey(project)
  return key && !hiddenProjectTerms.some((term) => key.includes(term))
}
const imageUrl = (image) => typeof image === 'string' ? image : sanityImage(image)
const projectImages = (project = {}) => [
  project.thumbnail,
  project.mainImage,
  ...(project.galleryImages || [])
].map(imageUrl).filter(Boolean)
const projects = computed(() => {
  const selected = page.value.selectedProjects?.length ? page.value.selectedProjects : []
  const powered = data.value?.fallbackProjects || []
  const allSiteProjects = (data.value?.eventProjects || []).filter(isPublishedSiteProject)
  const eventProjects = allSiteProjects.filter(isEventLikeProject)
  const fillerProjects = allSiteProjects.filter((project) => !isEventLikeProject(project))
  const merged = [...selected, ...powered, ...eventProjects, ...fillerProjects]
  const seen = new Set()
  const uniqueProjects = merged.filter((project) => {
    const key = project._id || project.slug || project.title
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })

  const publishedProjects = uniqueProjects.map((project) => ({
    ...project,
    imageUrls: projectImages(project),
    mainImageUrl: projectImages(project)[0]
  }))

  return publishedProjects.filter((project) => project.mainImageUrl).slice(0, 5)
})
const entries = computed(() => {
  const publishedEntries = (data.value?.entries || []).map((entry) => ({
    ...entry,
    imageUrls: (entry.images || []).map(imageUrl).filter(Boolean),
    imageUrl: sanityImage(entry.images?.[0])
  })).filter((entry) => entry.imageUrl)

  return publishedEntries
})
const poweredItems = computed(() => {
  if (entries.value.length) {
    return entries.value.map((entry) => ({
      _id: entry._id,
      title: entry.title,
      subtitle: entry.date || 'Original experience',
      text: entry.description || 'A Powered By Yana cultural project shaped through concept, planning and live production.',
      imageUrl: entry.imageUrl,
      imageUrls: entry.imageUrls,
      imageAlt: entry.images?.[0]?.alt || entry.title,
      href: entry.externalLink
    }))
  }

  return projects.value.map((project) => ({
    _id: project._id,
    title: project.title,
    subtitle: project.service || project.role || project.date || '',
    text: project.shortDescription || '',
    imageUrl: project.mainImageUrl,
    imageUrls: project.imageUrls,
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
  <section class="powered-page">
    <header class="powered-hero">
      <h1 class="sr-only">Powered By Yana</h1>
      <p class="powered-intro rich-text">{{ poweredIntro }}</p>
    </header>

    <div v-if="poweredItems.length" class="powered-services">
      <article v-for="(item, index) in poweredItems" :key="item._id || item.title" class="powered-service" :class="{ 'powered-service--reverse': index % 2 === 1 }">
        <div class="powered-service__copy">
          <h2>{{ item.title }}</h2>
          <p v-if="item.subtitle" class="powered-service__subtitle">{{ item.subtitle }}</p>
          <p v-if="item.text" class="powered-service__body">{{ item.text }}</p>
          <NuxtLink
            v-if="item.href && !item.href.startsWith('http')"
            class="powered-service__link"
            :to="item.href"
          >
            View project
          </NuxtLink>
          <a
            v-else-if="item.href"
            class="powered-service__link"
            :href="item.href"
            target="_blank"
            rel="noreferrer"
          >
            View project
          </a>
        </div>

        <div class="powered-service__media">
          <NuxtLink v-if="item.href && !item.href.startsWith('http')" class="powered-service__image" :to="item.href">
            <img :src="item.imageUrl" :alt="item.imageAlt" loading="lazy" />
          </NuxtLink>
          <a v-else-if="item.href" class="powered-service__image" :href="item.href" target="_blank" rel="noreferrer">
            <img :src="item.imageUrl" :alt="item.imageAlt" loading="lazy" />
          </a>
          <div v-else class="powered-service__image">
            <img :src="item.imageUrl" :alt="item.imageAlt" loading="lazy" />
          </div>
          <div v-if="item.imageUrls?.length > 1" class="powered-service__thumbs" aria-hidden="true">
            <img v-for="(src, imageIndex) in item.imageUrls.slice(0, 6)" :key="`${item._id || item.title}-${imageIndex}`" :src="src" alt="" loading="lazy" />
          </div>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">Powered By Yana entries will appear here when published.</div>
    <section class="content-note" aria-label="Expected Powered By Yana projects">
      <p>Expected projects for this section:</p>
      <ul>
        <li v-for="project in expectedPoweredProjects" :key="project">{{ project }}</li>
      </ul>
    </section>
  </section>
</template>
