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
const router = useRouter()
const waysServiceLinks = waysServices.map((service) => ({
  label: service.menuLabel || service.title,
  to: `/ways-to-work-better/${service.id}`
}))

const displayLabel = (label = '') => label
  .toLowerCase()
  .replace(/\b\w/g, (letter) => letter.toUpperCase())
  .replace('Yana', 'Yana')

const isWaysLink = (link) => link?.label?.toLowerCase().replace(/\s+/g, '').startsWith('waystowork')

const menuOrder = ['home', 'work', 'poweredbyyana', 'worldbuilding', 'info']
const normalLabel = (label = '') => label.toLowerCase().replace(/[^a-z0-9]+/g, '')
const primaryLinks = computed(() => props.links
  .filter((link) => !isWaysLink(link))
  .slice()
  .sort((a, b) => {
    const aIndex = menuOrder.indexOf(normalLabel(a.label))
    const bIndex = menuOrder.indexOf(normalLabel(b.label))
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  }))
const beforeWaysLinks = computed(() => primaryLinks.value.filter((link) => ['home', 'work'].includes(normalLabel(link.label))))
const afterWaysLinks = computed(() => primaryLinks.value.filter((link) => !['home', 'work'].includes(normalLabel(link.label))))

const goHome = async () => {
  open.value = false
  waysOpen.value = false
  await router.push('/')
  if (import.meta.client) window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

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
    <button class="site-logo" type="button" @click="goHome">{{ wordmark }}</button>
  </header>
  <nav id="primary-menu" class="menu-panel" :class="{ 'is-open': open }" aria-label="Primary">
      <NuxtLink
        v-for="link in beforeWaysLinks"
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
        Ways To Work Better*
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
    <NuxtLink
      v-for="link in afterWaysLinks"
      :key="`${link.label}-${link.to || link.href}`"
      :to="link.href || link.to"
      :external="Boolean(link.href)"
      :target="link.openInNewTab ? '_blank' : undefined"
      :rel="link.openInNewTab ? 'noreferrer' : undefined"
    >
      {{ displayLabel(link.label) }}
    </NuxtLink>
  </nav>
</template>
