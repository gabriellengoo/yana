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
const infoParagraphs = computed(() => [
  headline.value,
  baseNote.value,
  availabilityNote.value,
  `Services: ${services.value.join(', ')}.`,
  `Selected clients and collaborators: ${[...clients.value, ...(page.value.collaborators || [])].filter(Boolean).join(', ')}.`,
  ...extraSections.value.map((section) => section.body).filter(Boolean)
].filter(Boolean))

useSeo({ title: page.value.title || 'Info', description: page.value.bio || 'Bio, contact, services, clients and collaborators for Yana Studios.', path: '/info' })
</script>

<template>
  <section class="info-page">
    <div class="info-paragraphs">
      <p v-for="paragraph in infoParagraphs" :key="paragraph" class="rich-text">{{ paragraph }}</p>
      <p>
        <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        <template v-if="page.newsletterLink"> · <a :href="page.newsletterLink" target="_blank" rel="noreferrer">Newsletter</a></template>
        · <a href="https://www.instagram.com/yana_studios" target="_blank" rel="noreferrer">Instagram</a>
      </p>
    </div>

    <h1 class="info-wordmark">Yana Studios</h1>
  </section>
</template>
