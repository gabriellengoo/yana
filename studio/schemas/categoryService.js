export default {
  name: 'categoryService',
  title: 'Category / Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: [
          'Creative Direction',
          'Production',
          'Movement Direction',
          'World Building',
          'Powered By Yana'
        ]
      },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number'
    }
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}
