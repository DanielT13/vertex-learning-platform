import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
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
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or Bunny embed URL. Playback stays on-site via provider embed.',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .custom((url) => {
            if (!url) return true
            try {
              const host = new URL(url).hostname.replace(/^www\./, '')
              const allowed = [
                'youtube.com',
                'youtu.be',
                'youtube-nocookie.com',
                'vimeo.com',
                'player.vimeo.com',
                'bunny.net',
                'mediacdn.net',
                'b-cdn.net',
              ]
              if (allowed.some((d) => host === d || host.endsWith(`.${d}`))) return true
              return 'Video URL must be YouTube, Vimeo, or Bunny'
            } catch {
              return 'Must be a valid URL'
            }
          }),
    }),
    defineField({
      name: 'poster',
      title: 'Poster / Thumbnail',
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
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free preview',
      type: 'boolean',
      description: 'Presentational label only, not access control.',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student count (display)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      description: 'Rich lesson notes. Structured Portable Text, never markdown.',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key points',
      description: 'Shown in the "In this lesson you will" section.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro tip',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'resource',
          title: 'Resource',
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Video', value: 'video'},
                  {title: 'Article', value: 'article'},
                  {title: 'Repo', value: 'repo'},
                  {title: 'Docs', value: 'docs'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'type'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'poster'},
  },
})
