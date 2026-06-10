<script setup>
const emit = defineEmits(['complete'])
const word = ref('RHYANA')

onMounted(() => {
  const frames = ['RHYANA', 'RHYAN.', 'R.YAN.', '.YANA']
  frames.forEach((frame, index) => {
    window.setTimeout(() => {
      word.value = frame
    }, 650 + index * 520)
  })
  window.setTimeout(() => {
    emit('complete')
  }, 3000)
})
</script>

<template>
  <div class="intro-lockup">
    <div class="intro-word" aria-live="polite">{{ word }}</div>
  </div>
</template>
