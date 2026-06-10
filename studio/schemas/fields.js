export const seoFields = [
  {
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string'
  },
  {
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    rows: 3
  },
  {
    name: 'socialImage',
    title: 'Social Image',
    type: 'image',
    options: { hotspot: true }
  }
]

export const imageField = (name, title) => ({
  name,
  title,
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string'
    }
  ]
})
