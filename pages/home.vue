<script setup>
const query = `{
  "settings": *[_type == "siteSettings"][0]{
    title, description, heroImage, seoTitle, seoDescription, socialImage
  },
  "home": *[_type == "homePage"][0]{
    title,
    introduction,
    heroImage,
    featuredLabel,
    seoTitle,
    seoDescription,
    socialImage,
    featuredProjects[]->{
      _id, title, date, year, shortDescription, videoUrl,
      "slug": slug.current,
      "service": coalesce(services[0]->title, service->title, role),
      mainImage,
      thumbnail
    }
  },
  "fallbackProjects": *[_type == "project" && featuredOnHome == true] | order(coalesce(homeOrder, order) asc, date desc)[0...3]{
    _id, title, date, year, shortDescription, videoUrl,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role),
    mainImage,
    thumbnail
  }
}`

const { data } = await useAsyncData('home-content', () => fetchSanity(query))
const settings = computed(() => data.value?.settings || {})
const home = computed(() => data.value?.home || {})
const projects = computed(() => (home.value.featuredProjects?.length ? home.value.featuredProjects : data.value?.fallbackProjects || []).map((project) => ({
  ...project,
  mainImageUrl: sanityImage(project.thumbnail) || sanityImage(project.mainImage)
})))
const heroImage = computed(() => sanityImage(home.value.heroImage) || sanityImage(settings.value.heroImage) || projects.value[0]?.mainImageUrl)
const pageTitle = computed(() => home.value.title || settings.value.title || 'Yana Studios')
const introduction = computed(() => home.value.introduction || settings.value.description)

useSeo({
  title: home.value.seoTitle || pageTitle.value,
  description: home.value.seoDescription || settings.value.seoDescription || introduction.value || 'Creative direction, production and cultural archive by Rhyana.',
  image: sanityImage(home.value.socialImage) || sanityImage(settings.value.socialImage) || heroImage.value,
  path: '/home'
})
</script>

<template>
  <section class="hero">
    <div v-if="heroImage" class="hero-media">
      <img :src="heroImage" :alt="home.heroImage?.alt || settings.heroImage?.alt || 'Yana Studios archive image'" />
    </div>
    <div>
      <h1 class="hero-title">{{ pageTitle }}</h1>
      <p v-if="introduction" class="hero-copy">{{ introduction }}</p>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="section-label">{{ home.featuredLabel || 'Featured Work' }}</div>
    </div>
    <ProjectCard v-for="project in projects" :key="project._id" :project="project" />
    <div v-if="!projects.length" class="container">
      <div class="empty-state">Featured projects will appear here when marked in Sanity.</div>
    </div>
  </section>
</template>
