import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas/index.js'

const singleton = (S, type, title) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(type))

export default defineConfig({
  name: 'rhyana',
  title: 'Yana Studios / Rhyana',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your_project_id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            singleton(S, 'siteSettings', 'Site Settings'),
            singleton(S, 'navigation', 'Navigation'),
            singleton(S, 'homePage', 'Home Page'),
            singleton(S, 'poweredByYanaPage', 'Powered By Yana Page'),
            singleton(S, 'infoPage', 'Info Page'),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => ![
              'siteSettings',
              'navigation',
              'homePage',
              'poweredByYanaPage',
              'infoPage'
            ].includes(item.getId()))
          ])
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes
  }
})
