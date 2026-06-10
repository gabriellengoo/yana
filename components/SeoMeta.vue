<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  path: { type: String, default: '' }
})

useSeo(props)
</script>

<template>
  <span hidden />
</template>
