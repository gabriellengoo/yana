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
      <div class="ways-detail__heading">
        <p>Ways To Work Better*</p>
        <h1>{{ service.title }}</h1>
        <p>{{ service.intro }}</p>
      </div>

      <div class="ways-detail__body">
        <ul class="ways-detail__capabilities">
          <li v-for="capability in service.capabilities" :key="capability">{{ capability }}</li>
        </ul>

        <div class="ways-detail__side">
          <p>{{ service.deliverables }}</p>
          <div v-if="relatedProjectItems.length" class="ways-detail__related">
            <p>*projects related to this service:</p>
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
