<script setup>
const route = useRoute()
const service = computed(() => waysServices.find((item) => item.id === route.params.slug))
const projectsQuery = `*[_type == "project"] | order(order asc, date desc){
  _id, title, date, role, roles,
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
    <ServiceShowcase :service="service" :projects="relatedProjects" />
  </article>
</template>
