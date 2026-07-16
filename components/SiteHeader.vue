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
const menuRouteLoading = useState('menuRouteLoading', () => false)
const waysServiceLinks = [
  { label: 'Embedded Producer', to: '/ways-to-work-better#embedded-producer' },
  { label: 'Campaign Production', to: '/ways-to-work-better#campaign-production' },
  { label: 'Creative Operations', to: '/ways-to-work-better#creative-operations' },
  { label: 'Creative Direction', to: '/ways-to-work-better#creative-direction' },
  { label: 'Movement Direction / Intimacy Coordination', to: '/ways-to-work-better#movement-direction-intimacy-coordination' }
]

const displayLabel = (label = '') => label
  .toLowerCase()
  .replace(/\b\w/g, (letter) => letter.toUpperCase())
  .replace('Yana', 'Yana')

const isWaysLink = (link) => link?.label?.toLowerCase().replace(/\s+/g, '').startsWith('waystowork')

const primaryLinks = computed(() => props.links.filter((link) => !isWaysLink(link)))

const destinationPath = (link) => {
  if (!link?.to || link.href) return ''
  return link.to.split('#')[0] || '/'
}

const startNavigation = (link) => {
  const path = destinationPath(link)
  if (!path || path === route.path) return
  menuRouteLoading.value = true
}

watch(() => route.fullPath, () => {
  open.value = false
  waysOpen.value = false
  menuRouteLoading.value = false
})
</script>

<template>
  <header class="site-header">
    <button class="menu-toggle" type="button" :aria-expanded="open" aria-controls="primary-menu" @click="open = !open">
      <span class="menu-toggle__label">{{ open ? 'Close' : 'Menu' }}</span>
      <span v-if="menuRouteLoading" class="menu-loading-dot" aria-hidden="true" />
      <span class="menu-toggle__icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
    <NuxtLink class="site-logo" to="/home">{{ wordmark }}</NuxtLink>
  </header>
  <nav id="primary-menu" class="menu-panel" :class="{ 'is-open': open }" aria-label="Primary">
      <NuxtLink
        v-for="link in primaryLinks"
        :key="`${link.label}-${link.to || link.href}`"
        :to="link.href || link.to"
        :external="Boolean(link.href)"
        :target="link.openInNewTab ? '_blank' : undefined"
        :rel="link.openInNewTab ? 'noreferrer' : undefined"
        @click="startNavigation(link)"
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
          @click="startNavigation(link)"
        >
          {{ displayLabel(link.label) }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
