<script setup>
const query = `*[_type == "infoPage"][0]{
  bio, contactEmail, services, clients, collaborators
}`

const { data: info } = await useAsyncData('info-page', () => fetchSanity(query))
const page = computed(() => info.value || {})

useSeo({ title: 'Info', description: 'Bio, contact, services, clients and collaborators for Yana Studios.', path: '/info' })
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>Info</h1>
      <p v-if="page.bio" class="rich-text">{{ page.bio }}</p>
      <p v-else>Yana Studios is a creative studio and archive led by Rhyana.</p>
    </div>
    <div class="info-grid">
      <div>
        <div class="section-label">Contact</div>
        <a v-if="page.contactEmail" :href="`mailto:${page.contactEmail}`">{{ page.contactEmail }}</a>
        <p v-else class="muted">Contact details can be edited in Sanity.</p>
      </div>
      <div>
        <div class="section-label">Services</div>
        <ul class="info-list">
          <li v-for="item in page.services || []" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div>
        <div class="section-label">Clients</div>
        <ul class="info-list">
          <li v-for="item in page.clients || []" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div>
        <div class="section-label">Collaborators</div>
        <ul class="info-list">
          <li v-for="item in page.collaborators || []" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
