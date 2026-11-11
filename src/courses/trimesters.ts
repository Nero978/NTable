import t1Courses from './AY2627/T1/index.json'
import t2Courses from './AY2627/T2/index.json'
import type { CourseItem } from '@/types/course'

export type TrimesterId = 'T1' | 'T2'

type Trimester = {
  label: string
  calendarPath: string
  start: Date
  end: Date
  courses: CourseItem[]
}

export const trimesters: Record<TrimesterId, Trimester> = {
  T1: {
    label: 'AY2026/27 Trimester 1',
    calendarPath: 'AY2627/T1',
    start: new Date(2026, 7, 1),
    end: new Date(2026, 9, 31),
    courses: t1Courses,
  },
  T2: {
    label: 'AY2026/27 Trimester 2',
    calendarPath: 'AY2627/T2',
    start: new Date(2026, 10, 1),
    end: new Date(2027, 1, 28),
    courses: t2Courses,
  },
}

export function parseCourseDate(value: string, trimesterStart: Date) {
  const [day = 0, month = 0] = value.split('/').map(Number)
  const startYear = trimesterStart.getFullYear()
  const year = month <= trimesterStart.getMonth() ? startYear + 1 : startYear
  return new Date(year, month - 1, day)
}
