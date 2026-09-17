<script setup>
const query = `{
  "page": *[_type == "sitePage" && path == "/world-building"][0]{
    title,
    introduction,
    seoTitle,
    seoDescription,
    socialImage
  },
  "posts": *[_type == "worldBuildingPost"] | order(date desc){
    _id,
    title,
    date,
    excerpt,
    coverMedia,
    externalNewsletterLink,
    "slug": slug.current
  },
  "projects": *[_type == "project"] | order(order asc, date desc){
    _id,
    title,
    date,
    year,
    shortDescription,
    role,
    roles,
    mainImage,
    thumbnail,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  }
}`

const { data } = await useFreshSanityData('world-building-page', () => fetchSanity(query))
const page = computed(() => ({
  ...(data.value?.page || {})
}))
const posts = computed(() => {
  const publishedPosts = (data.value?.posts || []).map((post) => ({
    ...post,
    imageUrl: sanityImage(post.coverMedia)
  }))

  return publishedPosts
})
const worldIntro = computed(() => page.value.introduction || 'World Building is the studio archive for references, essays and cultural notes. It gathers the thinking behind Yana Studios: the moods, systems and observations that shape the work.')
const projectImage = (project = {}) => sanityImage(project.thumbnail) || sanityImage(project.mainImage)
const hiddenProjectTerms = ['test', 'bluebackground', 'cyberminimalism', 'mkeway', 'placeholder']
const isPublishedSiteProject = (project = {}) => {
  const key = `${project.title || ''} ${project.slug || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '')
  return key && !hiddenProjectTerms.some((term) => key.includes(term))
}
const relatedProjects = computed(() => (data.value?.projects || [])
  .map((project) => ({
    ...project,
    imageUrl: projectImage(project)
  }))
  .filter((project) => project.imageUrl && isPublishedSiteProject(project))
  .slice(0, 3))
const worldItems = computed(() => posts.value
  .map((post) => ({
    _id: post._id,
    title: post.title,
    subtitle: post.date || 'World note',
    text: post.excerpt || 'A world-building note from the studio archive.',
    imageUrl: post.imageUrl,
    imageAlt: post.coverMedia?.alt || post.title,
    href: post.externalNewsletterLink || ''
  }))
  .filter((item) => item.imageUrl))
const relatedProjectItems = computed(() => relatedProjects.value.map((project) => ({
  _id: project._id,
  title: project.title,
  subtitle: project.service || project.role || project.year || project.date || 'Related project',
  text: project.shortDescription || `${project.title} sits within ${project.service || project.role || 'the studio archive'}, connecting the visual direction, production thinking and cultural context behind the work.`,
  imageUrl: project.imageUrl,
  imageAlt: project.thumbnail?.alt || project.mainImage?.alt || project.title,
  href: project.slug ? `/work/${project.slug}` : ''
})))
const displayItems = computed(() => worldItems.value.length ? worldItems.value : relatedProjectItems.value)

useSeo({
  title: page.value.seoTitle || page.value.title || 'World Building',
  description: page.value.seoDescription || page.value.introduction || 'World Building posts from Yana Studios.',
  image: sanityImage(page.value.socialImage),
  path: '/world-building'
})
</script>

<template>
  <section class="powered-page world-building-page">
    <header class="powered-hero">
      <h1 class="sr-only">{{ page.title || 'World Building' }}</h1>
      <p class="powered-intro rich-text">{{ worldIntro }}</p>
    </header>

    <div v-if="displayItems.length" class="powered-services">
      <article v-for="(item, index) in displayItems" :key="item._id || item.title" class="powered-service" :class="{ 'powered-service--reverse': index % 2 === 1 }">
        <div class="powered-service__copy">
          <h2>{{ item.title }}</h2>
          <p v-if="item.subtitle" class="powered-service__subtitle">{{ item.subtitle }}</p>
          <p class="powered-service__body">{{ item.text }}</p>
          <NuxtLink
            v-if="item.href && !item.href.startsWith('http')"
            class="powered-service__link"
            :to="item.href"
          >
            Related project
          </NuxtLink>
          <a
            v-else-if="item.href"
            class="powered-service__link"
            :href="item.href"
            target="_blank"
            rel="noreferrer"
          >
            Read more
          </a>
        </div>

        <div class="powered-service__media">
          <NuxtLink
            v-if="item.href && !item.href.startsWith('http')"
            class="powered-service__image"
            :to="item.href"
          >
            <img :src="item.imageUrl" :alt="item.imageAlt" loading="lazy" />
          </NuxtLink>
          <a v-else-if="item.href" class="powered-service__image" :href="item.href" target="_blank" rel="noreferrer">
            <img :src="item.imageUrl" :alt="item.imageAlt" loading="lazy" />
          </a>
          <div v-else class="powered-service__image">
            <img :src="item.imageUrl" :alt="item.imageAlt" loading="lazy" />
          </div>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">World Building posts will appear here when published in Sanity.</div>
  </section>
</template>
