<template>
  <t-popup
    v-model="visible"
    placement="bottom"
    :destroy-on-close="true"
    :close-on-overlay-click="false"
  >
    <div class="content">
      <t-result
        title="Getting Your Calendar Set Up"
        description="Just select the courses you want to appear."
        class="space"
      >
        <template #image>
          <course-icon
            :fill-color="['transparent', 'transparent']"
            :stroke-color="['#181c62', '#d71440']"
            :stroke-width="2"
            size="96"
          />
        </template>
      </t-result>

      <div class="btn-group">
        <t-button
          size="large"
          theme="primary"
          block
          @click="
            () => {
              $router.push('/settings/course-config')
              visible = false
            }
          "
        >
          Go to Settings
        </t-button>
        <t-button size="large" theme="default" block @click="visible = false">Not Now...</t-button>
      </div>
    </div>
  </t-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CourseIcon } from 'tdesign-icons-vue-next'

const visible = ref(false)

function initPopup() {
  const haveConfigPopup = localStorage.getItem('haveConfigPopup')
  if (haveConfigPopup === null) {
    visible.value = true
  }
}

initPopup()

watch(visible, (newValue) => {
  localStorage.setItem('haveConfigPopup', newValue.toString())
})
</script>

<style scoped>
.content {
  padding: 4rem 2rem;
  box-sizing: border-box;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
