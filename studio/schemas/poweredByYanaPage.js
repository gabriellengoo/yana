import { linkFields, seoFields } from './fields.js'

export default {
  name: 'poweredByYanaPage',
  title: 'Powered By Yana Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Page Title', type: 'string', initialValue: 'Powered By Yana' },
    {
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      description: 'Top-of-page copy.'
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pageSection',
          title: 'Page Section',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'body', title: 'Body', type: 'text', rows: 5 }
          ],
          preview: {
            select: { title: 'heading', subtitle: 'body' }
          }
        }
      ]
    },
    {
      name: 'selectedProjects',
      title: 'Selected PBY Projects',
      type: 'array',
      description: 'Choose the Powered By Yana projects to show first and drag them into order.',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    },
    {
      name: 'callsToAction',
      title: 'Calls to Action',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'callToAction',
          title: 'Call to Action',
          fields: linkFields,
          preview: {
            select: { title: 'label', internalPath: 'internalPath', externalUrl: 'externalUrl' },
            prepare({ title, internalPath, externalUrl }) {
              return { title, subtitle: internalPath || externalUrl }
            }
          }
        }
      ]
    },
    ...seoFields
  ],
  preview: {
    prepare: () => ({ title: 'Powered By Yana Page' })
  }
}
