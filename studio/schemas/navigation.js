import { linkFields } from './fields.js'

export default {
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Primary Navigation',
      description: 'Internal label for this navigation set.'
    },
    {
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      description: 'Add, remove and drag items to control the site menu order.',
      initialValue: [
        { label: 'HOME', linkType: 'internal', internalPath: '/', order: 1 },
        { label: 'WORK', linkType: 'internal', internalPath: '/work', order: 2 },
        { label: 'WAYS TO WORK BETTER*', linkType: 'internal', internalPath: '/ways-to-work-better', order: 3 },
        { label: 'POWERED BY YANA', linkType: 'internal', internalPath: '/powered-by-yana', order: 4 },
        { label: 'WORLD BUILDING', linkType: 'internal', internalPath: '/world-building', order: 5 },
        { label: 'INFO', linkType: 'internal', internalPath: '/info', order: 6 }
      ],
      of: [
        {
          type: 'object',
          name: 'navigationItem',
          title: 'Navigation Item',
          fields: [
            ...linkFields,
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Optional numeric order. Drag order is used when this is blank.'
            }
          ],
          preview: {
            select: {
              title: 'label',
              internalPath: 'internalPath',
              externalUrl: 'externalUrl'
            },
            prepare({ title, internalPath, externalUrl }) {
              return {
                title,
                subtitle: internalPath || externalUrl
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    prepare: () => ({ title: 'Primary Navigation' })
  }
}
