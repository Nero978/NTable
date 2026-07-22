<template>
  <t-config-provider :global-config="enConfig">
    <RouterView />
  </t-config-provider>
</template>

<script lang="ts" setup>
import enConfig from 'tdesign-mobile-vue/es/locale/en_US'
</script>
