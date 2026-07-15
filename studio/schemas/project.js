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
    { name: 'client', title: 'Client', type: 'string' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'order', title: 'Archive Order', type: 'number' },
    { name: 'homeOrder', title: 'Home Order', type: 'number', description: 'Fallback order when the Home Page featured project list is not populated.' },
    { name: 'galleryOrder', title: 'Gallery Order', type: 'number' },
    { name: 'featuredOnHome', title: 'Featured on Home', type: 'boolean', initialValue: false },
    { name: 'isPoweredByYana', title: 'Powered by Yana Project', type: 'boolean', initialValue: false },
    {
      name: 'service',
      title: 'Service / Role',
      type: 'reference',
      to: [{ type: 'categoryService' }]
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'categoryService' }] }]
    },
    {
      name: 'role',
      title: 'Role Attribution',
      type: 'string',
      description: 'Fallback or precise attribution, e.g. Creative direction and movement direction.'
    },
    {
      name: 'roles',
      title: 'Roles / Contributions',
      type: 'array',
      of: [{ type: 'string' }]
    },
    { name: 'shortDescription', title: 'Short Description', type: 'text', rows: 3 },
    { name: 'fullDescription', title: 'Full Description', type: 'text', rows: 8 },
    {
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'credit',
          title: 'Credit',
          fields: [
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'name', title: 'Name', type: 'string' }
          ],
          preview: {
            select: { title: 'name', subtitle: 'role' }
          }
        }
      ]
    },
    imageField('mainImage', 'Main Image'),
    imageField('thumbnail', 'Thumbnail'),
    {
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [imageField('image', 'Image')]
    },
    {
      name: 'contentBlocks',
      title: 'Modular Content Blocks',
      type: 'array',
      description: 'Build flexible project pages without code changes.',
      of: [{ type: 'projectContentBlock' }]
    },
    {
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
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
