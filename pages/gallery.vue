<script setup>
const query = `*[_type == "galleryEntry"] | order(order asc, date desc){
  _id, title, date, image,
  "service": coalesce(service->title, role),
  "projectSlug": linkedProject->slug.current
}`

const { data } = await useAsyncData('gallery-entries', () => fetchSanity(query))
const entries = computed(() => (data.value || []).map((entry) => ({
  ...entry,
  imageUrl: sanityImage(entry.image)
})))

useSeo({ title: 'Gallery', description: 'Editorial image archive for Yana Studios.', path: '/gallery' })
</script>

<template>
  <section class="page-pad">
    <div class="page-heading">
      <h1>Gallery</h1>
      <p>Images from the archive, connected back to project pages where available.</p>
    </div>
    <GalleryGrid :entries="entries" />
  </section>
</template>
