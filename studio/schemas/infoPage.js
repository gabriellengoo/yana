export default {
  name: 'infoPage',
  title: 'Info Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Page Title', type: 'string', initialValue: 'Info' },
    { name: 'bio', title: 'About Copy', type: 'text', rows: 6 },
    { name: 'contactEmail', title: 'Contact Email', type: 'email' },
    { name: 'contactDetails', title: 'Contact Details', type: 'text', rows: 4 },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'newsletterLink',
      title: 'Newsletter Link',
      type: 'url'
    },
    {
      name: 'inviteInformation',
      title: 'Invite Information',
      type: 'text',
      rows: 5
    },
    {
      name: 'sections',
      title: 'Additional Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'infoSection',
          title: 'Info Section',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'body', title: 'Body', type: 'text', rows: 5 }
          ],
          preview: {
            select: { title: 'heading', subtitle: 'body' }
          }
        }
      ]
    }
  ],
  preview: {
    prepare: () => ({ title: 'Info Page' })
  }
}
