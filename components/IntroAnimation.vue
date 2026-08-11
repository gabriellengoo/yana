<script setup>
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['complete'])
const stage = ref(0)

onMounted(() => {
  if (props.settings?.enabled === false) {
    emit('complete')
    return
  }

  const initialDelay = props.settings?.initialDelay ?? 700
  const spellDelay = props.settings?.spellDelay ?? 1400
  const resolveDelay = props.settings?.resolveDelay ?? 2300
  const totalDuration = props.settings?.totalDuration ?? 3100

  window.setTimeout(() => { stage.value = 1 }, initialDelay)
  window.setTimeout(() => { stage.value = 2 }, spellDelay)
  window.setTimeout(() => { stage.value = 3 }, resolveDelay)
  window.setTimeout(() => {
    emit('complete')
  }, totalDuration)
})
</script>

<template>
  <div class="intro-lockup">
    <div class="intro-word" :class="`intro-word--stage-${stage}`" aria-live="polite" aria-label="Yana Studios to Rhyana to .Yana">
      <span class="intro-layer intro-layer--base" aria-hidden="true">YANA STUDIOS</span>
      <span class="intro-layer intro-layer--rhyana" aria-hidden="true">RHYANA</span>
      <span class="intro-layer intro-layer--dot-yana" aria-hidden="true">.YANA</span>
    </div>
  </div>
</template>
