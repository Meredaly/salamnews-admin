<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MainBox from '../../components/MainBox.vue'
  import STabBar from '@/UI/STabBar.vue'
  import ArticlesHorizontal from '../../components/ArticlesHorizontal.vue'

  import { Tab, TabRoutes } from '@/types/base'

  import { GET_DRAFTS } from '../../api/workplace'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const tabs = ref<Tab[]>([
    { uuid: 'drafts', title: 'drafts' },
    { uuid: 'published', title: 'published' }
  ])

  const tabRoutes: TabRoutes = {
    drafts: '/tenders/workplace/drafts',
    published: '/tenders/workplace/published'
  }

  const activeTab = computed((): Tab => {
    const findTab = tabs.value.find((tab: Tab): boolean => route.fullPath?.includes(tab.uuid))

    return findTab || tabs.value[0]
  })

  const selectTab = (tab: Tab) => {
    const route = tabRoutes[tab.uuid]
    if (route) {
      router.push(route)
    }
  }

  const drafts = ref<any>([])
  const getDrafts = async () => {
    try {
      const { data } = await GET_DRAFTS()

      drafts.value = data || []
    } catch (error) {
      console.error(error)
    }
  }
  getDrafts()

  const openDraft = ({ article, index }: any) => {
    index
    router.push(`/tenders/article/${article.uuid}`)
  }
</script>

<template>
  <main-box>
    <div class="drafts">
      <div class="drafts__head">
        <div class="drafts__title _page-title">{{ t('workplace') }}</div>
      </div>
      <div class="drafts__tabs">
        <s-tab-bar @select-tab="selectTab" :tabs="tabs" :activeTab="activeTab" />
      </div>
      <div class="drafts__body">
        <articles-horizontal @open="openDraft" :articles="drafts" />
      </div>
    </div>
  </main-box>
</template>

<style lang="scss" scoped>
  .drafts {
    width: 900px;
    // .drafts__head
    &__head {
      padding: 15px 10px;
    }
    // .drafts__title
    &__title {
    }
    // .drafts__tabs
    &__tabs {
    }
    // .drafts__body
    &__body {
      padding-top: 20px;
      padding-left: 10px;
    }
  }
</style>
