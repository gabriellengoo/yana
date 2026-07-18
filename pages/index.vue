<script setup>
const query = `{
  "settings": *[_type == "siteSettings"][0]{
    title,
    description,
    seoTitle,
    seoDescription,
    socialImage
  },
  "home": *[_type == "homePage"][0]{
    featuredLabel,
    seoTitle,
    seoDescription,
    socialImage,
    featuredProjects[]->{
      _id,
      title,
      date,
      year,
      shortDescription,
      videoUrl,
      "slug": slug.current,
      "service": coalesce(services[0]->title, service->title, role),
      mainImage,
      thumbnail
    }
  },
  "fallbackProjects": *[_type == "project" && featuredOnHome == true] | order(coalesce(homeOrder, order) asc, date desc)[0...3]{
    _id,
    title,
    date,
    year,
    shortDescription,
    videoUrl,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role),
    mainImage,
    thumbnail
  }
}`

const { data } = await useAsyncData('landing-content', () => fetchSanity(query))
const settings = computed(() => data.value?.settings || {})
const home = computed(() => data.value?.home || {})
const projects = computed(() => {
  const publishedProjects = (home.value.featuredProjects?.length ? home.value.featuredProjects : data.value?.fallbackProjects || []).filter(Boolean)
  const sourceProjects = publishedProjects.length ? publishedProjects : placeholderProjects

  return sourceProjects.slice(0, 3).map((project) => ({
    ...project,
    mainImageUrl: project.mainImageUrl || sanityImage(project.thumbnail) || sanityImage(project.mainImage)
  }))
})
const loopedProjects = computed(() => Array.from({ length: 12 }, () => projects.value).flat())
const firstProjectImage = computed(() => projects.value[0]?.mainImageUrl)
const showIntro = ref(true)

const completeIntro = () => {
  showIntro.value = false
}

const homeProjectKey = (project, index) => `${project._id}-${index}`

useSeo({
  title: home.value.seoTitle || settings.value.seoTitle || settings.value.title || 'Yana Studios',
  description: home.value.seoDescription || settings.value.seoDescription || settings.value.description || 'Recent work from Yana Studios.',
  image: sanityImage(home.value.socialImage) || sanityImage(settings.value.socialImage) || firstProjectImage.value,
  path: '/'
})
</script>

<template>
  <section v-if="showIntro" class="intro-page">
    <IntroAnimation :settings="{ initialDelay: 700, totalDuration: 1800 }" @complete="completeIntro" />
  </section>
  <section class="home-work landing-work" aria-label="Recent work">
    <article v-for="(project, index) in loopedProjects" :key="homeProjectKey(project, index)" class="home-work-item">
      <NuxtLink class="home-work-media" :to="project.slug ? `/work/${project.slug}` : '/work'">
        <video v-if="project.videoUrl" :src="project.videoUrl" muted loop playsinline autoplay />
        <img v-else-if="project.mainImageUrl" :src="project.mainImageUrl" :alt="project.thumbnail?.alt || project.mainImage?.alt || project.title" loading="lazy" />
      </NuxtLink>
      <div class="home-work-caption">
        <NuxtLink v-if="project.slug" :to="`/work/${project.slug}`">View</NuxtLink>
        <span class="home-work-caption__text">
          {{ project.title }}<template v-if="project.shortDescription"> - {{ project.shortDescription }}</template>
        </span>
      </div>
    </article>
    <div v-if="!projects.length" class="container">
      <div class="empty-state">Featured projects will appear here when selected in Sanity.</div>
    </div>
  </section>
</template>
