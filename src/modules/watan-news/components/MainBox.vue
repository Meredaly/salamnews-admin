<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    {
      id: 1,
      icon: 'editorVideo',
      link: '/watan/video',
      title: 'videos',

      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    },
    {
      id: 2,
      icon: 'leaderboard',
      link: '/watan/stats',
      title: 'stats',
      permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER]
    }
  ])
</script>

<template>
  <main-box :sidebar="sidebar">
    <slot></slot>
  </main-box>
</template>

<style scoped></style>
