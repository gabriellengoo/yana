<script setup>
const defaultLinks = [
  { label: 'Yana Studios', to: '/home' },
  { label: 'Work', to: '/work' },
  { label: 'Powered By Yana', to: '/powered-by-yana' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Video', to: '/video' },
  { label: 'Info', to: '/info' }
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

  return items.map((item) => ({
    label: item.label,
    to: item.linkType === 'external' ? undefined : item.internalPath,
    href: item.linkType === 'external' ? item.externalUrl : undefined,
    openInNewTab: item.openInNewTab
  })).filter((item) => item.label && (item.to || item.href))
})

const brandStyle = computed(() => ({
  '--color-brand': settings.value.primaryBrandColour || '#002366',
  '--color-text': settings.value.primaryBrandColour || '#002366',
  '--color-border': settings.value.primaryBrandColour || '#002366'
}))
</script>

<template>
  <div class="site-shell" :style="brandStyle">
    <SiteHeader :wordmark="settings.wordmark || '.YANA'" :links="links" />
    <main class="site-main">
      <slot />
    </main>
    <footer v-if="settings.footerText" class="site-footer">
      <div class="container">{{ settings.footerText }}</div>
    </footer>
  </div>
</template>
