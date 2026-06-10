export default {
  name: 'infoPage',
  title: 'Info Page',
  type: 'document',
  fields: [
    { name: 'bio', title: 'Mini Bio', type: 'text', rows: 6 },
    { name: 'contactEmail', title: 'Contact Email', type: 'email' },
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
    }
  ],
  preview: {
    prepare: () => ({ title: 'Info Page' })
  }
}
