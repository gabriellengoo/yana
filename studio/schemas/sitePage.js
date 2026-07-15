import { seoFields } from './fields.js'

export default {
  name: 'sitePage',
  title: 'Site Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'path',
      title: 'Page Path',
      type: 'string',
      description: 'Route path for this page, for example /work, /gallery or /video.',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 4
    },
    ...seoFields
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'path'
    }
  }
}
