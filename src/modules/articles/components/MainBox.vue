<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    {
      id: 4,
      icon: 'noteEdit',
      link: '/articles/workplace',
      title: 'workplace',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 5,
      icon: 'gamePad',
      link: '/articles/working-environment',
      title: 'workingEnvironment',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 3,
      icon: 'description',
      link: '/articles/published',
      title: 'published',
      permissions: [USER_STATUS.REDACTOR]
    },
    { id: 2, icon: 'leaderboard', link: '/articles/stats', title: 'stats', permissions: [USER_STATUS.REDACTOR] },
    { id: 1, icon: 'grading', link: '/articles/categories', title: 'categories', permissions: [USER_STATUS.REDACTOR] }
  ])
</script>

<template>
  <main-box :sidebar="sidebar">
    <slot></slot>
  </main-box>
</template>

<style scoped></style>
