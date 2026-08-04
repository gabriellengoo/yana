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
    default: 'Ways to Work Better*'
  }
})

const normalizedProjectNames = computed(() => props.projects.map((project) => String(project.title || '').toLowerCase()))
const linkedProjects = computed(() => props.projects.filter((project) => project.slug))
const unlinkedProjects = computed(() => props.projects.filter((project) => !project.slug))
const fallbackProjectNames = computed(() => (props.service.relatedProjectTitles || [])
  .filter((title) => !normalizedProjectNames.value.some((projectTitle) => projectTitle.includes(String(title).toLowerCase())))
  .slice(0, Math.max(0, 2 - props.projects.length)))
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
          <p>*projects related to this service:</p>
          <div class="service-projects">
            <NuxtLink
              v-for="project in linkedProjects"
              :key="project._id || project.slug || project.title"
              class="service-project"
              :to="`/work/${project.slug}`"
            >
              <img v-if="project.mainImageUrl" :src="project.mainImageUrl" :alt="project.title" loading="lazy" />
              <span>{{ project.title }}</span>
            </NuxtLink>
            <article
              v-for="project in unlinkedProjects"
              :key="project._id || project.slug || project.title"
              class="service-project"
            >
              <img v-if="project.mainImageUrl" :src="project.mainImageUrl" :alt="project.title" loading="lazy" />
              <span>{{ project.title }}</span>
            </article>
            <article v-for="title in fallbackProjectNames" :key="title" class="service-project service-project--text">
              <span>{{ title }}</span>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
