<script setup lang="ts">
  import type { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  const emit = defineEmits(['selectTab'])

  defineProps({
    tabs: {
      type: Array as PropType<any>,
      default: []
    },
    selectedTab: {
      type: Object,
      default: null
    }
  })

  const { t } = useI18n()

  const selectTab = (tab: any) => {
    emit('selectTab', tab)
  }
</script>

<template>
  <div class="tab-bar">
    <div class="tab-bar__wrapper">
      <button
        v-for="tab in tabs"
        @click="selectTab(tab)"
        :key="tab.id"
        :class="['tab-bar__item', { 'tab-bar__item_active': tab.id === selectedTab?.id }]"
      >
        {{ t(tab.name) }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .tab-bar {
    // .tab-bar__wrapper
    &__wrapper {
      display: flex;
      border-bottom: 1px solid #c9c9c9;
    }
    // .tab-bar__item
    &__item {
      padding: 10px 16px;
      color: var(--dark);
      font-size: 16px;
      line-height: 20px;
      font-style: normal;
      font-weight: 500;
      background: #e5e5e5;
      // .tab-bar__item_active
      &_active,
      &:hover {
        background-color: var(--accent);
        color: var(--white);
      }
      &:first-child {
        border-radius: 4px 0 0 0;
      }
      &:last-child {
        border-radius: 0 4px 0 0;
      }
    }
  }
</style>
