<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    {
      id: 2,
      icon: 'camera',
      link: '/media/photo-report',
      title: 'photoReports',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 3,
      icon: 'editorVideo',
      link: '/media/video-report',
      title: 'videoReports',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 4,
      icon: 'videoClip',
      link: '/media/shorts',
      title: 'videoShorts',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 5,
      icon: 'leaderboard',
      link: '/media/stats',
      title: 'stats',
      permissions: [USER_STATUS.REDACTOR]
    },
    {
      id: 1,
      icon: 'grading',
      link: '/media/categories',
      title: 'videoCategories',
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
