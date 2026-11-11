import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { trimesters, type TrimesterId } from '@/courses/trimesters'

function readCourseList(id: TrimesterId) {
  const key = `selectedCourseList:${trimesters[id].calendarPath}`
  const stored =
    localStorage.getItem(key) ?? (id === 'T1' ? localStorage.getItem('selectedCourseList') : null)
  const codes = trimesters[id].courses.map((course) => course.code)

  if (stored !== null) {
    try {
      const parsed: unknown = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.every((code) => typeof code === 'string')) {
        return codes.filter((code) => parsed.includes(code))
      }
    } catch {
      return codes
    }
  }

  return codes
}

export const useSettingsStore = defineStore('settings', () => {
  const savedTrimester = localStorage.getItem('selectedTrimester')
  const defaultTrimester = new Date() >= trimesters.T2.start ? 'T2' : 'T1'
  const trimesterId = ref<TrimesterId>(
    savedTrimester === 'T1' || savedTrimester === 'T2' ? savedTrimester : defaultTrimester,
  )
  const trimester = computed(() => trimesters[trimesterId.value])
  const selections = ref({ T1: readCourseList('T1'), T2: readCourseList('T2') })

  const selectedCourseList = computed({
    get: () => selections.value[trimesterId.value],
    set: (codes: string[]) => {
      selections.value[trimesterId.value] = codes
    },
  })

  const selectedCourseData = computed(() =>
    trimester.value.courses.filter((course) => selectedCourseList.value.includes(course.code)),
  )

  watch(trimesterId, (id) => localStorage.setItem('selectedTrimester', id))
  for (const id of ['T1', 'T2'] as const) {
    watch(
      () => selections.value[id],
      (codes) => {
        localStorage.setItem(
          `selectedCourseList:${trimesters[id].calendarPath}`,
          JSON.stringify(codes),
        )
      },
      { deep: true },
    )
  }

  return { trimesterId, trimester, selectedCourseList, selectedCourseData }
})
