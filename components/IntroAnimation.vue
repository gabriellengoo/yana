<script setup>
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['complete'])
const phase = ref(0)
const removableLetters = 6

onMounted(() => {
  if (props.settings?.enabled === false) {
    emit('complete')
    return
  }

  const initialDelay = props.settings?.initialDelay ?? 700
  const stepDuration = props.settings?.stepDuration ?? 150
  const totalDuration = props.settings?.totalDuration ?? 2100

  Array.from({ length: removableLetters }).forEach((_, index) => {
    window.setTimeout(() => {
      phase.value = index + 1
    }, initialDelay + index * stepDuration)
  })
  window.setTimeout(() => {
    emit('complete')
  }, totalDuration)
})
</script>

<template>
  <div class="intro-lockup">
    <div class="intro-word" :class="`intro-word--phase-${phase}`" aria-live="polite" aria-label="Yana Studios">
      <span class="intro-mark">
        <span class="intro-core">
          <span class="intro-remove intro-remove--1">R</span><span class="intro-remove intro-remove--2">H</span><span>YANA</span><span class="intro-remove intro-remove--3">S</span><span class="intro-remove intro-remove--4">&nbsp;S</span><span class="intro-remove intro-remove--5">T</span><span class="intro-remove intro-remove--6">U</span>
        </span>
      </span>
    </div>
  </div>
</template>
