<script setup>
const query = `{
  "settings": *[_type == "siteSettings"][0]{
    title, description, heroImage, seoTitle, seoDescription, socialImage
  },
  "home": *[_type == "homePage"][0]{
    title,
    introduction,
    heroImage,
    featuredLabel,
    seoTitle,
    seoDescription,
    socialImage
  }
}`

const { data } = await useAsyncData('home-content', () => fetchSanity(query))
const settings = computed(() => data.value?.settings || {})
const home = computed(() => data.value?.home || {
  title: 'Yana Studios',
  introduction: 'Placeholder statement copy for styling the homepage while final content is being prepared.'
})
const heroImage = computed(() => sanityImage(home.value.heroImage) || sanityImage(settings.value.heroImage))
const pageTitle = computed(() => home.value.title || settings.value.title || 'Yana Studios')
const introduction = computed(() => home.value.introduction || settings.value.description || 'Helping people and brands build emotional worlds and create cultural presence. Bringing ideas to life through production, creative operations and thoughtful execution.')

useSeo({
  title: home.value.seoTitle || pageTitle.value,
  description: home.value.seoDescription || settings.value.seoDescription || introduction.value || 'Creative direction, production and cultural archive by Rhyana.',
  image: sanityImage(home.value.socialImage) || sanityImage(settings.value.socialImage) || heroImage.value,
  path: '/home'
})
</script>

<template>
  <section class="home-statement" aria-labelledby="home-statement">
    <h1 id="home-statement" class="sr-only">{{ pageTitle }}</h1>
    <p v-if="introduction">{{ introduction }}</p>
  </section>
</template>
