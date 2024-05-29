<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    {
      id: 1,
      icon: 'imageGlobe',
      link: '/banners/banner',
      title: 'banners',
      permissions: [USER_STATUS.REDACTOR]
    },
    {
      id: 2,
      icon: 'leaderboard',
      link: '/banners/stats',
      title: 'stats',
      permissions: [USER_STATUS.REDACTOR]
    }
  ])
</script>

<template>
  <main-box :sidebar="sidebar">
    <slot></slot>
  </main-box>
</template>

<style scoped></style>
