<script setup>
const route = useRoute()
const service = computed(() => waysServices.find((item) => item.id === route.params.slug))

if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found' })
}

useSeo({
  title: service.value.title,
  description: service.value.body,
  path: route.path
})
</script>

<template>
  <section class="page-pad service-page">
    <div class="page-heading">
      <h1>{{ service.title }}</h1>
    </div>
    <p class="rich-text service-page__body">{{ service.body }}</p>
  </section>
</template>
