<script setup lang="ts">
  import type { PropType } from 'vue'

  import Sidebar from '@/components/sidebar'

  import { MenuItem } from '@/types/base'

  defineProps({
    sidebar: {
      type: Array as PropType<MenuItem[]>,
      default: () => []
    }
  })
</script>

<template>
  <div class="main-box">
    <div class="main-box__container">
      <div class="main-box__wrapper">
        <div class="main-box__sidebar">
          <div class="main-box__sidebar-fixer">
            <sidebar :menu="sidebar" />
          </div>
        </div>
        <div class="main-box__body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .main-box {
    height: calc(100% - 118px);
    // .main-box__container
    &__container {
      height: 100%;
    }
    // .main-box__wrapper
    &__wrapper {
      display: flex;
      height: 100%;
    }
    // .main-box__sidebar
    &__sidebar {
      width: 250px;
      border-right: 1px solid #d7d7d7;
    }
    // .main-box__sidebar-fixer
    &__sidebar-fixer {
      position: sticky;
      top: 118px;
    }
    // .main-box__body
    &__body {
      flex: 1 1;
      width: 0;
      min-height: calc(100vh - 118px);
    }
  }
</style>
