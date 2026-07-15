<script setup>
const query = `{
  "page": *[_type == "poweredByYanaPage"][0]{
    title,
    introduction,
    sections,
    callsToAction,
    seoTitle,
    seoDescription,
    socialImage,
    selectedProjects[]->{
      _id, title, date, shortDescription, mainImage, thumbnail,
      "slug": slug.current,
      "service": coalesce(services[0]->title, service->title, role)
    }
  },
  "entries": *[_type == "poweredByYanaEntry"] | order(order asc, date desc){
    _id, title, date, description, images, externalLink,
    "slug": slug.current
  },
  "fallbackProjects": *[_type == "project" && isPoweredByYana == true] | order(order asc, date desc){
    _id, title, date, shortDescription, mainImage, thumbnail,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  }
}`

const { data } = await useAsyncData('powered-by-yana', () => fetchSanity(query))
const page = computed(() => data.value?.page || {})
const projects = computed(() => (page.value.selectedProjects?.length ? page.value.selectedProjects : data.value?.fallbackProjects || []).map((project) => ({
  ...project,
  mainImageUrl: sanityImage(project.thumbnail) || sanityImage(project.mainImage)
})))
const entries = computed(() => (data.value?.entries || []).map((entry) => ({
  ...entry,
  imageUrl: sanityImage(entry.images?.[0])
})))

useSeo({
  title: page.value.seoTitle || page.value.title || 'Powered By Yana',
  description: page.value.seoDescription || page.value.introduction || 'Original initiatives, exhibitions, activations and cultural projects.',
  image: sanityImage(page.value.socialImage),
  path: '/powered-by-yana'
})
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>{{ page.title || 'Powered By Yana' }}</h1>
      <p v-if="page.introduction">{{ page.introduction }}</p>
    </div>
    <div v-if="page.sections?.length" class="info-grid page-sections">
      <section v-for="section in page.sections" :key="section._key">
        <div v-if="section.heading" class="section-label">{{ section.heading }}</div>
        <p v-if="section.body" class="rich-text">{{ section.body }}</p>
      </section>
    </div>
    <div v-if="projects.length" class="related-projects">
      <ProjectCard v-for="project in projects" :key="project._id" :project="project" />
    </div>
    <div v-if="entries.length" class="initiative-grid">
      <article v-for="entry in entries" :key="entry._id" class="initiative-card">
        <div class="initiative-thumb">
          <img v-if="entry.imageUrl" :src="entry.imageUrl" :alt="entry.images?.[0]?.alt || entry.title" loading="lazy" />
        </div>
        <div class="project-meta">
          <div class="project-kicker">{{ entry.date || 'Undated' }}</div>
          <h2 class="project-title">{{ entry.title }}</h2>
          <p v-if="entry.description" class="project-description">{{ entry.description }}</p>
          <a v-if="entry.externalLink" class="project-kicker" :href="entry.externalLink" target="_blank" rel="noreferrer">External Link</a>
        </div>
      </article>
    </div>
    <div v-if="page.callsToAction?.length" class="cta-row">
      <a
        v-for="cta in page.callsToAction"
        :key="cta._key"
        class="project-kicker"
        :href="cta.linkType === 'external' ? cta.externalUrl : cta.internalPath"
        :target="cta.openInNewTab ? '_blank' : undefined"
        :rel="cta.openInNewTab ? 'noreferrer' : undefined"
      >
        {{ cta.label }}
      </a>
    </div>
    <div v-if="!entries.length && !projects.length" class="empty-state">Powered By Yana entries will appear here when published.</div>
  </section>
</template>
