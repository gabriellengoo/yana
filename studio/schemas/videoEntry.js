import { imageField } from './fields.js'

export default {
  name: 'videoEntry',
  title: 'Video Entry',
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
    imageField('thumbnail', 'Thumbnail'),
    { name: 'videoUrl', title: 'Embed URL or Video URL', type: 'url', validation: (Rule) => Rule.required() },
    { name: 'description', title: 'Description', type: 'text', rows: 4 },
    {
      name: 'service',
      title: 'Role / Service',
      type: 'reference',
      to: [{ type: 'categoryService' }]
    },
    { name: 'role', title: 'Role Attribution', type: 'string' },
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
    select: { title: 'title', subtitle: 'role', media: 'thumbnail' }
  }
}
