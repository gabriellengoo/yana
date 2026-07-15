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
