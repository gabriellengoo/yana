export const seoFields = [
  {
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    description: 'Title used by search engines and social previews. Leave blank to use the page title.'
  },
  {
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 3,
    description: 'Short summary for search engines and link previews.'
  },
  {
    name: 'socialImage',
    title: 'Social Image',
    type: 'image',
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        description: 'Describe the image for accessibility and social previews.'
      }
    ]
  }
]

export const imageField = (name, title) => ({
  name,
  title,
  type: 'image',
  options: { hotspot: true },
  description: 'Upload media here. Use crop/hotspot to control responsive framing.',
  fields: [
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility.'
    }
  ]
})

export const linkFields = [
  {
    name: 'label',
    title: 'Label',
    type: 'string',
    validation: (Rule) => Rule.required()
  },
  {
    name: 'linkType',
    title: 'Link Type',
    type: 'string',
    options: {
      list: [
        { title: 'Internal path', value: 'internal' },
        { title: 'External URL', value: 'external' }
      ],
      layout: 'radio'
    },
    initialValue: 'internal'
  },
  {
    name: 'internalPath',
    title: 'Internal Path',
    type: 'string',
    description: 'Use a site path such as /work or /powered-by-yana.'
  },
  {
    name: 'externalUrl',
    title: 'External URL',
    type: 'url'
  },
  {
    name: 'openInNewTab',
    title: 'Open in New Tab',
    type: 'boolean',
    initialValue: false
  }
]
