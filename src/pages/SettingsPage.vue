<template>
  <t-navbar :fixed="true" left-arrow title="Settings" @left-click="$router.back()" />
  <div class="page-container">
    <div class="info-section">
      <div class="icon-box">
        <t-icon name="calendar-1" size="48" />
      </div>
      <h3>NTable</h3>
      <p>Unofficial course calendar for NTU students</p>
    </div>

    <t-cell-group theme="card">
      <t-cell
        title="Selected Courses Config"
        arrow
        hover
        @click="$router.push('/settings/course-config')"
      >
        <template #left-icon>
          <t-icon name="course" />
        </template>
      </t-cell>
      <t-cell
        title="Sync to My Phone"
        arrow
        hover
        @click="MessagePlugin.info({ content: 'This feature is developing~', offset: [60, 16] })"
      >
        <template #left-icon>
          <t-icon name="mobile" />
        </template>
      </t-cell>
      <t-cell
        title="Report Issues"
        arrow
        hover
        @click="openLink('https:github.com/Nero978/NTable/issues')"
      >
        <template #left-icon>
          <t-icon name="bug-report" />
        </template>
      </t-cell>
      <t-cell title="Contact" arrow hover @click="openLink('mailto:ZIHAO032@e.ntu.edu.sg')">
        <template #left-icon>
          <t-icon name="mail" />
        </template>
      </t-cell>
    </t-cell-group>

    <div class="footer">
      <p>Copyright © 2026 Chris Liu. All rights reserved.</p>
      <p>All data is stored locally on your device.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-mobile-vue'

function openLink(url: string) {
  window.open(url, '_blank')
}
</script>

<style scoped>
.page-container {
  padding-top: 3rem;
  min-height: 100dvh;
  background-color: var(--td-bg-color-page);
}

.info-section {
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icon-box {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 16px;
  background-color: var(--td-brand-color);
  color: var(--td-text-color-anti);
}

.footer {
  margin-top: 5rem;
  padding: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--td-text-color-placeholder);
}

.footer p {
  margin: 0.2rem 0;
}

.info-section h3 {
  margin: 0;
}

.info-section p {
  margin: 0;
}
</style>
