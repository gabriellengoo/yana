<script setup>
const query = `*[_type == "videoEntry"] | order(order asc, date desc){
  _id, title, date, videoUrl, description, thumbnail,
  "slug": slug.current,
  "service": coalesce(service->title, role)
}`

const { data } = await useAsyncData('video-entries', () => fetchSanity(query))
const videos = computed(() => (data.value || []).map((video) => ({
  ...video,
  thumbnailUrl: sanityImage(video.thumbnail)
})))

useSeo({ title: 'Video', description: 'Video archive for Yana Studios.', path: '/video' })
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>Video</h1>
      <p>Moving image, campaign films and documentation.</p>
    </div>
    <div v-if="videos.length" class="video-grid">
      <VideoCard v-for="video in videos" :key="video._id" :video="video" />
    </div>
    <div v-else class="empty-state">No video entries have been published yet.</div>
  </section>
</template>
