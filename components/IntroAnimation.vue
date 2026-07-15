<script setup>
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['complete'])
const frames = computed(() => {
  const configured = props.settings?.frames?.filter(Boolean)
  return configured?.length ? configured : ['RHYANA', 'RHYAN.', 'R.YAN.', '.YANA']
})
const word = ref(frames.value[0])

onMounted(() => {
  if (props.settings?.enabled === false) {
    emit('complete')
    return
  }

  const initialDelay = props.settings?.initialDelay ?? 650
  const frameDuration = props.settings?.frameDuration ?? 520
  const totalDuration = props.settings?.totalDuration ?? 3000

  frames.value.forEach((frame, index) => {
    window.setTimeout(() => {
      word.value = frame
    }, initialDelay + index * frameDuration)
  })
  window.setTimeout(() => {
    emit('complete')
  }, totalDuration)
})
</script>

<template>
  <div class="intro-lockup">
    <div class="intro-word" aria-live="polite">{{ word }}</div>
  </div>
</template>
