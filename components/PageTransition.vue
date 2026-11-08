<script setup>
const curtain = ref(null)
const line = ref(null)
const lockup = ref(null)
const active = ref(false)
const animations = new Set()
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const animate = async (element, frames, duration) => {
  if (!element) return
  const animation = element.animate(frames, {
    duration,
    easing: 'cubic-bezier(.76, 0, .24, 1)',
    fill: 'forwards'
  })
  animations.add(animation)
  try {
    await animation.finished
  } catch {
    // Navigation or unmount can interrupt an animation.
  } finally {
    animations.delete(animation)
    animation.cancel()
  }
}

const transition = {
  css: false,
  mode: 'out-in',
  async onLeave(element, done) {
    if (reducedMotion()) return done()
    active.value = true
    curtain.value.style.opacity = '1'
    curtain.value.style.clipPath = 'inset(0)'
    lockup.value.style.top = '50%'
    await animate(curtain.value, [{ opacity: 0 }, { opacity: 1 }], 160)
    await animate(line.value, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 420)
    if (line.value) line.value.style.transform = 'scaleX(1)'
    done()
  },
  async onEnter(element, done) {
    if (!active.value) return done()
    await Promise.all([
      animate(lockup.value, [{ top: '50%' }, { top: '24px' }], 680),
      animate(curtain.value, [
        { clipPath: 'inset(0)' },
        { clipPath: 'inset(0)', offset: 0.3 },
        { clipPath: 'inset(0 0 100% 0)' }
      ], 800)
    ])
    if (curtain.value) curtain.value.style.opacity = '0'
    if (line.value) line.value.style.transform = 'scaleX(0)'
    active.value = false
    done()
  }
}

onBeforeUnmount(() => {
  for (const animation of animations) animation.cancel()
})
</script>

<template>
  <slot :transition="transition" />
  <div ref="curtain" class="page-curtain" :class="{ 'is-active': active }" style="opacity: 0" aria-hidden="true">
    <div ref="lockup" class="page-curtain__lockup">
      <span ref="line" class="page-curtain__line" />
      <span>yana.</span>
      <span>Production &amp; creative direction</span>
    </div>
  </div>
</template>
