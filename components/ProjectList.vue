<script setup>
const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  loop: {
    type: Boolean,
    default: false
  },
  carousel: {
    type: Boolean,
    default: false
  }
})

const renderedProjects = computed(() => props.loop
  ? Array.from({ length: 12 }, () => props.projects).flat()
  : props.projects)

const projectKey = (project, index) => `${project._id}-${index}`
const activeIndex = ref(0)
const cursorSide = ref('next')
const activeProject = computed(() => props.projects[activeIndex.value])
const projectCount = computed(() => props.projects.length)

const setActiveIndex = (index) => {
  if (!projectCount.value) return
  activeIndex.value = (index + projectCount.value) % projectCount.value
}

const showPrevious = () => setActiveIndex(activeIndex.value - 1)
const showNext = () => setActiveIndex(activeIndex.value + 1)
const counterText = computed(() => `${activeIndex.value + 1} / ${projectCount.value}`)
</script>

<template>
  <div
    v-if="carousel && activeProject"
    class="project-click-carousel"
    :class="`project-click-carousel--${cursorSide}`"
    @mousemove="cursorSide = $event.clientX < $event.currentTarget.getBoundingClientRect().left + ($event.currentTarget.offsetWidth / 2) ? 'prev' : 'next'"
  >
    <button class="project-click-carousel__hit project-click-carousel__hit--prev" type="button" aria-label="Previous project" @click="showPrevious" />
    <span class="project-click-carousel__image">
      <img v-if="activeProject.mainImageUrl" :src="activeProject.mainImageUrl" :alt="activeProject.title" />
    </span>
    <button class="project-click-carousel__hit project-click-carousel__hit--next" type="button" aria-label="Next project" @click="showNext" />
    <div class="project-click-carousel__meta">
      <NuxtLink v-if="activeProject.slug" class="project-click-carousel__view" :to="`/work/${activeProject.slug}`">{{ activeProject.title }}</NuxtLink>
      <span class="project-click-carousel__counter">{{ counterText }}</span>
    </div>
  </div>
  <div v-else-if="projects.length" class="project-list">
    <component
      :is="project.slug ? 'NuxtLink' : 'div'"
      v-for="(project, index) in renderedProjects"
      :key="projectKey(project, index)"
      class="project-row"
      :to="project.slug ? `/work/${project.slug}` : undefined"
    >
      <span class="project-row-image">
        <img v-if="project.mainImageUrl" :src="project.mainImageUrl" :alt="project.title" loading="lazy" />
      </span>
    </component>
  </div>
  <div v-else class="empty-state">No projects have been published yet.</div>
</template>
