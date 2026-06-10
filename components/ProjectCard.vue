<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="featured-project">
    <div class="project-meta">
      <div class="project-kicker">{{ project.date || 'Undated' }} / {{ project.service || 'Studio' }}</div>
      <h2 class="project-title">{{ project.title }}</h2>
      <p v-if="project.shortDescription" class="project-description">{{ project.shortDescription }}</p>
      <NuxtLink v-if="project.slug" class="project-kicker" :to="`/work/${project.slug}`">View Project</NuxtLink>
    </div>
    <NuxtLink class="project-media" :to="project.slug ? `/work/${project.slug}` : '/work'">
      <video v-if="project.videoUrl" :src="project.videoUrl" muted loop playsinline autoplay />
      <img v-else-if="project.mainImageUrl" :src="project.mainImageUrl" :alt="project.title" loading="lazy" />
    </NuxtLink>
  </article>
</template>
