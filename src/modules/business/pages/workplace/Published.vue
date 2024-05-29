<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import STabBar from '@/UI/STabBar.vue'
  import ArticlesHorizontal from '@/components/ArticlesHorizontal.vue'
  import Pagination from '@/components/Pagination.vue'
  import MainBox from '../../components/MainBox.vue'

  import { Tab, TabRoutes } from '@/types/base'
  import { GET_PUBLISHED } from '../../api/workplace'

  const route = useRoute()
  const router = useRouter()

  const { t } = useI18n()

  const tabs = ref<Tab[]>([
    { uuid: 'drafts', title: 'drafts' },
    { uuid: 'published', title: 'published' }
  ])

  const tabRoutes: TabRoutes = {
    drafts: '/business/workplace/drafts',
    published: '/business/workplace/published'
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

  const page = ref(1)
  const pages = ref(1)
  const limit = ref(20)
  const count = ref(0)

  const publishedNews = ref<any>([])
  const getPublished = async () => {
    try {
      const { data } = await GET_PUBLISHED({
        params: {
          search: '',
          limit: limit.value,
          page: page.value - 1,
          startDate: '',
          endDate: ''
        }
      })
      count.value = data.count || 0
      publishedNews.value = data.get_news_publish || []

      pages.value = Math.ceil(count.value / limit.value)
    } catch (error) {
      console.error(error)
    }
  }

  const updatePage = (newPage: number) => {
    page.value = newPage
    goToPath()
  }

  const openNews = ({ article, index }: any) => {
    index
    router.push(`/business/article/${article.uuid}`)
  }

  const goToPath = () => {
    router.push({
      path: `/business/workplace/published`,
      query: {
        page: page.value
      }
    })
    getPublished()
  }

  onMounted(() => {
    page.value = Number(route.query.page) || 1

    getPublished()
  })
</script>

<template>
  <main-box>
    <div class="published">
      <div class="published__head">
        <div class="published__title _page-title">{{ t('workplace') }}</div>
      </div>
      <div class="published__tabs">
        <s-tab-bar @select-tab="selectTab" :tabs="tabs" :activeTab="activeTab" />
      </div>
      <div class="published__body">
        <articles-horizontal @open="openNews" :articles="publishedNews" />
      </div>
      <div class="published__pagination">
        <pagination @click-page="updatePage" :page="page" :pages="pages" :limit="limit" :count="count" />
      </div>
    </div>
  </main-box>
</template>

<style lang="scss" scoped>
  .published {
    width: 900px;
    // .published__head
    &__head {
      padding: 15px 10px;
    }
    // .published__title
    &__title {
    }
    // .published__tabs
    &__tabs {
    }
    // .published__body
    &__body {
      padding-top: 20px;
      padding-left: 10px;
    }
    // .published__pagination
    &__pagination {
      padding: 30px 0 30px 10px;
    }
  }
</style>
