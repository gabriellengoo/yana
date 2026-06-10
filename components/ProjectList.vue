<script setup>
defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div v-if="projects.length" class="project-list">
    <NuxtLink v-for="project in projects" :key="project._id" class="project-row" :to="`/work/${project.slug}`">
      <span class="project-row-title">{{ project.title }}</span>
      <span class="project-row-meta">{{ project.date || 'Undated' }}</span>
      <span class="project-row-meta">{{ project.service || 'Studio' }}</span>
    </NuxtLink>
  </div>
  <div v-else class="empty-state">No projects have been published yet.</div>
</template>
