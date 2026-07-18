<script setup>
const query = `*[_type == "infoPage"][0]{
  title, bio, contactEmail, contactDetails, services, clients, collaborators,
  newsletterLink, inviteInformation, sections
}`

const { data: info } = await useAsyncData('info-page', () => fetchSanity(query))
const page = computed(() => ({
  ...placeholderPages.info,
  ...(info.value || {})
}))

useSeo({ title: page.value.title || 'Info', description: page.value.bio || 'Bio, contact, services, clients and collaborators for Yana Studios.', path: '/info' })
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>{{ page.title || 'Info' }}</h1>
      <p v-if="page.bio" class="rich-text">{{ page.bio }}</p>
    </div>
    <div class="info-grid">
      <div>
        <div class="section-label">Contact</div>
        <a v-if="page.contactEmail" :href="`mailto:${page.contactEmail}`">{{ page.contactEmail }}</a>
        <p v-if="page.contactDetails" class="rich-text">{{ page.contactDetails }}</p>
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
      <div v-if="page.newsletterLink">
        <div class="section-label">Newsletter</div>
        <a :href="page.newsletterLink" target="_blank" rel="noreferrer">Newsletter</a>
      </div>
      <div v-if="page.inviteInformation">
        <div class="section-label">Invite</div>
        <p class="rich-text">{{ page.inviteInformation }}</p>
      </div>
      <div v-for="section in page.sections || []" :key="section._key">
        <div v-if="section.heading" class="section-label">{{ section.heading }}</div>
        <p v-if="section.body" class="rich-text">{{ section.body }}</p>
      </div>
    </div>
  </section>
</template>
