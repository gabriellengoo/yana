<script setup>
const query = `{
  "settings": *[_type == "siteSettings"][0]{
    title, description, heroImage
  },
  "projects": *[_type == "project" && featuredOnHome == true] | order(order asc, date desc)[0...3]{
    _id, title, date, shortDescription, videoUrl,
    "slug": slug.current,
    "service": coalesce(service->title, role),
    mainImage
  }
}`

const { data } = await useAsyncData('home-content', () => fetchSanity(query))
const settings = computed(() => data.value?.settings || {})
const projects = computed(() => (data.value?.projects || []).map((project) => ({
  ...project,
  mainImageUrl: sanityImage(project.mainImage)
})))
const heroImage = computed(() => sanityImage(settings.value.heroImage) || projects.value[0]?.mainImageUrl)

useSeo({
  title: settings.value.title || 'Yana Studios',
  description: settings.value.description || 'Creative direction, production and cultural archive by Rhyana.',
  image: heroImage.value,
  path: '/home'
})
</script>

<template>
  <SeoMeta title="Yana Studios" path="/home" />
  <section class="hero">
    <div v-if="heroImage" class="hero-media">
      <img :src="heroImage" alt="Yana Studios archive image" />
    </div>
    <div>
      <h1 class="hero-title">Yana Studios</h1>
      <p class="hero-copy">
        {{ settings.description || 'An editorial archive of creative direction, production, movement and cultural projects.' }}
      </p>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="section-label">Featured Work</div>
    </div>
    <ProjectCard v-for="project in projects" :key="project._id" :project="project" />
    <div v-if="!projects.length" class="container">
      <div class="empty-state">Featured projects will appear here when marked in Sanity.</div>
    </div>
  </section>
</template>
