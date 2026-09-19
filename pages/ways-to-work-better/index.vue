<script setup>
const query = `*[_type == "sitePage" && path == "/ways-to-work-better"][0]{
  title,
  introduction,
  seoTitle,
  seoDescription,
  socialImage
}`

const { data: page } = await useFreshSanityData('ways-to-work-better-page', async () => await fetchSanity(query) || {})
const projectsQuery = `*[_type == "project"] | order(order asc, date desc){
  _id, title, date, role, roles,
  "slug": slug.current,
  "service": coalesce(services[0]->title, service->title),
  "services": services[]->title,
  mainImage,
  thumbnail
}`
const { data: projectData } = await useFreshSanityData('ways-to-work-better-projects', async () => await fetchSanity(projectsQuery) || [])
const content = computed(() => Object.keys(page.value || {}).length ? page.value : {
  title: 'Ways to Work Better',
  introduction: ''
})
const services = waysServices
const projects = computed(() => (projectData.value || []).map((project) => ({
  ...project,
  mainImageUrl: sanityImage(project.thumbnail) || sanityImage(project.mainImage)
})))
const serviceProjects = (service) => relatedProjectsForService(service, projects.value, 2)

useSeo({
  title: content.value.seoTitle || content.value.title || 'Ways to Work Better',
  description: content.value.seoDescription || content.value.introduction || 'Ways to work better with Yana Studios.',
  image: sanityImage(content.value.socialImage),
  path: '/ways-to-work-better'
})
</script>

<template>
  <section class="page-pad ways-page">
    <div class="page-heading">
      <h1>{{ String(content.title || 'Ways to Work Better').replace(/\*/g, '') }}</h1>
      <p v-if="content.introduction">{{ content.introduction }}</p>
    </div>
    <div class="service-anchor-list">
      <section v-for="service in services" :id="service.id" :key="service.id" class="service-anchor">
        <NuxtLink :to="`/ways-to-work-better/${service.id}`">
          <h2>{{ service.title }}</h2>
        </NuxtLink>
        <p>{{ service.intro }}</p>
        <div v-if="serviceProjects(service).length" class="service-anchor__projects">
          <NuxtLink
            v-for="project in serviceProjects(service)"
            :key="project._id || project.slug"
            :to="project.slug ? `/work/${project.slug}` : `/ways-to-work-better/${service.id}`"
          >
            {{ project.title }}
          </NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>
