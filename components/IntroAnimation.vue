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

  const initialDelay = props.settings?.initialDelay ?? 640
  const spellDelay = props.settings?.spellDelay ?? 1280
  const resolveDelay = props.settings?.resolveDelay ?? 2080
  const totalDuration = props.settings?.totalDuration ?? 3300

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
    <div class="intro-word" :class="`intro-word--stage-${stage}`" aria-live="polite" aria-label="Rhyana’s Stu to Yana’s Studios">
      <span class="intro-layer intro-layer--start" aria-hidden="true">
        <span class="intro-piece intro-piece--rh">Rh</span><span>yana’s Stu</span>
      </span>
      <span class="intro-layer intro-layer--final" aria-hidden="true">
        <span>Yana’s Stu</span><span class="intro-piece intro-piece--dios">dios</span>
      </span>
    </div>
  </div>
</template>
