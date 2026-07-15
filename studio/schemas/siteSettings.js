import { imageField, seoFields } from './fields.js'

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'title', title: 'Site Title', type: 'string', initialValue: 'Yana Studios' },
    {
      name: 'wordmark',
      title: 'Header Wordmark',
      type: 'string',
      initialValue: '.YANA',
      description: 'The text logo shown in the fixed header.'
    },
    {
      name: 'primaryBrandColour',
      title: 'Primary Brand Colour',
      type: 'string',
      initialValue: '#002366',
      description: 'Approved Yana Studios deep royal blue. Use a hex value such as #002366.'
    },
    { name: 'description', title: 'Site Description', type: 'text', rows: 3 },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'email'
    },
    {
      name: 'contactDetails',
      title: 'Contact Details',
      type: 'text',
      rows: 4
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' }
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' }
          }
        }
      ]
    },
    {
      name: 'newsletterLink',
      title: 'Newsletter Link',
      type: 'url'
    },
    {
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 3
    },
    {
      name: 'openingAnimation',
      title: 'Opening Animation Settings',
      type: 'object',
      description: 'Edit the word frames and timing for the opening screen.',
      fields: [
        {
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'frames',
          title: 'Frames',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: ['RHYANA', 'RHYAN.', 'R.YAN.', '.YANA']
        },
        {
          name: 'initialDelay',
          title: 'Initial Delay',
          type: 'number',
          description: 'Milliseconds before the first frame change.',
          initialValue: 650
        },
        {
          name: 'frameDuration',
          title: 'Frame Duration',
          type: 'number',
          description: 'Milliseconds between each frame.',
          initialValue: 520
        },
        {
          name: 'totalDuration',
          title: 'Total Duration',
          type: 'number',
          description: 'Milliseconds before the site is shown.',
          initialValue: 3000
        }
      ]
    },
    imageField('heroImage', 'Home Hero Image'),
    ...seoFields
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' })
  }
}
