import type {SchemaTypeDefinition} from 'sanity'
import {course} from './course'
import {courseModule} from './module'
import {lesson} from './lesson'
import {instructor} from './instructor'
import {category} from './category'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [course, courseModule, lesson, instructor, category],
}
