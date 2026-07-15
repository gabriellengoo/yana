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
      description: 'The short statement shown on the homepage hero.'
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
      initialValue: 'Featured Work'
    },
    ...seoFields
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' })
  }
}
