import { imageField, seoFields } from './fields.js'

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'title', title: 'Site Title', type: 'string', initialValue: 'Yana Studios' },
    { name: 'description', title: 'Site Description', type: 'text', rows: 3 },
    imageField('heroImage', 'Home Hero Image'),
    ...seoFields
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' })
  }
}
