<script setup>
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['complete'])
const stage = ref(0)
const baseLetters = 'YANA STUDIOS'.split('')
const rhyanaLetters = 'RHYANA'.split('')

onMounted(() => {
  if (props.settings?.enabled === false) {
    emit('complete')
    return
  }

  const initialDelay = props.settings?.initialDelay ?? 650
  const spellDelay = props.settings?.spellDelay ?? 1520
  const resolveDelay = props.settings?.resolveDelay ?? 2920
  const totalDuration = props.settings?.totalDuration ?? 4300

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
      <span class="intro-layer intro-layer--base" aria-hidden="true">
        <span
          v-for="(letter, index) in baseLetters"
          :key="`base-${letter}-${index}`"
          class="intro-letter"
          :style="{ '--letter-index': index }"
        >{{ letter === ' ' ? '\u00A0' : letter }}</span>
      </span>
      <span class="intro-layer intro-layer--rhyana" aria-hidden="true">
        <span class="intro-dot">.</span>
        <span
          v-for="(letter, index) in rhyanaLetters"
          :key="`rhyana-${letter}-${index}`"
          class="intro-letter"
          :class="[`intro-letter--${letter.toLowerCase()}`, { 'intro-letter--remove': index < 2 }]"
          :style="{ '--letter-index': index }"
        >{{ letter }}</span>
      </span>
    </div>
  </div>
</template>
