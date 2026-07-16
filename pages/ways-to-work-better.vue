<script setup>
const query = `*[_type == "sitePage" && path == "/ways-to-work-better"][0]{
  title,
  introduction,
  seoTitle,
  seoDescription,
  socialImage
}`

const { data: page } = await useAsyncData('ways-to-work-better-page', () => fetchSanity(query))
const content = computed(() => page.value || {})
const services = [
  { id: 'embedded-producer', title: 'Embedded Producer' },
  { id: 'campaign-production', title: 'Campaign Production' },
  { id: 'creative-operations', title: 'Creative Operations' },
  { id: 'creative-direction', title: 'Creative Direction' },
  { id: 'movement-direction-intimacy-coordination', title: 'Movement Direction / Intimacy Coordination' }
]

useSeo({
  title: content.value.seoTitle || content.value.title || 'Ways to Work Better',
  description: content.value.seoDescription || content.value.introduction || 'Ways to work better with Yana Studios.',
  image: sanityImage(content.value.socialImage),
  path: '/ways-to-work-better'
})
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>{{ content.title || 'Ways to Work Better*' }}</h1>
      <p v-if="content.introduction">{{ content.introduction }}</p>
    </div>
    <div class="service-anchor-list">
      <section v-for="service in services" :id="service.id" :key="service.id" class="service-anchor">
        <h2>{{ service.title }}</h2>
      </section>
    </div>
  </section>
</template>
