<script setup>
const open = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => {
  open.value = false
})

const links = [
  { label: 'Yana Studios', to: '/home' },
  { label: 'Work', to: '/work' },
  { label: 'Powered By Yana', to: '/powered-by-yana' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Video', to: '/video' },
  { label: 'Info', to: '/info' }
]
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-logo" to="/home">.YANA</NuxtLink>
    <nav class="desktop-nav" aria-label="Primary">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
    </nav>
    <button class="mobile-toggle" type="button" @click="open = !open">
      {{ open ? 'Close' : 'Menu' }}
    </button>
  </header>
  <nav class="mobile-panel" :class="{ 'is-open': open }" aria-label="Mobile primary">
    <NuxtLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
  </nav>
</template>
