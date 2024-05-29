<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MainBox from '../components/MainBox.vue'
  import STabBar from '@/UI/STabBar.vue'
  import STextField from '@/UI/STextField.vue'
  import SDatepicker from '@/UI/SDatepicker'
  import ArticlesHorizontal from '@/components/ArticlesHorizontal.vue'
  import Pagination from '@/components/Pagination.vue'

  import { Tab } from '@/types/base'

  import { GET_PUBLISHED } from '../api'

  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()

  const tabs = ref<Tab[]>([
    { uuid: 'all', title: 'all', count: 0 },
    { uuid: 'TKM', title: 'localeTM', count: 0 },
    { uuid: 'RUS', title: 'localeRU', count: 0 },
    { uuid: 'ENG', title: 'localeEN', count: 0 }
  ])

  const news = ref<any>([])
  const count = ref(0)

  const language = ref('')
  const search = ref('')
  const page = ref(1)
  const pages = ref(1)
  const limit = ref(20)
  const startDate = ref('')
  const endDate = ref('')

  const getPublished = async () => {
    try {
      const { data } = await GET_PUBLISHED({
        params: {
          language: language.value,
          search: search.value,
          limit: limit.value,
          page: page.value - 1,
          startDate: startDate.value,
          endDate: endDate.value
        }
      })

      news.value = data.get_news_publish || []
      count.value = data.count || 0
      tabs.value[0].count = data.count_name_tm + data.count_name_ru + data.count_name_en
      tabs.value[1].count = data.count_name_tm
      tabs.value[2].count = data.count_name_ru
      tabs.value[3].count = data.count_name_en
      pages.value = Math.ceil(data.count / limit.value)
    } catch (error) {
      console.error(error)
    }
  }

  const updatePage = (newPage: number) => {
    page.value = newPage
    goToPath()
  }

  const activeTab = ref(tabs.value[0])
  const selectTab = (tab: Tab) => {
    activeTab.value = tab
    page.value = 1
    language.value = tab.uuid === 'all' ? '' : tab.uuid
    startDate.value = ''
    endDate.value = ''
    goToPath()
  }

  const searchTimeout = ref<ReturnType<typeof setInterval> | null>(null)
  const searching = (text: string = '') => {
    search.value = text
    searchTimeout.value && clearTimeout(searchTimeout.value)

    searchTimeout.value = setTimeout(() => {
      goToPath()
    }, 500)
  }

  const selectStartDate = (date: string = '') => {
    startDate.value = date
    goToPath()
  }
  const selectEndDate = (date: string = '') => {
    endDate.value = date
    goToPath()
  }

  const goToPath = () => {
    router.push({
      path: `/articles/published`,
      query: {
        page: page.value,
        language: language.value,
        search: search.value,
        start_date: startDate.value,
        end_date: endDate.value
      }
    })
    getPublished()
  }

  const openNews = ({ article, index }: any) => {
    index
    router.push(`/articles/article/${article.uuid}`)
  }

  onMounted(() => {
    page.value = Number(route.query.page) || 1
    language.value = route.query.language?.toString() || ''
    search.value = route.query.search?.toString() || ''
    startDate.value = route.query.start_date?.toString() || ''
    endDate.value = route.query.end_date?.toString() || ''
    tabs.value.forEach((tab: Tab) => {
      if (tab.uuid === language.value) {
        activeTab.value = tab
      }
    })
    getPublished()
  })
</script>

<template>
  <main-box>
    <div class="articles">
      <div class="articles__head">
        <div class="articles__title _page-title">{{ t('published') }}</div>
        <div class="articles__controllers">
          <s-text-field
            @update-value="searching"
            :value="search"
            prev-icon="search"
            :placeholder="t('search')"
            small
            width="240px"
          />
          <s-datepicker @select-date="selectStartDate" :value="startDate" width="155px" />
          <s-datepicker @select-date="selectEndDate" :value="endDate" width="155px" />
        </div>
      </div>
      <div class="articles__tabs">
        <s-tab-bar @select-tab="selectTab" :tabs="tabs" :active-tab="activeTab" />
      </div>
      <div class="articles__list">
        <articles-horizontal @open="openNews" :articles="news" />
      </div>
      <div class="articles__pagination">
        <pagination @click-page="updatePage" :page="page" :pages="pages" :limit="limit" :count="count" />
      </div>
    </div>
  </main-box>
</template>

<style scoped lang="scss">
  .articles {
    width: 900px;
    // .articles__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
    }
    // .articles__title
    &__title {
      padding: 10px;
    }
    // .articles__controllers
    &__controllers {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      flex: 1 1;
    }
    // .articles__tabs
    &__tabs {
    }
    // .articles__list
    &__list {
    }
    // .articles__pagination
    &__pagination {
      padding: 30px 0 30px 10px;
    }
  }
</style>
