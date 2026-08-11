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
  "allProjects": *[_type == "project"] | order(coalesce(homeOrder, order) asc, date desc){
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

const { data } = await useFreshSanityData('landing-content', () => fetchSanity(query))
const settings = computed(() => data.value?.settings || {})
const home = computed(() => data.value?.home || {})
const projects = computed(() => {
  const selectedProjects = (home.value.featuredProjects || []).filter(Boolean)
  const allProjects = (data.value?.allProjects || []).filter(Boolean)
  const selectedIds = new Set(selectedProjects.map((project) => project._id))
  const publishedProjects = [
    ...selectedProjects,
    ...allProjects.filter((project) => !selectedIds.has(project._id))
  ]
  const sourceProjects = publishedProjects.length ? publishedProjects : placeholderProjects

  return sourceProjects.map((project) => ({
    ...project,
    mainImageUrl: project.mainImageUrl || sanityImage(project.thumbnail) || sanityImage(project.mainImage)
  })).filter((project) => project.mainImageUrl)
})
const loopedProjects = computed(() => Array.from({ length: 12 }, () => projects.value).flat())
const firstProjectImage = computed(() => projects.value[0]?.mainImageUrl)
const nuxtApp = useNuxtApp()
const introComplete = useState('home-intro-complete', () => import.meta.client && !nuxtApp.isHydrating)
const showIntro = computed(() => !introComplete.value)
const showHomeStatement = ref(true)
let homeStatementTimer
let homeAutoScrollTimer
let homeAutoScrollIndex = 0

const stopHomeAutoScroll = () => {
  if (homeAutoScrollTimer) window.clearInterval(homeAutoScrollTimer)
  homeAutoScrollTimer = null
}

const scrollToNextHomeProject = () => {
  if (!import.meta.client) return
  const items = Array.from(document.querySelectorAll('.home-work-item'))
  if (!items.length) return

  homeAutoScrollIndex = (homeAutoScrollIndex + 1) % items.length
  items[homeAutoScrollIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const startHomeAutoScroll = () => {
  if (!import.meta.client || homeAutoScrollTimer) return
  window.setTimeout(() => {
    const items = Array.from(document.querySelectorAll('.home-work-item'))
    if (items.length && window.scrollY < items[0].offsetTop - 10) {
      homeAutoScrollIndex = 0
      items[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 450)
  homeAutoScrollTimer = window.setInterval(scrollToNextHomeProject, 4200)
}

const scheduleHomeStatementHide = () => {
  if (!import.meta.client || homeStatementTimer) return
  homeStatementTimer = window.setTimeout(() => {
    showHomeStatement.value = false
    startHomeAutoScroll()
  }, 3600)
}

const completeIntro = () => {
  introComplete.value = true
  scheduleHomeStatementHide()
}

const homeProjectKey = (project, index) => `${project._id}-${index}`
const isDirectVideoUrl = (url = '') => /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url) || /cdn\.sanity\.io\/files\//i.test(url)
const youtubeId = (url = '') => {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/#]+)/i)
  return match?.[1] || ''
}
const homeEmbedUrl = (url = '') => {
  if (!url || isDirectVideoUrl(url)) return ''
  const yt = youtubeId(url)
  if (yt) return `https://www.youtube.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&playsinline=1&modestbranding=1`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)?.[1]
  if (vimeo) return `https://player.vimeo.com/video/${vimeo}?autoplay=1&muted=1&loop=1&background=1`
  return url
}

onMounted(() => {
  if (!showIntro.value) scheduleHomeStatementHide()
})

onBeforeUnmount(() => {
  if (homeStatementTimer) window.clearTimeout(homeStatementTimer)
  stopHomeAutoScroll()
})

useSeo({
  title: home.value.seoTitle || settings.value.seoTitle || settings.value.title || 'Yana Studios',
  description: home.value.seoDescription || settings.value.seoDescription || settings.value.description || 'Recent work from Yana Studios.',
  image: sanityImage(home.value.socialImage) || sanityImage(settings.value.socialImage) || firstProjectImage.value,
  path: '/'
})
</script>

<template>
  <div class="home-page">
    <section v-if="showIntro" class="intro-page">
      <IntroAnimation :settings="{ initialDelay: 700, totalDuration: 1800 }" @complete="completeIntro" />
    </section>
    <section class="home-statement home-statement--landing" :class="{ 'is-hidden': !showHomeStatement }">
      <p>Helping people and brands build emotional worlds and create cultural presence. Bringing ideas to life through production, creative operations and thoughtful execution.</p>
    </section>
    <section class="home-work landing-work" aria-label="Recent work">
      <article v-for="(project, index) in loopedProjects" :key="homeProjectKey(project, index)" class="home-work-item">
        <NuxtLink class="home-work-media" :to="project.slug ? `/work/${project.slug}` : '/work'">
          <video v-if="project.videoUrl && isDirectVideoUrl(project.videoUrl)" :src="project.videoUrl" muted loop playsinline autoplay />
          <iframe
            v-else-if="project.videoUrl && homeEmbedUrl(project.videoUrl)"
            class="home-work-embed"
            :src="homeEmbedUrl(project.videoUrl)"
            :title="project.title"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          />
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
  </div>
</template>
