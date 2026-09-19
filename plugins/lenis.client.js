import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.1
  })

  let frameId
  const raf = (time) => {
    lenis.raf(time)
    frameId = requestAnimationFrame(raf)
  }

  frameId = requestAnimationFrame(raf)

  nuxtApp.hook('page:finish', () => {
    lenis.scrollTo(0, { immediate: true })
    lenis.resize()
  })

  nuxtApp.hook('app:beforeUnmount', () => {
    cancelAnimationFrame(frameId)
    lenis.destroy()
  })
})
