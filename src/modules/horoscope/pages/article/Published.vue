<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import SDatepicker from '@/UI/SDatepicker'
  import ArticlesHorizontal from '@/components/ArticlesHorizontal.vue'
  import Pagination from '@/components/Pagination.vue'
  import TabHead from '../../components/TabHead.vue'
  import STextField from '@/UI/STextField.vue'
  import MainBox from '../../components/MainBox.vue'

  import { TabRoutes } from '@/types/base'
  import { PhotoReportItem } from '../../types'

  import { GET_HOROSCOPES } from '../../api/horoscope'

  const router = useRouter()
  const route = useRoute()

  const { t, locale } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/horoscope/article/drafts',
    published: '/horoscope/article/published',
    planned: '/horoscope/article/planned'
  }

  const count = ref(0)
  const search = ref('')
  const page = ref(1)
  const pages = ref(1)
  const limit = ref(20)
  const startDate = ref('')
  const endDate = ref('')

  const horoscopes = ref<PhotoReportItem[]>([])

  const getHoroscopes = async () => {
    try {
      const { data } = await GET_HOROSCOPES({
        params: {
          search: search.value,
          limit: limit.value,
          page: page.value - 1,
          startDate: startDate.value,
          endDate: endDate.value,
          status: 'PUBLISHED'
        }
      })

      count.value = data.count || 0
      pages.value = Math.ceil(data.count / limit.value)
      horoscopes.value = data.get_news_status?.map((horoscope: any) => {
        return {
          uuid: horoscope.uuid,
          main_photo: horoscope.main_photo,
          title: locale.value === 'ru' ? horoscope.title_ru : horoscope.title_tm,
          main_type: 'PHOTO',
          slug_name: horoscope.slug_name,
          published_date: horoscope.published_date,
          publication_date: horoscope.publication_date
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const updatePage = (newPage: number) => {
    page.value = newPage
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
      path: `/horoscope/article/published`,
      query: {
        page: page.value,
        search: search.value,
        start_date: startDate.value,
        end_date: endDate.value
      }
    })
    getHoroscopes()
  }

  const openHoroscope = ({ article }: any): void => {
    router.push(`/horoscope/article/edit/${article.uuid}`)
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    search.value = route.query.search?.toString() || ''
    startDate.value = route.query.start_date?.toString() || ''
    endDate.value = route.query.end_date?.toString() || ''
    await getHoroscopes()
  })
</script>

<template>
  <main-box>
    <div class="horoscope">
      <div class="horoscope__head">
        <tab-head :tab-routes="tabRoutes" :title="t('horoscope')">
          <div class="horoscope__controllers">
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
        </tab-head>
      </div>
      <div class="horoscope__wrapper">
        <articles-horizontal @open="openHoroscope" :articles="horoscopes" />
      </div>
      <div class="horoscope__pagination">
        <pagination @click-page="updatePage" :page="page" :pages="pages" :limit="limit" :count="count" />
      </div>
    </div>
  </main-box>
</template>

<style lang="scss" scoped>
  .horoscope {
    margin-bottom: 20px;
    // .horoscope__head
    &__head {
    }
    // .horoscope__wrapper
    &__wrapper {
      padding-left: 10px;
      margin-top: 20px;
      display: grid;
      grid-gap: 20px;
    }

    // .horoscope__controllers
    &__controllers {
      display: flex;
      gap: 10px;
    }
    // .horoscope__item
    &__item {
      border-bottom: 1px solid #e0e0e0;
    }
    // .horoscope__pagination
    &__pagination {
      padding-left: 10px;
      margin-top: 100px;
    }
  }
</style>
