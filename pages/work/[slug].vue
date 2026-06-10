<script setup>
const route = useRoute()
const query = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, date, role, shortDescription, fullDescription, mainImage,
  galleryImages, videoUrl, externalLink, seoTitle, seoDescription, socialImage,
  "service": coalesce(service->title, role)
}`

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () => fetchSanity(query, { slug: route.params.slug }))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const mainImageUrl = computed(() => sanityImage(project.value.mainImage))
const gallery = computed(() => (project.value.galleryImages || []).map((image) => sanityImage(image)).filter(Boolean))

useSeo({
  title: project.value.seoTitle || project.value.title,
  description: project.value.seoDescription || project.value.shortDescription || 'Project page for Yana Studios.',
  image: sanityImage(project.value.socialImage) || mainImageUrl.value,
  path: route.path
})
</script>

<template>
  <article class="project-detail">
    <section class="project-detail-hero">
      <div v-if="mainImageUrl" class="hero-media">
        <img :src="mainImageUrl" :alt="project.title" />
      </div>
      <div class="project-detail-grid">
        <div>
          <div class="project-kicker">{{ project.date || 'Undated' }} / {{ project.service || 'Studio' }}</div>
          <h1 class="hero-title">{{ project.title }}</h1>
        </div>
        <div>
          <p v-if="project.shortDescription" class="project-description">{{ project.shortDescription }}</p>
          <p v-if="project.fullDescription" class="rich-text">{{ project.fullDescription }}</p>
          <p class="project-description">
            Role: {{ project.service || project.role || 'Studio contribution' }}
          </p>
          <a v-if="project.externalLink" class="project-kicker" :href="project.externalLink" target="_blank" rel="noreferrer">External Link</a>
        </div>
      </div>
    </section>
    <section v-if="project.videoUrl" class="container page-heading">
      <iframe class="video-frame" :src="project.videoUrl" :title="project.title" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen />
    </section>
    <section v-if="gallery.length" class="detail-gallery">
      <figure v-for="image in gallery" :key="image">
        <img :src="image" :alt="project.title" loading="lazy" />
      </figure>
    </section>
  </article>
</template>
