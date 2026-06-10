import { imageField } from './fields.js'

export default {
  name: 'galleryEntry',
  title: 'Gallery Entry',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'date', title: 'Date', type: 'string' },
    imageField('image', 'Image'),
    {
      name: 'linkedProject',
      title: 'Linked Project',
      type: 'reference',
      to: [{ type: 'project' }]
    },
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
    select: { title: 'title', subtitle: 'role', media: 'image' }
  }
}
