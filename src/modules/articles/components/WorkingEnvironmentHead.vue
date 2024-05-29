<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import STabBar from '@/UI/STabBar.vue'

  import { Tab, TabRoutes } from '@/types/base'

  const route = useRoute()
  const router = useRouter()

  const { t } = useI18n()

  const tabs = ref<Tab[]>([
    { uuid: 'whiteboard', title: 'news' },
    { uuid: 'wait-list', title: 'waiting' },
    { uuid: 'planned', title: 'plans' }
  ])

  const tabRoutes: TabRoutes = {
    whiteboard: '/articles/working-environment/whiteboard',
    'wait-list': '/articles/working-environment/wait-list',
    planned: '/articles/working-environment/planned'
  }

  const activeTab = computed((): Tab => {
    const findTab = tabs.value.find((tab: Tab): boolean => route.fullPath?.includes(tab.uuid))

    return findTab || tabs.value[0]
  })

  const selectTab = (tab: Tab) => {
    const selectedRoute = tabRoutes[tab.uuid]
    if (selectedRoute) {
      router.push(selectedRoute)
    }
  }
</script>

<template>
  <div class="working-environment-head">
    <div class="working-environment-head__top">
      <div class="working-environment-head__title _page-title">{{ t('workingEnvironment') }}</div>
      <div class="working-environment-head__slot">
        <slot></slot>
      </div>
    </div>
    <div class="working-environment-head__tabs">
      <s-tab-bar @select-tab="selectTab" :tabs="tabs" :activeTab="activeTab" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .working-environment-head {
    // .working-environment-head__top
    &__top {
      padding: 5px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    // .working-environment-head__title
    &__title {
      padding: 10px;
    }
    // .working-environment-head__slot
    &__slot {
    }
    // .working-environment-head__tabs
    &__tabs {
    }
  }
</style>
