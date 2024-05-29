<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import TabHead from '../../components/TabHead.vue'
  import VideoReport from '../../components/VideoReport.vue'
  import Pagination from '@/components/Pagination.vue'
  import STextField from '@/UI/STextField.vue'
  import SDatepicker from '@/UI/SDatepicker'
  import MainBox from '../../components/MainBox.vue'

  import { TabRoutes } from '../../types'

  import { GET_VIDEO_REPORTS } from '../../api/videoReport'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/media/video-report/drafts',
    published: '/media/video-report/published',
    planned: '/media/video-report/planned'
  }

  const count = ref(0)
  const search = ref('')
  const page = ref(1)
  const pages = ref(1)
  const limit = ref(20)
  const startDate = ref('')
  const endDate = ref('')

  const videoReports = ref<any>([])

  const getVideoReports = async () => {
    try {
      const { data } = await GET_VIDEO_REPORTS({
        params: {
          search: search.value,
          limit: limit.value,
          page: page.value - 1,
          startDate: startDate.value,
          endDate: endDate.value,
          status: 'PUBLISHED'
        }
      })

      videoReports.value = data.get_news_status
      count.value = data.count || 0
      pages.value = Math.ceil(data.count / limit.value)
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
      path: `/media/video-report/published`,
      query: {
        page: page.value,
        search: search.value,
        start_date: startDate.value,
        end_date: endDate.value
      }
    })
    getVideoReports()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    search.value = route.query.search?.toString() || ''
    startDate.value = route.query.start_date?.toString() || ''
    endDate.value = route.query.end_date?.toString() || ''
    await getVideoReports()
  })
</script>

<template>
  <main-box>
    <div class="video-reports">
      <div class="video-reports__head">
        <tab-head :tab-routes="tabRoutes" :title="t('videoReports')">
          <div class="video-reports__controllers">
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
      <div class="video-reports__wrapper">
        <div v-for="videoReport in videoReports" :key="videoReport" class="video-reports__item">
          <video-report :video-report="videoReport" />
        </div>
      </div>
      <div class="video-reports__pagination">
        <pagination @click-page="updatePage" :page="page" :pages="pages" :limit="limit" :count="count" />
      </div>
    </div>
  </main-box>
</template>

<style lang="scss" scoped>
  .video-reports {
    margin-bottom: 20px;
    // .video-reports__head
    &__head {
    }
    // .video-reports__controllers
    &__controllers {
      display: flex;
      gap: 10px;
    }
    // .video-reports__wrapper
    &__wrapper {
      padding-left: 10px;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 20px;
    }
    // .video-reports__item
    &__item {
    }
    // .video-reports__pagination
    &__pagination {
      padding-left: 10px;
      margin-top: 100px;
    }
  }
</style>
