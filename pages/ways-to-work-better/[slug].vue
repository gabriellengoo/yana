<script setup>
const route = useRoute()
const service = computed(() => waysServices.find((item) => item.id === route.params.slug))
const projectsQuery = `*[_type == "project"] | order(order asc, date desc){
  _id, title, date, year, role, roles, shortDescription,
  "slug": slug.current,
  "service": coalesce(services[0]->title, service->title),
  "services": services[]->title,
  mainImage,
  thumbnail
}`
const { data: projectData } = await useFreshSanityData(
  `service-projects-${route.params.slug}`,
  async () => await fetchSanity(projectsQuery) || []
)
const projects = computed(() => (projectData.value || []).map((project) => ({
  ...project,
  mainImageUrl: sanityImage(project.thumbnail) || sanityImage(project.mainImage)
})))
const relatedProjects = computed(() => relatedProjectsForService(service.value, projects.value, 2))
const serviceIndex = computed(() => {
  const index = waysServices.findIndex((item) => item.id === service.value?.id)
  return String(Math.max(index + 1, 1)).padStart(3, '0')
})
const displayServiceTitle = computed(() => service.value?.menuLabel || service.value?.title || '')
const serviceImage = computed(() => {
  const imageProjects = projects.value.filter((project) => project.mainImageUrl)
  if (!imageProjects.length) return null

  const seed = String(route.params.slug || '').split('').reduce((total, letter) => total + letter.charCodeAt(0), 0)
  const project = imageProjects[seed % imageProjects.length]
  return {
    title: project.title,
    src: project.mainImageUrl
  }
})
const compactProjectTitle = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '')
const projectSubtext = (project) => [
  project.shortDescription,
  project.role || project.roles?.[0],
  project.service || project.services?.[0],
  project.year || project.date,
  service.value?.title
].filter(Boolean)[0] || ''
const relatedProjectItems = computed(() => {
  if (!service.value) return []

  const linked = relatedProjects.value.map((project) => ({
    title: project.title,
    href: project.slug ? `/work/${project.slug}` : '',
    subtext: projectSubtext(project),
    key: project._id || project.slug || project.title
  }))
  const knownTitles = linked.map((project) => compactProjectTitle(project.title)).filter(Boolean)
  const fallback = (service.value.relatedProjectTitles || [])
    .filter((title) => {
      const compact = compactProjectTitle(title)
      return compact && !knownTitles.some((known) => known === compact || known.includes(compact) || compact.includes(known))
    })
    .map((title) => ({
      title,
      href: '',
      subtext: service.value.title,
      key: `related-${title}`
    }))

  return [...linked, ...fallback].slice(0, 2)
})

if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found' })
}

useSeo({
  title: service.value.title,
  description: serviceBody(service.value),
  path: route.path
})
</script>

<template>
  <article class="service-page">
    <section class="ways-detail">
      <div class="ways-detail__media">
        <figure v-if="serviceImage" class="ways-detail__image">
          <img :src="serviceImage.src" :alt="serviceImage.title" loading="lazy" />
        </figure>
        <div class="ways-detail__description">
          <p>{{ service.intro }}</p>
          <p>{{ service.deliverables }}</p>
        </div>
      </div>

      <div class="ways-detail__content">
        <header class="ways-detail__meta">
          <p>{{ serviceIndex }}</p>
          <h1>{{ displayServiceTitle }}</h1>
          <p>Yana Studios</p>
        </header>

        <div class="ways-detail__credits">
          <ul class="ways-detail__capabilities">
            <li v-for="capability in service.capabilities" :key="capability">{{ capability }}</li>
          </ul>
          <div v-if="relatedProjectItems.length" class="ways-detail__related">
            <h2>Related Projects</h2>
            <div class="ways-detail__related-list">
              <template v-for="project in relatedProjectItems" :key="project.key">
                <NuxtLink v-if="project.href" class="ways-detail__related-link" :to="project.href">
                  <span>{{ project.title }}</span>
                  <span>{{ project.subtext }}</span>
                </NuxtLink>
                <article v-else class="ways-detail__related-link">
                  <span>{{ project.title }}</span>
                  <span>{{ project.subtext }}</span>
                </article>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
