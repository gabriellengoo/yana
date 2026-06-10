<script setup>
defineProps({
  video: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="video-card">
    <div class="video-thumb">
      <iframe
        v-if="video.videoUrl && !video.thumbnailUrl"
        class="video-frame"
        :src="video.videoUrl"
        :title="video.title"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      />
      <a v-else-if="video.videoUrl" :href="video.videoUrl" target="_blank" rel="noreferrer">
        <img v-if="video.thumbnailUrl" :src="video.thumbnailUrl" :alt="video.title" loading="lazy" />
      </a>
      <img v-else-if="video.thumbnailUrl" :src="video.thumbnailUrl" :alt="video.title" loading="lazy" />
    </div>
    <div class="project-meta">
      <div class="project-kicker">{{ video.date || 'Undated' }} / {{ video.service || 'Studio' }}</div>
      <h2 class="project-title">{{ video.title }}</h2>
      <p v-if="video.description" class="project-description">{{ video.description }}</p>
    </div>
  </article>
</template>
