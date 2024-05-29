<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    {
      id: 5,
      icon: 'noteEdit',
      link: '/business/workplace',
      title: 'workplace',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 6,
      icon: 'gamePad',
      link: '/business/working-environment',
      title: 'workingEnvironment',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 3,
      icon: 'description',
      link: '/business/published',
      title: 'published',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },

    {
      id: 2,
      icon: 'leaderboard',
      link: '/business/stats',
      title: 'stats',
      permissions: [USER_STATUS.REDACTOR]
    },
    {
      id: 1,
      icon: 'grading',
      link: '/business/categories',
      title: 'categories',
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
