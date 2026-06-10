<script setup>
const query = `*[_type == "project"] | order(order asc, date desc){
  _id, title, date,
  "slug": slug.current,
  "service": coalesce(service->title, role)
}`

const { data } = await useAsyncData('work-projects', () => fetchSanity(query))
const projects = computed(() => data.value || [])

useSeo({ title: 'Work', description: 'Project archive for Yana Studios and Rhyana.', path: '/work' })
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>Work</h1>
      <p>Selected projects across creative direction, production, movement direction, world building and Powered By Yana initiatives.</p>
    </div>
    <ProjectList :projects="projects" />
  </section>
</template>
