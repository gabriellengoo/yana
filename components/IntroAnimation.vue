<script setup>
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['complete'])
let completionTimer

onMounted(() => {
  if (props.settings?.enabled === false) {
    emit('complete')
    return
  }

  completionTimer = window.setTimeout(() => {
    emit('complete')
  }, props.settings?.totalDuration ?? 3300)
})

onBeforeUnmount(() => {
  window.clearTimeout(completionTimer)
})
</script>

<template>
  <div class="intro-lockup">
    <div class="intro-word">yana.</div>
  </div>
</template>
