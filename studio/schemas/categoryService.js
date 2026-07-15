export default {
  name: 'categoryService',
  title: 'Category / Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Editable service name shown across the site.',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    },
    {
      name: 'shortSummary',
      title: 'Short Summary',
      type: 'text',
      rows: 3
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
      rows: 6
    },
    {
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'workingModes',
      title: 'Working Modes',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number'
    }
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}
