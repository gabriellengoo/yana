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
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : (props.settings?.totalDuration ?? 3300))
})

onBeforeUnmount(() => {
  window.clearTimeout(completionTimer)
})
</script>

<template>
  <div class="intro-lockup" :style="{ '--intro-duration': `${settings.totalDuration ?? 3300}ms` }">
    <div class="intro-word">yana.</div>
    <div class="intro-description">Production &amp; creative direction</div>
    <span class="intro-line" aria-hidden="true" />
  </div>
</template>
