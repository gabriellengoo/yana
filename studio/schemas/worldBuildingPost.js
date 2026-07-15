import { imageField, seoFields } from './fields.js'

export default {
  name: 'worldBuildingPost',
  title: 'World Building Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    },
    { name: 'date', title: 'Date', type: 'date' },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 },
    imageField('coverMedia', 'Cover Media'),
    {
      name: 'body',
      title: 'Modular Body Content',
      type: 'array',
      of: [{ type: 'projectContentBlock' }]
    },
    {
      name: 'externalNewsletterLink',
      title: 'External Newsletter Link',
      type: 'url'
    },
    ...seoFields
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'coverMedia' }
  }
}
