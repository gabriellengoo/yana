<script setup>
const route = useRoute()
const query = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, date, year, client, location, role, roles, shortDescription, fullDescription, mainImage, thumbnail,
  galleryImages, videoUrl, externalLink, seoTitle, seoDescription, socialImage,
  contentBlocks,
  credits,
  "services": services[]->{ _id, title, "slug": slug.current },
  "service": coalesce(services[0]->title, service->title, role),
  "relatedProjects": relatedProjects[]->{
    _id, title, date, shortDescription,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role),
    mainImage,
    thumbnail
  }
}`

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () => fetchSanity(query, { slug: route.params.slug }))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const mainImageUrl = computed(() => sanityImage(project.value.mainImage))
const gallery = computed(() => (project.value.galleryImages || []).map((image) => sanityImage(image)).filter(Boolean))
const serviceList = computed(() => {
  const services = project.value.services?.map((service) => service.title).filter(Boolean) || []
  if (services.length) return services.join(', ')
  return project.value.service || project.value.role || 'Studio'
})
const relatedProjects = computed(() => (project.value.relatedProjects || []).map((related) => ({
  ...related,
  mainImageUrl: sanityImage(related.thumbnail) || sanityImage(related.mainImage)
})))

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
        <img :src="mainImageUrl" :alt="project.mainImage?.alt || project.title" />
      </div>
      <div class="project-detail-grid">
        <div>
          <div class="project-kicker">{{ project.year || project.date || 'Undated' }} / {{ serviceList }}</div>
          <h1 class="hero-title">{{ project.title }}</h1>
        </div>
        <div>
          <p v-if="project.shortDescription" class="project-description">{{ project.shortDescription }}</p>
          <p v-if="project.fullDescription" class="rich-text">{{ project.fullDescription }}</p>
          <p v-if="project.client" class="project-description">Client: {{ project.client }}</p>
          <p v-if="project.location" class="project-description">Location: {{ project.location }}</p>
          <p v-if="project.roles?.length" class="project-description">Role: {{ project.roles.join(', ') }}</p>
          <p v-else class="project-description">Role: {{ project.role || project.service || 'Studio contribution' }}</p>
          <a v-if="project.externalLink" class="project-kicker" :href="project.externalLink" target="_blank" rel="noreferrer">External Link</a>
        </div>
      </div>
    </section>
    <ProjectContentBlocks :blocks="project.contentBlocks || []" />
    <section v-if="project.videoUrl" class="container page-heading">
      <iframe class="video-frame" :src="project.videoUrl" :title="project.title" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen />
    </section>
    <section v-if="gallery.length" class="detail-gallery">
      <figure v-for="image in gallery" :key="image">
        <img :src="image" :alt="project.title" loading="lazy" />
      </figure>
    </section>
    <section v-if="project.credits?.length" class="container content-block">
      <div class="section-label">Credits</div>
      <ul class="info-list">
        <li v-for="credit in project.credits" :key="`${credit.role}-${credit.name}`">
          <span>{{ credit.role }}</span>
          <strong>{{ credit.name }}</strong>
        </li>
      </ul>
    </section>
    <section v-if="relatedProjects.length" class="related-projects">
      <div class="container">
        <div class="section-label">Related Projects</div>
      </div>
      <ProjectCard v-for="related in relatedProjects" :key="related._id" :project="related" />
    </section>
  </article>
</template>
