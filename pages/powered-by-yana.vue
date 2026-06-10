<script setup>
const query = `*[_type == "poweredByYanaEntry"] | order(order asc, date desc){
  _id, title, date, description, images, externalLink,
  "slug": slug.current
}`

const { data } = await useAsyncData('powered-by-yana', () => fetchSanity(query))
const entries = computed(() => (data.value || []).map((entry) => ({
  ...entry,
  imageUrl: sanityImage(entry.images?.[0])
})))

useSeo({ title: 'Powered By Yana', description: 'Original initiatives, exhibitions, activations and cultural projects.', path: '/powered-by-yana' })
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>Powered By Yana</h1>
      <p>Original initiatives, exhibitions, activations and cultural projects.</p>
    </div>
    <div v-if="entries.length" class="initiative-grid">
      <article v-for="entry in entries" :key="entry._id" class="initiative-card">
        <div class="initiative-thumb">
          <img v-if="entry.imageUrl" :src="entry.imageUrl" :alt="entry.title" loading="lazy" />
        </div>
        <div class="project-meta">
          <div class="project-kicker">{{ entry.date || 'Undated' }}</div>
          <h2 class="project-title">{{ entry.title }}</h2>
          <p v-if="entry.description" class="project-description">{{ entry.description }}</p>
          <a v-if="entry.externalLink" class="project-kicker" :href="entry.externalLink" target="_blank" rel="noreferrer">External Link</a>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">Powered By Yana entries will appear here when published.</div>
  </section>
</template>
