import { imageField, linkFields } from './fields.js'

export default {
  name: 'projectContentBlock',
  title: 'Project Content Block',
  type: 'object',
  fields: [
    {
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      description: 'Choose the editorial layout for this block.',
      options: {
        list: [
          { title: 'Full-width image', value: 'fullWidthImage' },
          { title: 'Full-width video', value: 'fullWidthVideo' },
          { title: 'Image with caption', value: 'imageWithCaption' },
          { title: 'Two-column media', value: 'twoColumnMedia' },
          { title: 'Three-image row', value: 'threeImageRow' },
          { title: 'Portrait / landscape pairing', value: 'portraitLandscapePairing' },
          { title: 'Text section', value: 'textSection' },
          { title: 'Credits section', value: 'creditsSection' },
          { title: 'Image gallery', value: 'imageGallery' },
          { title: 'Embedded media', value: 'embeddedMedia' },
          { title: 'Behind-the-scenes section', value: 'behindTheScenes' },
          { title: 'Pull quote', value: 'pullQuote' },
          { title: 'External link', value: 'externalLink' }
        ]
      },
      validation: (Rule) => Rule.required()
    },
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'body', title: 'Body Text', type: 'text', rows: 6 },
    { name: 'caption', title: 'Caption', type: 'text', rows: 2 },
    imageField('image', 'Image'),
    imageField('secondaryImage', 'Secondary Image'),
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [imageField('image', 'Image')]
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Use a direct video URL or embed URL.'
    },
    {
      name: 'embedUrl',
      title: 'Embed URL',
      type: 'url'
    },
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
    {
      name: 'link',
      title: 'External Link',
      type: 'object',
      fields: linkFields,
      preview: {
        select: { title: 'label', internalPath: 'internalPath', externalUrl: 'externalUrl' },
        prepare({ title, internalPath, externalUrl }) {
          return { title, subtitle: internalPath || externalUrl }
        }
      }
    }
  ],
  preview: {
    select: {
      blockType: 'blockType',
      heading: 'heading',
      media: 'image'
    },
    prepare({ blockType, heading, media }) {
      const labels = {
        fullWidthImage: 'Full-width image',
        fullWidthVideo: 'Full-width video',
        imageWithCaption: 'Image with caption',
        twoColumnMedia: 'Two-column media',
        threeImageRow: 'Three-image row',
        portraitLandscapePairing: 'Portrait / landscape pairing',
        textSection: 'Text section',
        creditsSection: 'Credits section',
        imageGallery: 'Image gallery',
        embeddedMedia: 'Embedded media',
        behindTheScenes: 'Behind-the-scenes section',
        pullQuote: 'Pull quote',
        externalLink: 'External link'
      }
      return {
        title: labels[blockType] || 'Content block',
        subtitle: heading,
        media
      }
    }
  }
}
