<script setup>
const query = `{
  "page": *[_type == "sitePage" && path == "/work"][0]{
    title,
    introduction,
    seoTitle,
    seoDescription,
    socialImage
  },
  "projects": *[_type == "project"] | order(order asc, date desc){
    _id, title, date, year, mainImage, thumbnail,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  }
}`

const { data } = await useAsyncData('work-projects', () => fetchSanity(query))
const projects = computed(() => {
  const publishedProjects = (data.value?.projects || []).map((project) => ({
    ...project,
    mainImageUrl: sanityImage(project.thumbnail) || sanityImage(project.mainImage)
  })).filter((project) => project.mainImageUrl)

  return publishedProjects.length ? publishedProjects : placeholderProjects
})
const page = computed(() => data.value?.page || {
  title: 'Work',
  introduction: 'Placeholder archive entries for styling project list states.'
})

useSeo({
  title: page.value.seoTitle || page.value.title || 'Work',
  description: page.value.seoDescription || page.value.introduction || 'Project archive for Yana Studios and Rhyana.',
  image: sanityImage(page.value.socialImage),
  path: '/work'
})
</script>

<template>
  <section class="work-carousel-page">
    <ProjectList :projects="projects" carousel />
  </section>
</template>
