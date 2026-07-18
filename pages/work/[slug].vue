<script setup>
const route = useRoute()
const query = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, date, year, client, location, role, roles,
  "service": coalesce(services[0]->title, service->title),
  shortDescription, fullDescription, mainImage,
  galleryImages, videoUrl, seoTitle, seoDescription, socialImage,
  contentBlocks
}`

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () => fetchSanity(query, { slug: route.params.slug }))
const fallbackProject = computed(() => placeholderProjects.find((item) => item.slug === route.params.slug))
const currentProject = computed(() => project.value || fallbackProject.value)

if (!currentProject.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const mainImageUrl = computed(() => currentProject.value.mainImageUrl || sanityImage(currentProject.value.mainImage))
const gallery = computed(() => currentProject.value.galleryImageUrls || (currentProject.value.galleryImages || []).map((image) => sanityImage(image)).filter(Boolean))
const placeholderProjectBlocks = [
  {
    _key: 'placeholder-project-context',
    blockType: 'textSection',
    body: 'Placeholder paragraph for shaping project context, pacing and editorial rhythm. This space can hold background, process notes, production details or a short reflection on how the work came together.'
  },
  {
    _key: 'placeholder-project-process',
    blockType: 'textSection',
    body: 'A second placeholder paragraph for testing longer project pages. Use this area to check how copy sits between image sections, paired media and full-page visual moments.'
  }
]
const projectContentBlocks = computed(() => currentProject.value.contentBlocks?.length ? currentProject.value.contentBlocks : placeholderProjectBlocks)
const projectParagraph = computed(() => {
  const project = currentProject.value
  const description = project.fullDescription || project.shortDescription || 'Placeholder project introduction for styling the opening paragraph, project details and image rhythm before final copy is published.'
  const info = [
    project.client ? `Client: ${project.client}` : '',
    project.year || project.date ? `Date: ${project.year || project.date}` : '',
    project.location ? `Location: ${project.location}` : '',
    project.service ? `Service: ${project.service}` : '',
    project.role ? `Role: ${project.role}` : '',
    project.roles?.length ? `Contributions: ${project.roles.join(', ')}` : ''
  ].filter(Boolean).join('. ')

  return [description, info].filter(Boolean).join(' ')
})
useSeo({
  title: currentProject.value.seoTitle || currentProject.value.title,
  description: currentProject.value.seoDescription || currentProject.value.shortDescription || 'Project page for Yana Studios.',
  image: sanityImage(currentProject.value.socialImage) || mainImageUrl.value,
  path: route.path
})
</script>

<template>
  <article class="project-detail">
    <section class="project-detail-intro">
      <p v-if="projectParagraph" class="project-detail-copy rich-text">{{ projectParagraph }}</p>
    </section>
    <figure v-if="mainImageUrl" class="project-full-bleed-image">
      <img :src="mainImageUrl" :alt="currentProject.mainImage?.alt || currentProject.title" />
    </figure>
    <ProjectContentBlocks :blocks="projectContentBlocks" />
    <section v-if="currentProject.videoUrl" class="project-video-block">
      <iframe class="video-frame" :src="currentProject.videoUrl" :title="currentProject.title" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen />
    </section>
    <section v-if="gallery.length" class="detail-gallery">
      <figure v-for="image in gallery" :key="image">
        <img :src="image" :alt="currentProject.title" loading="lazy" />
      </figure>
    </section>
  </article>
</template>
