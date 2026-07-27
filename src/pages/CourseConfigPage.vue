<template>
  <t-navbar :fixed="true" left-arrow title="Selected Courses Config" @left-click="$router.back()" />
  <div class="page-container">
    <t-notice-bar
      visible
      content="Please select the courses you want to display. The data is only stored locally on this device, and not synced to other ones."
    />
    <t-checkbox-group class="checkbox-group" v-model:value="settingsStore.selectedCourseList">
      <div
        v-for="option in courseOptions"
        :key="option.value"
        :class="`card ${settingsStore.selectedCourseList.includes(option.value) ? 'card--active' : ''}`"
      >
        <t-icon
          v-if="settingsStore.selectedCourseList.includes(option.value)"
          :aria-hidden="true"
          class="card__icon"
          name="check"
        />
        <t-checkbox
          :value="option.value"
          borderless
          :content="`${option.type} | ${option.academicUnits} AU | ${option.teacher}`"
          icon="none"
          :label="option.label"
        />
      </div>
    </t-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import currentCouseList from '@/courses/AY2627/T1/index.json'

const settingsStore = useSettingsStore()

const courseOptions = currentCouseList.map((course) => {
  return {
    label: `${course.code} - ${course.title}`,
    teacher: course.instructor,
    type: course.type,
    academicUnits: course.academicUnits,
    value: course.code,
  }
})
</script>

<style scoped>
.page-container {
  padding-top: 3rem;
  min-height: 100dvh;
  background-color: var(--td-bg-color-page);
}

.checkbox-group {
  margin-bottom: 5rem;
}

.card {
  position: relative;
  margin: 16px;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1.5px solid var(--td-border-level-1-color);
}

.card--active {
  border-color: var(--td-brand-color);
}

.card--active::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  border: 14px solid var(--td-brand-color);
  border-bottom-color: transparent;
  border-right-color: transparent;
}

.card__icon {
  color: var(--td-text-color-anti);
  position: absolute;
  left: 1.5px;
  top: 1.5px;
  z-index: 1;
}
</style>
