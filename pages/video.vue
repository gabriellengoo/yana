<script setup>
const query = `{
  "page": *[_type == "sitePage" && path == "/video"][0]{
    title,
    introduction,
    seoTitle,
    seoDescription,
    socialImage
  },
  "videos": *[_type == "videoEntry"] | order(order asc, date desc){
    _id, title, date, videoUrl, description, thumbnail,
    "slug": slug.current,
    "service": coalesce(service->title, role)
  }
}`

const { data } = await useAsyncData('video-entries', () => fetchSanity(query))
const page = computed(() => data.value?.page || {})
const videos = computed(() => (data.value?.videos || []).map((video) => ({
  ...video,
  thumbnailUrl: sanityImage(video.thumbnail)
})))

useSeo({
  title: page.value.seoTitle || page.value.title || 'Video',
  description: page.value.seoDescription || page.value.introduction || 'Video archive for Yana Studios.',
  image: sanityImage(page.value.socialImage),
  path: '/video'
})
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>{{ page.title || 'Video' }}</h1>
      <p v-if="page.introduction">{{ page.introduction }}</p>
    </div>
    <div v-if="videos.length" class="video-grid">
      <VideoCard v-for="video in videos" :key="video._id" :video="video" />
    </div>
    <div v-else class="empty-state">No video entries have been published yet.</div>
  </section>
</template>
