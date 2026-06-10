<script setup>
const router = useRouter()

useSeo({ title: 'Rhyana', description: 'Enter the Yana Studios archive.', path: '/' })

const enter = async () => {
  await router.push('/home')
}
</script>

<template>
  <section class="intro-page">
    <IntroAnimation @complete="enter" />
  </section>
</template>
