<script setup>
const props = defineProps({
  wordmark: {
    type: String,
    default: 'Yana’s Studios'
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

const displayLabel = (label = '') => {
  const normalized = normalLabel(label)
  if (normalized === 'work') return 'Overview'
  if (normalized.startsWith('waystowork')) return 'Ways To Work Better'

  return label
    .replace(/\*/g, '')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace('Yana', 'Yana')
}

const isWaysLink = (link) => link?.label?.toLowerCase().replace(/\s+/g, '').startsWith('waystowork')

const menuOrder = ['home', 'overview', 'work', 'poweredbyyana', 'worldbuilding', 'info']
const normalLabel = (label = '') => label.toLowerCase().replace(/[^a-z0-9]+/g, '')
const primaryLinks = computed(() => props.links
  .filter((link) => !isWaysLink(link))
  .slice()
  .sort((a, b) => {
    const aIndex = menuOrder.indexOf(normalLabel(a.label))
    const bIndex = menuOrder.indexOf(normalLabel(b.label))
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  }))
const beforeWaysLinks = computed(() => primaryLinks.value.filter((link) => ['home', 'overview', 'work'].includes(normalLabel(link.label))))
const afterWaysLinks = computed(() => primaryLinks.value.filter((link) => !['home', 'overview', 'work'].includes(normalLabel(link.label))))

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
  <header class="site-header" :class="{ 'is-menu-open': open }">
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
        <span>Ways To Work Better</span>
        <span class="menu-nested__arrow" aria-hidden="true" />
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
        <button class="menu-nested__close" type="button" @click="waysOpen = false">
          <span>Close Ways To Work Better</span>
          <span aria-hidden="true">↑</span>
        </button>
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
