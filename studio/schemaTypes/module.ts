import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackIcon} from '@sanity/icons'

// Module is an embedded object inside course, not its own document.
// Order in the array is the source of truth for "Module 5" / "Lesson 5.1" labels.
export const courseModule = defineType({
  name: 'courseModule',
  title: 'Module',
  type: 'object',
  icon: StackIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description: 'Ordered references. Lessons must genuinely cover this module topic.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'lesson'}]})],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary'},
  },
})
