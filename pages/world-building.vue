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
  }
}`

const { data } = await useAsyncData('world-building-page', () => fetchSanity(query))
const page = computed(() => ({
  ...placeholderPages.worldBuilding,
  ...(data.value?.page || {})
}))
const posts = computed(() => {
  const publishedPosts = (data.value?.posts || []).map((post) => ({
    ...post,
    imageUrl: sanityImage(post.coverMedia)
  }))

  return publishedPosts.length ? publishedPosts : placeholderWorldPosts
})

useSeo({
  title: page.value.seoTitle || page.value.title || 'World Building',
  description: page.value.seoDescription || page.value.introduction || 'World Building posts from Yana Studios.',
  image: sanityImage(page.value.socialImage),
  path: '/world-building'
})
</script>

<template>
  <section class="page-pad world-building-page">
    <div class="page-heading">
      <h1>{{ page.title || 'World Building' }}</h1>
      <p v-if="page.introduction">{{ page.introduction }}</p>
    </div>
    <div v-if="posts.length" class="initiative-grid">
      <article v-for="post in posts" :key="post._id" class="initiative-card">
        <a
          class="initiative-thumb"
          :href="post.externalNewsletterLink || '#'"
          :target="post.externalNewsletterLink ? '_blank' : undefined"
          :rel="post.externalNewsletterLink ? 'noreferrer' : undefined"
        >
          <img v-if="post.imageUrl" :src="post.imageUrl" :alt="post.coverMedia?.alt || post.title" loading="lazy" />
        </a>
        <div class="project-meta">
          <div class="project-kicker">{{ post.date || 'Undated' }}</div>
          <h2 class="project-title">{{ post.title }}</h2>
          <p v-if="post.excerpt" class="project-description">{{ post.excerpt }}</p>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">World Building posts will appear here when published in Sanity.</div>
  </section>
</template>
