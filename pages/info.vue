<script setup>
const query = `*[_type == "infoPage"][0]{
  title, bio, contactEmail, contactDetails, services, clients, collaborators,
  newsletterLink, inviteInformation, portraitImage, sections
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
const headline = computed(() => page.value.bio || 'Rhyana Hollingsworth is a London based Creative Producer and Director working across art, fashion and culture. Her practice centres on bringing creative ideas to life through production, thoughtful execution and creative operations, helping brands and people build emotional worlds and create cultural presence.')
const baseNote = computed(() => page.value.contactDetails || 'Based in London, available worldwide.')
const availabilityNote = computed(() => page.value.inviteInformation || 'Available for launches, campaigns, productions, creative operations, events and collaborations.')
const contactEmail = computed(() => page.value.contactEmail || 'Hello@yanastudios.pr')
const extraSections = computed(() => page.value.sections || [])
const infoParagraphs = computed(() => [
  headline.value,
  baseNote.value,
  availabilityNote.value,
  `Services: ${services.value.join(', ')}.`,
  `Selected clients and collaborators: ${[...clients.value, ...(page.value.collaborators || [])].filter(Boolean).join(', ')}.`,
  ...extraSections.value.map((section) => section.body).filter(Boolean)
].filter(Boolean))
const portraitImage = computed(() => sanityImage(page.value.portraitImage))

useSeo({ title: page.value.title || 'Info', description: page.value.bio || 'Bio, contact, services, clients and collaborators for Yana Studios.', path: '/info' })
</script>

<template>
  <section class="info-page">
    <figure class="info-portrait">
      <img v-if="portraitImage" :src="portraitImage" :alt="page.portraitImage?.alt || 'Portrait of Rhyana'" />
      <span v-else aria-hidden="true">Image</span>
    </figure>
    <div class="info-paragraphs">
      <p v-for="paragraph in infoParagraphs" :key="paragraph" class="rich-text">{{ paragraph }}</p>
      <p>
        <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        <template v-if="page.newsletterLink"> · <a :href="page.newsletterLink" target="_blank" rel="noreferrer">Newsletter</a></template>
        · <a href="https://www.instagram.com/yana_studios" target="_blank" rel="noreferrer">Instagram</a>
      </p>
    </div>

    <h1 class="info-wordmark">Yana’s Studios</h1>
  </section>
</template>
