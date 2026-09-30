import type {PortableTextBlock} from 'next-sanity'
import type {SanityImageSource} from '@sanity/image-url'

export type SanityImage = SanityImageSource & {
  alt?: string
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

export type InstructorSummary = {
  _id: string
  name: string
  slug: string
  expertise?: string
  photo?: SanityImage
}

export type CategorySummary = {
  _id: string
  title: string
  slug: string
}

export type LessonSummary = {
  _id: string
  title: string
  slug: string
  durationSeconds: number
  freePreview: boolean
  poster?: SanityImage
}

export type CourseModule = {
  _key: string
  title: string
  summary?: string
  lessons: LessonSummary[]
}

export type CourseListItem = {
  _id: string
  title: string
  slug: string
  summary: string
  level: string
  price: number
  popular: boolean
  studentCount?: number
  coverImage: SanityImage
  instructor: InstructorSummary
  category?: CategorySummary
  moduleCount: number
  lessonCount: number
}

export type CourseDetail = Omit<CourseListItem, 'moduleCount' | 'lessonCount'> & {
  learningOutcomes: {icon?: string; title: string; description?: string}[]
  modules: CourseModule[]
}

export type LessonResource = {
  _key: string
  type: string
  title: string
  description?: string
  url?: string
}

export type LessonDetail = {
  _id: string
  title: string
  slug: string
  videoUrl: string
  durationSeconds: number
  freePreview: boolean
  studentCount?: number
  poster?: SanityImage
  notes?: PortableTextBlock[]
  notesPlain?: string
  keyPoints: string[]
  proTip?: string
  resources: LessonResource[]
  course: {
    _id: string
    title: string
    slug: string
  } | null
}

export type InstructorDetail = InstructorSummary & {
  bio?: PortableTextBlock[]
  courses: { _id: string; title: string; slug: string }[]
}
