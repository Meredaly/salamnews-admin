<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    {
      id: 5,
      icon: 'noteEdit',
      link: '/tenders/workplace',
      title: 'workplace',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 6,
      icon: 'gamePad',
      link: '/tenders/working-environment',
      title: 'workingEnvironment',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 3,
      icon: 'description',
      link: '/tenders/published',
      title: 'published',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 1,
      icon: 'grading',
      link: '/tenders/categories',
      title: 'categories',
      permissions: [USER_STATUS.REDACTOR]
    },
    {
      id: 2,
      icon: 'leaderboard',
      link: '/tenders/stats',
      title: 'stats',
      permissions: [USER_STATUS.REDACTOR]
    }
  ])
</script>

<template>
  <main-box :sidebar="sidebar">
    <slot />
  </main-box>
</template>

<style scoped></style>
