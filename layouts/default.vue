<script setup>
const defaultLinks = [
  { label: 'HOME', to: '/' },
  { label: 'WORK', to: '/work' },
  { label: 'WAYS TO WORK BETTER*', to: '/ways-to-work-better' },
  { label: 'POWERED BY YANA', to: '/powered-by-yana' },
  { label: 'WORLD BUILDING', to: '/world-building' },
  { label: 'INFO', to: '/info' }
]

const query = `{
  "settings": *[_type == "siteSettings"][0]{
    title,
    wordmark,
    primaryBrandColour,
    footerText
  },
  "navigation": *[_type == "navigation"][0]{
    items[] | order(coalesce(order, 999) asc){
      label,
      linkType,
      internalPath,
      externalUrl,
      openInNewTab
    }
  }
}`

const { data } = await useAsyncData('global-site-settings', () => fetchSanity(query))
const settings = computed(() => data.value?.settings || {})
const links = computed(() => {
  const items = data.value?.navigation?.items || []

  if (!items.length) return defaultLinks

  return items.map((item) => {
    const internalPath = item.label?.toLowerCase() === 'home' && item.internalPath === '/home'
      ? '/'
      : item.internalPath

    return {
      label: item.label,
      to: item.linkType === 'external' ? undefined : internalPath,
      href: item.linkType === 'external' ? item.externalUrl : undefined,
      openInNewTab: item.openInNewTab
    }
  }).filter((item) => item.label && (item.to || item.href))
})

const brandStyle = computed(() => ({
  '--color-brand': settings.value.primaryBrandColour || '#002366'
}))
const wordmark = computed(() => settings.value.wordmark === '.YANA' ? 'Yana Studios' : settings.value.wordmark || 'Yana Studios')
</script>

<template>
  <div class="site-shell" :style="brandStyle">
    <SiteHeader :wordmark="wordmark" :links="links" />
    <main class="site-main">
      <slot />
    </main>
    <footer v-if="settings.footerText" class="site-footer">
      <div class="container">{{ settings.footerText }}</div>
    </footer>
  </div>
</template>
