<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MainBox from '../components/MainBox.vue'
  import STabBar from '@/UI/STabBar.vue'
  import ArticlesHorizontal from '@/components/ArticlesHorizontal.vue'

  import { GET_PINNED_NEWS } from '../api/pinned'
  import { Tab } from '@/types/base'

  const route = useRoute()
  const router = useRouter()

  const { t } = useI18n()

  const tabs = ref<Tab[]>([
    { uuid: 'TKM', title: 'localeTM' },
    { uuid: 'RUS', title: 'localeRU' },
    { uuid: 'ENG', title: 'localeEN' }
  ])

  const activeTab = computed((): Tab => {
    const findTab = tabs.value.find((tab: Tab): boolean => route.fullPath?.includes(tab.uuid))

    return findTab || tabs.value[0]
  })

  const selectedTab = ref<any>(null)
  const selectTab = (tab: Tab) => {
    selectedTab.value = tab.uuid

    if (route) {
      goToPath(selectedTab.value)
    }
  }

  const pinnedNews = ref<any>([])

  const getPinnedNews = async (): Promise<void> => {
    try {
      const { data } = await GET_PINNED_NEWS({ params: { language: selectedTab.value || 'TKM' } })
      pinnedNews.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  const goToPath = (currentLang: any) => {
    router.push({
      path: '/news/pinned',
      query: {
        language: currentLang
      }
    })
    getPinnedNews()
  }

  const openNews = ({ article, index }: any) => {
    index
    router.push(`/news/article/${article.uuid}`)
  }

  onMounted(() => {
    selectedTab.value = route.query.language || 'TKM'
    getPinnedNews()
  })
</script>

<template>
  <main-box>
    <div class="pinned">
      <div class="pinned__head">
        <div class="pinned__title _page-title">{{ t('pinned') }}</div>
      </div>
      <div class="pinned__tabs">
        <s-tab-bar @select-tab="selectTab" :tabs="tabs" :activeTab="activeTab" />
      </div>
      <div class="pinned__articles">
        <div class="pinned__article">
          <articles-horizontal @open="openNews" :articles="pinnedNews" />
        </div>
      </div>
    </div>
  </main-box>
</template>

<style scoped lang="scss">
  .pinned {
    width: 900px;
    // .pinned__head
    &__head {
      padding: 15px;
    }
    // .pinned__langs
    &__langs {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    // .pinned__title
    &__title {
    }
    // .pinned__articles
    &__articles {
      padding-top: 20px;
      padding-left: 10px;
    }
    // .pinned__article
    &__article {
    }
  }
</style>
