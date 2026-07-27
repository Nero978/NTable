<template>
  <t-navbar :fixed="true" left-arrow title="Calendar Sync" @left-click="$router.back()" />
  <div class="page-container">
    <div class="step-box">
      <t-steps v-model:current="currentStep">
        <t-step-item v-for="(_, index) in stepList" :key="index" :title="`Step ${index + 1}`" />
      </t-steps>
    </div>
    <div class="step-details">
      <t-result
        :title="stepList[currentStep]?.title"
        :description="stepList[currentStep]?.describe"
        class="result-box"
      >
        <template #image>
          <template v-if="currentStep === 0">
            <course-icon
              :fill-color="['transparent', 'transparent']"
              :stroke-color="['var(--td-brand-color)', 'var(--td-error-color)']"
              :stroke-width="2"
              size="96"
            />
          </template>
          <template v-else-if="currentStep === 1">
            <calendar-edit-icon
              :fill-color="['transparent', 'transparent']"
              :stroke-color="['var(--td-brand-color)', 'var(--td-error-color)']"
              :stroke-width="2"
              size="96"
            />
          </template>
          <template v-else-if="currentStep === 2">
            <task-checked-1-icon
              :fill-color="['transparent', 'transparent']"
              :stroke-color="['var(--td-brand-color)', 'var(--td-error-color)']"
              :stroke-width="2"
              size="96"
            />
          </template>
        </template>
      </t-result>

      <div v-if="currentStep !== stepList.length - 1" class="course-view">
        <t-cell-group v-if="currentStep === 0" theme="card">
          <t-cell
            title="Update Couese Config"
            arrow
            hover
            @click="$router.push('/settings/course-config')"
          />
        </t-cell-group>

        <t-cell-group theme="card">
          <t-cell
            v-for="(course, index) in settingsStore.selectedCourseData"
            :key="index"
            :title="course.code"
            :description="course.title"
          >
            <template #rightIcon>
              <t-space v-if="currentStep === 1" class="action-btn">
                <t-button theme="primary" @click="subscribeLink(course.code)" size="small">
                  <template v-if="doneCourses.includes(course.code)" #icon>
                    <t-icon name="check" />
                  </template>
                  {{ doneCourses.includes(course.code) ? 'Done' : 'Subscribe' }}
                </t-button>

                <t-button theme="default" @click="copyLink(course.code)" size="small">
                  <template v-if="doneCourses.includes(course.code)" #icon>
                    <t-icon name="check" />
                  </template>
                  {{ doneCourses.includes(course.code) ? 'Done' : 'Copy Link' }}
                </t-button>
              </t-space>
            </template>
          </t-cell>
        </t-cell-group>
      </div>
    </div>

    <div class="btn-group">
      <t-button v-if="currentStep > 0" theme="default" @click="currentStep--" block>
        Previous
      </t-button>
      <t-button
        v-if="currentStep < stepList.length - 1"
        theme="primary"
        @click="currentStep++"
        block
      >
        Next
      </t-button>
      <t-button
        v-if="currentStep === stepList.length - 1"
        theme="primary"
        @click="$router.back()"
        block
      >
        Done
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { CourseIcon, CalendarEditIcon, TaskChecked1Icon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-mobile-vue'

const settingsStore = useSettingsStore()

const currentStep = ref(0)
const stepList = [
  {
    title: 'Confirm Course Config',
    describe:
      'Your course config is as follows, if it is incorrect, you should update it first before proceeding.',
  },
  {
    title: 'Subscribe to Calendar',
    describe:
      'Simply click the button below to subscribe to your course calendar. Or copy the link as the subscription link in your calendar app.',
  },
  {
    title: 'Success',
    describe: 'You have successfully subscribed to your course calendar.',
  },
]
const doneCourses = ref<string[]>([])

function _buildLink(courseCode: string) {
  return `https://ntable.nero978.top/ics/AY2627/T1/${courseCode}.ics`
}

function _markedCourseDone(courseCode: string) {
  if (!doneCourses.value.includes(courseCode)) {
    doneCourses.value.push(courseCode)
  } else {
    doneCourses.value = doneCourses.value.filter((code) => code !== courseCode)
  }
}

function subscribeLink(courseCode: string) {
  const link = _buildLink(courseCode).replace('https://', 'webcal://')
  window.open(link, '_blank')
  _markedCourseDone(courseCode)
}

function copyLink(courseCode: string) {
  const link = _buildLink(courseCode)
  navigator.clipboard.writeText(link).then(() => {
    MessagePlugin.success('Link copied to clipboard')
    _markedCourseDone(courseCode)
  })
}
</script>

<style scoped>
.page-container {
  padding-top: 3rem;
  padding-bottom: 4.5rem;
  box-sizing: border-box;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--td-bg-color-page);
}

.step-box {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-details {
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-box {
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.course-view {
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-view .action-btn {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.page-container .btn-group {
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  box-sizing: border-box;
  background-color: var(--td-bg-color-container);
}
</style>
