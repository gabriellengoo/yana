<script setup>
defineProps({
  entries: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div v-if="entries.length" class="gallery-grid">
    <component
      :is="entry.projectSlug ? 'NuxtLink' : 'div'"
      v-for="entry in entries"
      :key="entry._id"
      class="gallery-item"
      :to="entry.projectSlug ? `/work/${entry.projectSlug}` : undefined"
    >
      <img v-if="entry.imageUrl" :src="entry.imageUrl" :alt="entry.title" loading="lazy" />
      <div class="gallery-overlay">
        <strong>{{ entry.title }}</strong>
        <span class="project-row-meta">{{ entry.date || 'Undated' }} / {{ entry.service || 'Studio' }}</span>
      </div>
    </component>
  </div>
  <div v-else class="empty-state">No gallery images have been published yet.</div>
</template>
