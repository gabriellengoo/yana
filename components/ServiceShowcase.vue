<script setup>
const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  projects: {
    type: Array,
    default: () => []
  },
  kicker: {
    type: String,
    default: 'Ways to Work Better'
  },
  excludeTitle: {
    type: String,
    default: ''
  }
})

const compactTitle = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '')
const excludedTitle = computed(() => compactTitle(props.excludeTitle))
const normalizedProjectNames = computed(() => [
  ...props.projects.map((project) => String(project.title || '')),
  props.excludeTitle
].map(compactTitle).filter(Boolean))
const linkedProjects = computed(() => props.projects.filter((project) => project.slug))
const unlinkedProjects = computed(() => props.projects.filter((project) => !project.slug))
const fallbackProjectNames = computed(() => (props.service.relatedProjectTitles || [])
  .filter((title) => {
    const compact = compactTitle(title)
    if (!compact || compact === excludedTitle.value) return false
    return !normalizedProjectNames.value.some((projectTitle) => projectTitle.includes(compact) || compact.includes(projectTitle))
  })
  .slice(0, Math.max(0, 2 - props.projects.length)))
const projectSubtext = (project) => [
  project.shortDescription,
  project.role || project.roles?.[0],
  project.service || project.services?.[0],
  project.year || project.date
].filter(Boolean)[0] || props.service.title
</script>

<template>
  <section class="service-showcase">
    <div class="service-showcase__header">
      <p class="service-showcase__kicker">{{ kicker }}</p>
      <h2>{{ service.title }}</h2>
      <p>{{ service.intro }}</p>
    </div>

    <div class="service-showcase__content">
      <ul class="service-showcase__capabilities">
        <li v-for="capability in service.capabilities" :key="capability">{{ capability }}</li>
      </ul>

      <div class="service-showcase__side">
        <p>{{ service.deliverables }}</p>
        <div v-if="projects.length || fallbackProjectNames.length" class="service-showcase__related">
          <p>Projects related to this service:</p>
          <div class="service-projects">
            <NuxtLink
              v-for="project in linkedProjects"
              :key="project._id || project.slug || project.title"
              class="service-project"
              :to="`/work/${project.slug}`"
            >
              <span class="service-project__title">{{ project.title }}</span>
              <span class="service-project__subtext">{{ projectSubtext(project) }}</span>
            </NuxtLink>
            <article
              v-for="project in unlinkedProjects"
              :key="project._id || project.slug || project.title"
              class="service-project"
            >
              <span class="service-project__title">{{ project.title }}</span>
              <span class="service-project__subtext">{{ projectSubtext(project) }}</span>
            </article>
            <article v-for="title in fallbackProjectNames" :key="title" class="service-project service-project--text">
              <span class="service-project__title">{{ title }}</span>
              <span class="service-project__subtext">{{ service.title }}</span>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
