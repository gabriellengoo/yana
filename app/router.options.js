export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 0 }
    if (to.fullPath !== from.fullPath) return { left: 0, top: 0 }
    return false
  }
}
