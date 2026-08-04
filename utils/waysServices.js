export const waysServices = [
  {
    id: 'embedded-producer',
    title: 'Embedded Producer',
    intro: 'Embedded in launches, campaigns and creative operations. I dip in, understand the business, support strategically, then step up massively when execution starts. Perfect for brands shooting campaigns, running launches, pop ups and always-on content.',
    capabilities: [
      'Campaign production',
      'Shoot production',
      'Strategic check ins',
      'Casting',
      'Pop ups',
      'Planning and decks',
      'Launches',
      'Supplier and crew management',
      'Budgeting and timelines',
      'Delivery and post wrap up'
    ],
    deliverables: 'Light ongoing support for continuity, or production mode when a launch, shoot, collection drop or pop up needs heavier execution.',
    relatedProjectTitles: ['ASICS x Office', 'Burberry']
  },
  {
    id: 'campaign-production',
    title: 'Seasonal / Campaign Producer',
    menuLabel: 'Campaign Production',
    intro: 'End to end production for shoots, launches and branded campaigns. You call me during high intensity seasons, from fashion week to Christmas or summer campaigns, when a brand needs extra production weight for a defined period.',
    capabilities: [
      'Production schedules',
      'Crew sourcing',
      'Weekly planning',
      'Casting',
      'Locations',
      'Call sheets',
      'Shoot logistics',
      'Timelines',
      'Budget tracking',
      'Supplier management',
      'On-set producing',
      'Problem solving',
      'Wrap and follow-up'
    ],
    deliverables: 'Bring me in for launches, campaigns, shoot production periods and heavier planning. During quieter periods I can still jump on decks, casting or give remote nudges.',
    relatedProjectTitles: ['Sharrkini', 'Matte Brand', 'NewWave - Designer Gaze', 'Designer Gaze']
  },
  {
    id: 'creative-operations',
    title: 'Creative Operations',
    intro: 'Team and events support across a rolling period. This is seamless integration for mid-larger brands, or an everyday producer for agencies and teams handling consistent creative volume.',
    capabilities: [
      'Production schedules',
      'Crew sourcing',
      'Weekly planning',
      'Casting',
      'Locations',
      'Call sheets',
      'Shoot logistics',
      'Timelines',
      'Budget tracking',
      'Supplier management',
      'On-set producing',
      'Problem solving',
      'Wrap and follow-up'
    ],
    deliverables: 'Overall support across launches, campaigns, shoot production periods and heavier planning, with remote deck, casting and planning support when the work is quieter.',
    relatedProjectTitles: ['ASICS x Office', 'Burberry', 'Holmes', 'B-Fixed The Exhibition']
  },
  {
    id: 'creative-direction',
    title: 'Creative Direction (World Building)',
    menuLabel: 'Creative Direction',
    intro: 'A curated body of work showing my visual thinking. Ideal for brands, artists and campaigns that need a clear creative concept and someone to ensure every visual decision supports it.',
    capabilities: [
      'Creative concept development',
      'Mood boarding and visual research',
      'Creative treatment / deck creation',
      'Narrative and campaign storytelling',
      'Art direction guidance',
      'Casting input',
      'Location and prop recommendations',
      'Styling collaboration',
      'Creative team recommendations',
      'Shot list collaboration',
      'Creative oversight throughout production',
      'Feedback during post-production where required'
    ],
    deliverables: 'Deliverables are tailored to each project but may include creative treatments, mood boards, visual references, shot lists and on-set creative direction.',
    relatedProjectTitles: ['Lanei', 'Laneige x Say Now']
  },
  {
    id: 'movement-direction-intimacy-coordination',
    title: 'Movement Direction / Intimacy Coordination',
    intro: 'A specialist service - my gymnastics and ballet background gives my work physical intelligence. Ideal for campaigns, editorials and productions requiring movement-led storytelling or scenes involving physical intimacy, ensuring performers and talent feel confident, comfortable and creatively supported.',
    capabilities: [
      'Movement consultation',
      'Choreography / movement direction',
      'Blocking and staging',
      'Character physicality',
      'Performer coaching',
      'Intimacy planning',
      'Consent-based choreography',
      'Risk assessment collaboration',
      'Closed set guidance where required',
      'Director collaboration',
      'Creative rehearsal',
      'On-set movement support'
    ],
    deliverables: 'Deliverables are tailored to each project but may include creative treatments, mood boards, visual references, shot lists and on-set movement direction or intimacy coordination.',
    relatedProjectTitles: ['Fola X Ayra Starrr - Treat You Right', 'Designer Gaze', 'Laneige x Say Now']
  }
]

export const serviceBody = (service) => [
  service?.intro,
  ...(service?.capabilities || []),
  service?.deliverables,
  service?.relatedProjectTitles?.length ? `Projects: ${service.relatedProjectTitles.join(', ')}.` : ''
].filter(Boolean).join('\n')

const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const compact = (value = '') => normalize(value).replace(/\s+/g, '')

export const serviceMatchesProject = (service, project) => {
  if (!service || !project) return false
  const serviceTitles = [
    service.title,
    service.menuLabel,
    ...service.title.split('/').map((item) => item.trim()),
    service.title.replace(/\s*\(.+\)\s*/g, '').trim()
  ].map(normalize).filter(Boolean)
  const projectFields = [
    project.title,
    project.service,
    ...(project.services || []),
    project.role,
    ...(project.roles || [])
  ].map(normalize).filter(Boolean)

  return projectFields.some((field) => serviceTitles.some((title) => field.includes(title) || title.includes(field)))
}

export const relatedProjectsForService = (service, projects = [], limit = 2, excludeSlug = '') => {
  if (!service) return []
  const wantedTitles = (service.relatedProjectTitles || []).map(normalize)
  const compactWantedTitles = (service.relatedProjectTitles || []).map(compact)
  const scoredProjects = projects
    .filter((project) => project?.slug !== excludeSlug)
    .map((project) => {
      const title = normalize(project.title)
      const compactTitle = compact(project.title)
      const titleScore = wantedTitles.findIndex((item, index) => {
        const compactItem = compactWantedTitles[index]
        return item && (title.includes(item) || item.includes(title) || compactTitle.includes(compactItem) || compactItem.includes(compactTitle))
      })
      const serviceScore = serviceMatchesProject(service, project) ? 100 : 0
      const score = titleScore >= 0 ? 200 - titleScore : serviceScore
      return { project, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return scoredProjects.slice(0, limit).map((item) => item.project)
}

export const serviceForProject = (project) => {
  if (!project) return null
  const projectTitle = normalize(project.title)
  const compactProjectTitle = compact(project.title)

  const scoredServices = waysServices.map((service) => {
    const relatedIndex = (service.relatedProjectTitles || []).findIndex((title) => {
      const normalizedTitle = normalize(title)
      const compactTitle = compact(title)
      return projectTitle.includes(normalizedTitle) || normalizedTitle.includes(projectTitle) || compactProjectTitle.includes(compactTitle) || compactTitle.includes(compactProjectTitle)
    })
    if (relatedIndex >= 0) return { service, score: 300 - relatedIndex }
    if (serviceMatchesProject(service, project)) return { service, score: 100 }
    return { service, score: 0 }
  }).filter((item) => item.score > 0)

  return scoredServices.sort((a, b) => b.score - a.score)[0]?.service || null
}
