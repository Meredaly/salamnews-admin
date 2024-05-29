<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    {
      id: 5,
      icon: 'noteEdit',
      link: '/poster/workplace',
      title: 'workplace',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 6,
      icon: 'gamePad',
      link: '/poster/working-environment',
      title: 'workingEnvironment',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 3,
      icon: 'description',
      link: '/poster/published',
      title: 'published',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 2,
      icon: 'leaderboard',
      link: '/poster/stats',
      title: 'stats',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 1,
      icon: 'grading',
      link: '/poster/categories',
      title: 'categories',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    }
  ])
</script>

<template>
  <main-box :sidebar="sidebar">
    <slot />
  </main-box>
</template>

<style scoped></style>
