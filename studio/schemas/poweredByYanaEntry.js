import { imageField } from './fields.js'

export default {
  name: 'poweredByYanaEntry',
  title: 'Powered By Yana Entry',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    },
    { name: 'date', title: 'Date', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 5 },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [imageField('image', 'Image')]
    },
    { name: 'externalLink', title: 'External Link', type: 'url' },
    { name: 'order', title: 'Order', type: 'number' }
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [{ field: 'order', direction: 'asc' }, { field: 'date', direction: 'desc' }]
    }
  ],
  preview: {
    select: { title: 'title', media: 'images.0' }
  }
}
