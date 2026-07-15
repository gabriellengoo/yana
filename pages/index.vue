<script setup>
const router = useRouter()
const query = `*[_type == "siteSettings"][0]{
  title,
  description,
  openingAnimation,
  seoTitle,
  seoDescription,
  socialImage
}`

const { data: settings } = await useAsyncData('intro-settings', () => fetchSanity(query))

useSeo({
  title: settings.value?.seoTitle || settings.value?.title || 'Rhyana',
  description: settings.value?.seoDescription || settings.value?.description || 'Enter the Yana Studios archive.',
  image: sanityImage(settings.value?.socialImage),
  path: '/'
})

const enter = async () => {
  await router.push('/home')
}
</script>

<template>
  <section class="intro-page">
    <IntroAnimation :settings="settings?.openingAnimation" @complete="enter" />
  </section>
</template>
