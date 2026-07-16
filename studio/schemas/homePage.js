import { imageField, seoFields } from './fields.js'

export default {
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Yana Studios'
    },
    {
      name: 'introduction',
      title: 'Introduction Statement',
      type: 'text',
      rows: 4,
      description: 'The centered exhibition-style statement shown on the homepage.',
      initialValue: 'Helping people and brands build emotional worlds and create cultural presence. Bringing ideas to life through production, creative operations and thoughtful execution.'
    },
    imageField('heroImage', 'Optional Hero Image'),
    {
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      description: 'Select and drag projects into the exact homepage order.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }]
        }
      ]
    },
    {
      name: 'featuredLabel',
      title: 'Featured Section Label',
      type: 'string',
      initialValue: 'Recent Work'
    },
    ...seoFields
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' })
  }
}
