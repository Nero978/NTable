import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import currentCouseList from '@/courses/AY2526/T1/index.json'

export const useSettingsStore = defineStore('settings', () => {
  const slectedCourseList = ref<string[]>(currentCouseList.map((course) => course.code))

  const selectedCourseData = computed(() => {
    return currentCouseList.filter((course) => slectedCourseList.value.includes(course.code))
  })

  function initeSelectedCourseList() {
    const storedCourseList = localStorage.getItem('selectedCourseList')
    if (storedCourseList) {
      slectedCourseList.value = JSON.parse(storedCourseList)
    }
  }

  function updateSelectedCourseList(newList: string[]) {
    slectedCourseList.value = newList
  }

  watch(
    slectedCourseList,
    (newValue) => {
      localStorage.setItem('selectedCourseList', JSON.stringify(newValue))
    },
    { deep: true, immediate: true },
  )

  initeSelectedCourseList()

  return {
    slectedCourseList,
    selectedCourseData,
    updateSelectedCourseList,
  }
})
