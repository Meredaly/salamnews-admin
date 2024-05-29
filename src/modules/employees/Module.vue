<script setup lang="ts">
  import { ref } from 'vue'
  import MainBox from '@/components/MainBox.vue'
  import { USER_STATUS } from '@/utils/constants'

  const sidebar = ref([
    { id: 1, icon: 'users', link: '/employees/list', title: 'employeesList', permissions: [USER_STATUS.REDACTOR] },
    { id: 1, icon: 'leaderboard', link: '/employees/stats', title: 'stats', permissions: [USER_STATUS.REDACTOR] }
  ])
</script>

<template>
  <main-box :sidebar="sidebar">
    <router-view></router-view>
  </main-box>
</template>

<style scoped></style>
