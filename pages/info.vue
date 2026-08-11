<script setup>
const query = `*[_type == "infoPage"][0]{
  title, bio, contactEmail, contactDetails, services, clients, collaborators,
  newsletterLink, inviteInformation, sections
}`

const { data: info } = await useFreshSanityData('info-page', () => fetchSanity(query))
const page = computed(() => ({
  ...placeholderPages.info,
  ...(info.value || {})
}))
const defaultClients = [
  'Fola',
  'Arya Starr',
  'Laneige',
  'ASICS',
  'Office',
  'Burberry',
  'Designer Gaze',
  'Sharkkini',
  'Puma',
  'Matte Brand',
  'Holmes',
  'B-fixed'
]
const defaultServices = [
  'Production',
  'Casting',
  'Creative Direction',
  'Creative Operations',
  'Campaign Production',
  'Movement Direction',
  'Intimacy Coordination'
]
const clients = computed(() => page.value.clients?.length ? page.value.clients : defaultClients)
const services = computed(() => page.value.services?.length ? page.value.services : defaultServices)
const headline = computed(() => page.value.bio || 'Production, casting, creative direction, movement direction, intimacy coordination and creative operations.')
const baseNote = computed(() => page.value.contactDetails || 'Based in London, operating worldwide.')
const availabilityNote = computed(() => page.value.inviteInformation || 'Available for campaigns, shoots, launches, artist projects and live creative production.')
const contactEmail = computed(() => page.value.contactEmail || 'hello@yanastudios.example')
const extraSections = computed(() => page.value.sections || [])

useSeo({ title: page.value.title || 'Info', description: page.value.bio || 'Bio, contact, services, clients and collaborators for Yana Studios.', path: '/info' })
</script>

<template>
  <section class="info-page">
    <div class="info-topline">
      <p>
        Yana Studios<br />
        London based<br />
        Copyright 2026. All rights reserved.
      </p>
      <div class="info-mark" aria-label="Yana Studios">YS</div>
      <div class="info-lede">
        <p>{{ headline }}</p>
        <p>{{ baseNote }}</p>
        <p>{{ availabilityNote }}</p>
      </div>
    </div>

    <div class="info-directory">
      <div class="info-column info-column--clients">
        <h2>Selected Clients</h2>
        <ul>
          <li v-for="client in clients" :key="client">{{ client }}</li>
        </ul>
      </div>

      <div class="info-column info-column--contact">
        <h2>Contact Us</h2>
        <a :href="`mailto:${contactEmail}`">→ E-mail</a>
        <a v-if="page.newsletterLink" :href="page.newsletterLink" target="_blank" rel="noreferrer">→ Newsletter</a>
      </div>

      <div class="info-column info-column--social">
        <h2>&nbsp;</h2>
        <a href="https://www.instagram.com/yana_studios" target="_blank" rel="noreferrer">→ Follow us</a>
      </div>

      <div class="info-column info-column--services">
        <h2>Services</h2>
        <ul>
          <li v-for="service in services" :key="service">{{ service }}</li>
        </ul>
      </div>
    </div>

    <div v-if="extraSections.length" class="info-notes">
      <article v-for="section in extraSections" :key="section._key">
        <h2 v-if="section.heading">{{ section.heading }}</h2>
        <p v-if="section.body" class="rich-text">{{ section.body }}</p>
      </article>
    </div>

    <h1 class="info-wordmark">Yana Studios</h1>
  </section>
</template>
