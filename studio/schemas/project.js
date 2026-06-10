import { imageField, seoFields } from './fields.js'

export default {
  name: 'project',
  title: 'Project',
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
    { name: 'date', title: 'Date', type: 'string', description: 'Use a year, season or exact date.' },
    { name: 'order', title: 'Archive Order', type: 'number' },
    { name: 'featuredOnHome', title: 'Featured on Home', type: 'boolean', initialValue: false },
    {
      name: 'service',
      title: 'Service / Role',
      type: 'reference',
      to: [{ type: 'categoryService' }]
    },
    {
      name: 'role',
      title: 'Role Attribution',
      type: 'string',
      description: 'Fallback or precise attribution, e.g. Creative direction and movement direction.'
    },
    { name: 'shortDescription', title: 'Short Description', type: 'text', rows: 3 },
    { name: 'fullDescription', title: 'Full Description', type: 'text', rows: 8 },
    imageField('mainImage', 'Main Image'),
    {
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [imageField('image', 'Image')]
    },
    { name: 'videoUrl', title: 'Video URL / Embed URL', type: 'url' },
    { name: 'externalLink', title: 'External Link', type: 'url' },
    ...seoFields
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [{ field: 'order', direction: 'asc' }, { field: 'date', direction: 'desc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'role',
      media: 'mainImage'
    }
  }
}
