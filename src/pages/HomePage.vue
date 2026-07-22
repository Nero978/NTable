<template>
  <div class="home-page">
    <div class="hero">
      <p class="eyebrow">NTU MSBT 2026 Aug Intake</p>
      <h1>Course Calendar</h1>
      <p>All classes for AY2025/26 Trimester 1 are shown in a calendar view below.</p>
    </div>

    <div class="btn-container">
      <t-button theme="primary" block @click="$router.push('/settings')">
        <template #icon>
          <t-icon name="setting-1" />
        </template>
        Settings & info
      </t-button>
    </div>

    <div class="calendar-card">
      <t-calendar
        :value="selectedDates"
        :min-date="new Date('2026-08-01')"
        :max-date="new Date('2026-10-31')"
        type="multiple"
        :readonly="true"
        :use-popup="false"
        switch-mode="month"
        :confirm-btn="null"
        title="Course Dates"
        @panel-change="(data: { month: number }) => (currentShowMonth = data.month)"
      />
    </div>

    <div class="today-card">
      <div class="section-title">
        <h2>Today's Classes</h2>
        <span>{{ Today.weekday }}, {{ Today.month }} {{ Today.day }}</span>
      </div>

      <div v-if="todayCourses.length" class="today-course-list">
        <div
          v-for="course in todayCourses"
          :key="`${course.code}-${course.time}`"
          class="today-course-item"
        >
          <div class="today-course-top">
            <div class="today-course-code">{{ course.code }}</div>
            <div class="today-course-time">{{ course.time }}</div>
          </div>
          <div class="today-course-title">{{ course.title }}</div>
          <div class="today-course-meta">{{ course.venue }}</div>
          <div class="progress-track" :aria-label="course.progressText">
            <div class="progress-bar" :style="{ width: `${course.progress}%` }"></div>
          </div>
          <div class="progress-label">
            <span class="status-pill" :class="course.statusClass">{{ course.progressText }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">No classes scheduled today.</div>
    </div>

    <div class="events-card">
      <div class="section-title">
        <h2>Upcoming Classes</h2>
        <span>{{ courseEvents.length }} classes</span>
      </div>

      <div v-for="event in courseEvents" :key="`${event.code}-${event.dateKey}`" class="event-item">
        <div class="event-date">{{ event.dateLabel }}</div>
        <div class="event-body">
          <div class="event-code">{{ event.code }}</div>
          <div class="event-title">{{ event.title }}</div>
          <div class="event-meta">{{ event.day }} · {{ event.time }} · {{ event.venue }}</div>
        </div>
      </div>
    </div>
  </div>

  <t-dialog
    v-model:visible="isShow"
    :show-overlay="true"
    :close-on-overlay-click="true"
    confirm-btn="OK"
    :cancel-btn="null"
    :title="selectedDateLabel"
    @close="isShow = false"
  >
    <div class="dialog-course-card">
      <div v-if="currentShowCourses.length" class="today-course-list">
        <div
          v-for="course in currentShowCourses"
          :key="`${course.code}-${course.time}`"
          class="today-course-item"
        >
          <div class="today-course-top">
            <div class="today-course-code">{{ course.code }}</div>
            <div class="today-course-time">{{ course.time }}</div>
          </div>
          <div class="today-course-title">{{ course.title }}</div>
          <div class="today-course-meta">{{ course.venue }}</div>
          <div class="progress-track" :aria-label="course.progressText">
            <div class="progress-bar" :style="{ width: `${course.progress}%` }"></div>
          </div>
          <div class="progress-label">
            <span class="status-pill" :class="course.statusClass">{{ course.progressText }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">No classes scheduled on this date.</div>
    </div>
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const courses = computed(() => settingsStore.selectedCourseData)

const parseDate = (value: string) => {
  const [dayValue, monthValue] = value.split('/')
  const day = Number.parseInt(dayValue ?? '0', 10)
  const month = Number.parseInt(monthValue ?? '0', 10)
  const year = new Date().getFullYear()
  return new Date(year, month - 1, day)
}

const selectedDates = computed(() => {
  const dates = courses.value.flatMap((course) =>
    course.schedule.flatMap((entry) => entry.dates.map((value) => parseDate(value))),
  )

  const unique = Array.from(new Set(dates.map((date) => date.toDateString())))
  return unique.map((value) => new Date(value))
})

const Today = {
  month: new Date().toLocaleDateString('en-US', { month: 'long' }),
  day: new Date().getDate(),
  weekday: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
}

function filterCoursesByDate(date: Date) {
  const now = new Date()
  const dateKey = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`

  return courses.value.flatMap((course) =>
    course.schedule.flatMap((entry) => {
      const matchesToday = entry.dates.includes(dateKey)
      if (!matchesToday) {
        return []
      }

      const [startTime, endTime] = entry.time.split('-').map((time) => {
        const [hour, minute] = time.split(':').map((value) => Number.parseInt(value, 10))

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute)
      }) as [Date, Date]
      console.log(
        `Course: ${course.code}, Time: ${entry.time}, Start: ${startTime}, End: ${endTime}, Now: ${now}`,
      )
      const duration = Math.max(1, endTime.getTime() - startTime.getTime())
      const progress = Math.min(
        100,
        Math.max(0, ((now.getTime() - startTime.getTime()) / duration) * 100),
      )

      let status = 'Upcoming'
      let statusClass = 'status-upcoming'
      if (now.getTime() >= endTime.getTime()) {
        status = 'Ended'
        statusClass = 'status-done'
      } else if (now.getTime() >= startTime.getTime()) {
        status = 'Ongoing'
        statusClass = 'status-active'
      }

      return [
        {
          code: course.code,
          title: course.title,
          time: entry.time,
          venue: entry.venue,
          progress,
          progressText: status,
          statusClass,
        },
      ]
    }),
  )
}

const todayCourses = computed(() => {
  return filterCoursesByDate(new Date())
})

const courseEvents = computed(() => {
  const events = courses.value.flatMap((course) =>
    course.schedule.flatMap((entry) =>
      entry.dates.map((value) => {
        const date = parseDate(value)
        return {
          code: course.code,
          title: course.title,
          day: entry.day,
          time: entry.time,
          venue: entry.venue,
          date,
          dateKey: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
          dateLabel: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
        }
      }),
    ),
  )

  return events.sort((left, right) => left.date.getTime() - right.date.getTime())
})

const isShow = ref(false)
const currentShowYear = ref(2026)
const currentShowMonth = ref(8) // August
const currentShowDay = ref(1)
const currentShowCourses = computed(() => {
  const date = new Date(currentShowYear.value, currentShowMonth.value - 1, currentShowDay.value)
  return filterCoursesByDate(date)
})

const selectedDateLabel = computed(() => {
  const date = new Date(currentShowYear.value, currentShowMonth.value - 1, currentShowDay.value)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const handleCalendarDateClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  const className = target?.getAttribute('class') ?? ''

  if (className.includes('t-calendar__dates-item--selected')) {
    currentShowDay.value = Number(target?.innerText?.trim() || 1)
    isShow.value = true
  }
}

onMounted(() => {
  document.addEventListener('click', handleCalendarDateClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleCalendarDateClick)
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(
    180deg,
    var(--td-brand-color-1) 0%,
    var(--td-bg-color-container) 100%
  );
}

.hero {
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 6px;
  font-size: 24px;
  color: var(--td-text-color-primary);
}

.hero p {
  margin: 0;
  color: var(--td-text-color-secondary);
  line-height: 1.5;
}

.btn-container {
  margin-bottom: 1rem;
}

.calendar-card,
.today-card,
.events-card {
  background: var(--td-bg-color-container);
  border-radius: 16px;
  box-shadow: var(--td-shadow-3);
  padding: 1rem;
}

.calendar-card {
  margin-bottom: 1rem;
}

.calendar-card :deep(.t-calendar) {
  z-index: 0;
}

.today-card {
  margin-bottom: 1rem;
}

.today-course-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.today-course-item {
  padding: 0.75rem;
  border-radius: 12px;
  background: var(--td-brand-color-1);
}

.today-course-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.today-course-code {
  font-size: 12px;
  font-weight: 700;
  color: var(--td-brand-color);
}

.today-course-time {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.today-course-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 0.2rem;
}

.today-course-meta {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  margin-bottom: 0.6rem;
}

.progress-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: var(--td-bg-color-container);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--td-brand-color-3) 0%, var(--td-brand-color) 100%);
}

.progress-label {
  margin-top: 0.4rem;
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-upcoming {
  color: var(--td-warning-color);
  background: var(--td-warning-color-1);
}

.status-active {
  color: var(--td-brand-color);
  background: var(--td-brand-color-1);
}

.status-done {
  color: var(--td-success-color);
  background: var(--td-success-color-1);
}

.empty-state {
  padding: 0.75rem 0 0.25rem;
  color: var(--td-text-color-secondary);
  font-size: 13px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title h2 {
  margin: 0;
  font-size: 1rem;
  color: var(--td-text-color-primary);
}

.section-title span {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.event-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--td-border-level-1-color);
}

.event-item:first-of-type {
  border-top: none;
}

.event-date {
  min-width: 52px;
  font-weight: 700;
  color: var(--td-brand-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.event-body {
  flex: 1;
}

.event-code {
  font-size: 12px;
  font-weight: 700;
  color: var(--td-brand-color);
  margin-bottom: 2px;
}

.event-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 2px;
}

.event-meta {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.dialog-course-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
