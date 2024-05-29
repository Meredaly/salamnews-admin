<script setup lang="ts">
  import { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { Tab } from '@/types/base'

  const emit = defineEmits(['selectTab'])

  defineProps({
    tabs: { type: Array as PropType<Tab[]>, default: () => [] },
    activeTab: { type: Object as PropType<Tab>, default: null }
  })

  const { t } = useI18n()

  const selectTab = (tab: Tab): void => {
    emit('selectTab', tab)
  }
</script>

<template>
  <div class="tab-bar">
    <div class="tab-bar__list">
      <button
        v-for="tab in tabs"
        :class="['tab-bar__item', { _active: activeTab?.uuid === tab.uuid }]"
        @click="selectTab(tab)"
      >
        <p>{{ t(tab.title) }}</p>
        <span v-if="tab.count">{{ tab.count }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .tab-bar {
    border-bottom: 1px solid #e0e0e0;
    padding: 0 10px;
    display: flex;
    // .tab-bar__list
    &__list {
      position: relative;
      margin-bottom: -1px;
      display: flex;
      gap: 10px;
    }
    // .tab-bar__item
    &__item {
      padding: 10px 10px 9px 10px;
      background-color: transparent;
      color: var(--dark);
      border-bottom: 1px solid transparent;
      display: flex;
      align-items: center;
      gap: 10px;
      p {
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
      }
      span {
        display: block;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 16px;
        padding: 2px;
        border-radius: 2px;
        background: #e8e8e8;
      }
      &._active,
      &:hover {
        border-color: var(--accent);
        p {
          color: var(--accent);
        }
        span {
          color: var(--white);
          background-color: var(--accent);
        }
      }
    }
  }
</style>
