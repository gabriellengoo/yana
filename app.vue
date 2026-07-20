<script setup>
const route = useRoute()
</script>

<template>
  <NuxtLayout>
    <PageTransition>
      <NuxtPage :key="route.fullPath" />
    </PageTransition>
  </NuxtLayout>
</template>
