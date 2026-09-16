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
const normalizeProjectText = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '')
const priorityProjects = [
  {
    type: 'PRODUCTION',
    match: ['burberryworldcup26', 'burberryworldcup', 'sharkkinixpuma']
  },
  {
    type: 'CREATIVE DIRECTION',
    match: ['laniegejuicepopad', 'laneigejuicepopad', 'juicepopad', 'juicepop', 'laneigecsaynow', 'laneigexsaynow']
  },
  {
    type: 'MOVEMENT',
    match: ['slowmotionvideoad', 'slowmotion', 'folaxaryastarr', 'joellemovement']
  }
]
const projectPriority = (project) => {
  const haystack = normalizeProjectText(`${project?.title || ''} ${project?.slug || ''}`)
  const index = priorityProjects.findIndex((item) => item.match.some((term) => haystack.includes(term)))
  return index === -1 ? 999 : index
}
const projects = computed(() => {
  const selectedProjects = (home.value.featuredProjects || []).filter(Boolean)
  const allProjects = (data.value?.allProjects || []).filter(Boolean)
  const selectedIds = new Set(selectedProjects.map((project) => project._id))
  const publishedProjects = [
    ...selectedProjects,
    ...allProjects.filter((project) => !selectedIds.has(project._id))
  ]
  const sourceProjects = publishedProjects.length ? publishedProjects : placeholderProjects

  return sourceProjects
    .map((project, originalIndex) => ({
      ...project,
      originalIndex,
      mainImageUrl: project.mainImageUrl || sanityImage(project.thumbnail) || sanityImage(project.mainImage)
    }))
    .filter((project) => project.mainImageUrl)
    .sort((a, b) => {
      const priorityDelta = projectPriority(a) - projectPriority(b)
      return priorityDelta || a.originalIndex - b.originalIndex
    })
    .slice(0, 5)
})
const firstProjectImage = computed(() => projects.value[0]?.mainImageUrl)
const nuxtApp = useNuxtApp()
const introComplete = useState('home-intro-complete', () => import.meta.client && !nuxtApp.isHydrating)
const showIntro = computed(() => !introComplete.value)

const completeIntro = () => {
  introComplete.value = true
}

const homeProjectKey = (project, index) => `${project._id}-${index}`
const homeProjectType = (project, index) => {
  const priority = priorityProjects[projectPriority(project)]
  const type = priority?.type || project.service || project.role || 'Project'
  const count = projects.value.length || 1
  return `${(index % count) + 1}. ${String(type).toUpperCase()}`
}
const homeProjectDescription = (project) => {
  if (project.shortDescription) return project.shortDescription
  const priority = priorityProjects[projectPriority(project)]
  const fallback = {
    PRODUCTION: 'Campaign production and launch support.',
    'CREATIVE DIRECTION': 'Creative direction and visual world building.',
    MOVEMENT: 'Movement direction and performance support.'
  }
  return fallback[priority?.type] || project.service || project.role || ''
}
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
      <IntroAnimation :settings="{ initialDelay: 640, spellDelay: 1280, resolveDelay: 2080, totalDuration: 3300 }" @complete="completeIntro" />
    </section>
    <section v-if="firstProjectImage" class="home-opening-image" aria-label="Opening image">
      <img :src="firstProjectImage" alt="" />
    </section>
    <section class="home-statement home-statement--landing">
      <p>Helping people and brands build emotional worlds and create cultural presence. Bringing ideas to life through production, creative operations and thoughtful execution.</p>
    </section>
    <section class="home-work landing-work" aria-label="Recent work">
      <article v-for="(project, index) in projects" :key="homeProjectKey(project, index)" class="home-work-item">
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
          <NuxtLink v-if="project.slug" class="home-work-caption__type" :to="`/work/${project.slug}`">{{ homeProjectType(project, index) }}</NuxtLink>
          <span class="home-work-caption__text">
            <span class="home-work-caption__title">{{ project.title }}</span><template v-if="homeProjectDescription(project)"> - {{ homeProjectDescription(project) }}</template>
          </span>
        </div>
      </article>
      <div v-if="!projects.length" class="container">
        <div class="empty-state">Featured projects will appear here when selected in Sanity.</div>
      </div>
    </section>
  </div>
</template>
