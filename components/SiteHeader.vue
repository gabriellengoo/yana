<script setup>
defineProps({
  wordmark: {
    type: String,
    default: '.YANA'
  },
  links: {
    type: Array,
    default: () => []
  }
})

const open = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => {
  open.value = false
})
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-logo" to="/home">{{ wordmark }}</NuxtLink>
    <nav class="desktop-nav" aria-label="Primary">
      <NuxtLink
        v-for="link in links"
        :key="`${link.label}-${link.to || link.href}`"
        :to="link.href || link.to"
        :external="Boolean(link.href)"
        :target="link.openInNewTab ? '_blank' : undefined"
        :rel="link.openInNewTab ? 'noreferrer' : undefined"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>
    <button class="mobile-toggle" type="button" @click="open = !open">
      {{ open ? 'Close' : 'Menu' }}
    </button>
  </header>
  <nav class="mobile-panel" :class="{ 'is-open': open }" aria-label="Mobile primary">
    <NuxtLink
      v-for="link in links"
      :key="`${link.label}-${link.to || link.href}`"
      :to="link.href || link.to"
      :external="Boolean(link.href)"
      :target="link.openInNewTab ? '_blank' : undefined"
      :rel="link.openInNewTab ? 'noreferrer' : undefined"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
