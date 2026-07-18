<script setup>
const props = defineProps({
  wordmark: {
    type: String,
    default: 'Yana Studios'
  },
  links: {
    type: Array,
    default: () => []
  }
})

const open = ref(false)
const waysOpen = ref(false)
const route = useRoute()
const waysServiceLinks = waysServices.map((service) => ({
  label: service.menuLabel || service.title,
  to: `/ways-to-work-better/${service.id}`
}))

const displayLabel = (label = '') => label
  .toLowerCase()
  .replace(/\b\w/g, (letter) => letter.toUpperCase())
  .replace('Yana', 'Yana')

const isWaysLink = (link) => link?.label?.toLowerCase().replace(/\s+/g, '').startsWith('waystowork')

const primaryLinks = computed(() => props.links.filter((link) => !isWaysLink(link)))

watch(() => route.fullPath, () => {
  open.value = false
  waysOpen.value = false
})
</script>

<template>
  <header class="site-header">
    <button class="menu-toggle" type="button" :aria-expanded="open" aria-controls="primary-menu" @click="open = !open">
      <span class="menu-toggle__label">{{ open ? 'Close' : 'Menu' }}</span>
      <span class="menu-toggle__icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
    <NuxtLink class="site-logo" to="/">{{ wordmark }}</NuxtLink>
  </header>
  <nav id="primary-menu" class="menu-panel" :class="{ 'is-open': open }" aria-label="Primary">
      <NuxtLink
        v-for="link in primaryLinks"
        :key="`${link.label}-${link.to || link.href}`"
        :to="link.href || link.to"
        :external="Boolean(link.href)"
        :target="link.openInNewTab ? '_blank' : undefined"
        :rel="link.openInNewTab ? 'noreferrer' : undefined"
      >
        {{ displayLabel(link.label) }}
    </NuxtLink>
    <div class="menu-nested">
      <button class="menu-nested__toggle" type="button" :aria-expanded="waysOpen" @click="waysOpen = !waysOpen">
        WaysToWork Better
      </button>
      <div class="menu-nested__links" :class="{ 'is-open': waysOpen }">
        <NuxtLink
          v-for="link in waysServiceLinks"
          :key="`${link.label}-${link.to || link.href}`"
          :to="link.href || link.to"
          :external="Boolean(link.href)"
          :target="link.openInNewTab ? '_blank' : undefined"
          :rel="link.openInNewTab ? 'noreferrer' : undefined"
        >
          {{ displayLabel(link.label) }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
