import type {StructureResolver} from 'sanity/structure'

// Standalone Studio structure: top-level content types only.
// Modules are embedded objects inside courses, not listed here.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('course').title('Courses'),
      S.documentTypeListItem('lesson').title('Lessons'),
      S.documentTypeListItem('instructor').title('Instructors'),
      S.documentTypeListItem('category').title('Categories'),
    ])
