import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const instructor = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return 'Required'
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return 'Slug must be lowercase with hyphens only'
          }
          return true
        }),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text is important for SEO'),
        }),
      ],
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'string',
      description: 'Short headline, e.g. "Next.js & React Performance".',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'expertise', media: 'photo'},
  },
})
