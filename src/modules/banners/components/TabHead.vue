<script setup lang="ts">
  import { PropType, computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import STabBar from '@/UI/STabBar.vue'

  import { Tab } from '@/types/base'
  import { TabRoutes } from '../types'

  const emit = defineEmits(['selectTab'])

  const props = defineProps({
    tabRoutes: {
      type: Object as PropType<TabRoutes>,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  })

  const route = useRoute()
  const router = useRouter()

  const tabs = ref<Tab[]>([
    { uuid: 'bannerVIP', title: 'bannerVip' },
    { uuid: 'bannerA', title: 'bannerA' },
    { uuid: 'bannerB', title: 'bannerB' },
    { uuid: 'bannerC', title: 'bannerC' },
    { uuid: 'bannerD', title: 'bannerD' },
    { uuid: 'bannerE', title: 'bannerE' },
    { uuid: 'bannerF', title: 'bannerF' },
    { uuid: 'advertising', title: 'advertising' }
  ])

  const activeTab = computed((): Tab => {
    const findTab = tabs.value.find((tab: Tab): boolean => route.fullPath.includes(tab.uuid))
    return findTab || tabs.value[0]
  })

  const selectTab = (tab: Tab) => {
    const route = props.tabRoutes[tab.uuid]
    if (route) {
      router.push(route)
      emit('selectTab', tab)
    }
  }
</script>

<template>
  <div class="workplace-head">
    <div class="workplace-head__top">
      <div class="workplace-head__title _page-title">{{ title }}</div>
      <div class="workplace-head__slot">
        <slot></slot>
      </div>
    </div>
    <div class="workplace-head__tabs">
      <s-tab-bar @select-tab="selectTab" :tabs="tabs" :activeTab="activeTab" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .workplace-head {
    // .workplace-head__top
    &__top {
      padding: 5px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    // .workplace-head__title
    &__title {
      padding: 10px;
    }
    // .workplace-head__slot
    &__slot {
    }
    // .workplace-head__tabs
    &__tabs {
    }
  }
</style>
