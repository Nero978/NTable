export type CourseSchedule = {
  day: string
  time: string
  dates: string[]
  venue: string
}

export type CourseItem = {
  code: string
  title: string
  type: string
  instructor: string
  academicUnits: number
  teachingHours: number
  schedule: CourseSchedule[]
  courseAims: string
  intendedLearningOutcomes: string[]
  assessment: Array<{ component: string; weight: string; type: string }>
}
