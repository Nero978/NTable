import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import currentCouseList from '@/courses/AY2526/T1/index.json'

export const useSettingsStore = defineStore('settings', () => {
  const selectedCourseList = ref<string[]>(currentCouseList.map((course) => course.code))

  const selectedCourseData = computed(() => {
    return currentCouseList.filter((course) => selectedCourseList.value.includes(course.code))
  })

  function initSelectedCourseList() {
    const storedCourseList = localStorage.getItem('selectedCourseList')
    if (storedCourseList) {
      selectedCourseList.value = JSON.parse(storedCourseList)
    }
  }

  function updateSelectedCourseList(newList: string[]) {
    selectedCourseList.value = newList
  }

  initSelectedCourseList()

  watch(
    selectedCourseList,
    (newValue) => {
      console.log('Selected course list updated:', newValue)
      localStorage.setItem('selectedCourseList', JSON.stringify(newValue))
    },
    { deep: true },
  )

  return {
    selectedCourseList,
    selectedCourseData,
    updateSelectedCourseList,
  }
})
