import {defineQuery} from 'next-sanity'

const imageProjection = /* groq */ `
  {
    ...,
    "alt": coalesce(alt, ""),
    asset->{
      _id,
      url,
      metadata { lqip, dimensions { width, height } }
    }
  }
`

export const COURSES_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    price,
    popular,
    studentCount,
    "coverImage": coverImage ${imageProjection},
    "instructor": instructor->{
      _id,
      name,
      "slug": slug.current,
      expertise,
      "photo": photo ${imageProjection}
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]._ref)
  }
`)

export const COURSE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    price,
    popular,
    studentCount,
    "coverImage": coverImage ${imageProjection},
    learningOutcomes[]{ _key, icon, title, description },
    "instructor": instructor->{
      _id,
      name,
      "slug": slug.current,
      expertise,
      "photo": photo ${imageProjection}
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current
    },
    modules[]{
      _key,
      title,
      summary,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        durationSeconds,
        freePreview,
        "poster": poster ${imageProjection}
      }
    }
  }
`)

export const LESSON_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    durationSeconds,
    freePreview,
    studentCount,
    "poster": poster ${imageProjection},
    notes,
    "notesPlain": pt::text(notes),
    keyPoints,
    proTip,
    resources[]{ _key, type, title, description, url },
    "course": *[_type == "course" && references(^._id)][0]{
      _id,
      title,
      "slug": slug.current
    }
  }
`)

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    expertise,
    "photo": photo ${imageProjection},
    bio,
    "courses": *[_type == "course" && instructor._ref == ^._id && defined(slug.current)]{
      _id,
      title,
      "slug": slug.current
    }
  }
`)

export const CATEGORIES_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)]{ "slug": slug.current }
`)

export const LESSON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "lesson" && defined(slug.current)]{ "slug": slug.current }
`)
