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
    _id, title, date, year,
    "slug": slug.current,
    "service": coalesce(services[0]->title, service->title, role)
  }
}`

const { data } = await useAsyncData('work-projects', () => fetchSanity(query))
const projects = computed(() => data.value?.projects || [])
const page = computed(() => data.value?.page || {})

useSeo({
  title: page.value.seoTitle || page.value.title || 'Work',
  description: page.value.seoDescription || page.value.introduction || 'Project archive for Yana Studios and Rhyana.',
  image: sanityImage(page.value.socialImage),
  path: '/work'
})
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>{{ page.title || 'Work' }}</h1>
      <p v-if="page.introduction">{{ page.introduction }}</p>
    </div>
    <ProjectList :projects="projects" />
  </section>
</template>
