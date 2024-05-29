<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import TabHead from '../../components/TabHead.vue'
  import VideoShort from '../../components/VideoShort.vue'
  import Pagination from '@/components/Pagination.vue'
  import STextField from '@/UI/STextField.vue'
  import SDatepicker from '@/UI/SDatepicker'
  import MainBox from '../../components/MainBox.vue'

  import { TabRoutes } from '../../types'

  import { GET_SHORTS } from '../../api/shorts'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/media/shorts/drafts',
    published: '/media/shorts/published',
    planned: '/media/shorts/planned'
  }

  const count = ref(0)
  const search = ref('')
  const page = ref(1)
  const pages = ref(1)
  const limit = ref(20)
  const startDate = ref('')
  const endDate = ref('')

  const shorts = ref<any>([])

  const getShorts = async () => {
    try {
      const { data } = await GET_SHORTS({
        params: {
          search: search.value,
          limit: limit.value,
          page: page.value - 1,
          startDate: startDate.value,
          endDate: endDate.value,
          status: 'PLANNING'
        }
      })

      shorts.value = data.get_news_status

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
      path: `/media/shorts/published`,
      query: {
        page: page.value,
        search: search.value,
        start_date: startDate.value,
        end_date: endDate.value
      }
    })
    getShorts()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    search.value = route.query.search?.toString() || ''
    startDate.value = route.query.start_date?.toString() || ''
    endDate.value = route.query.end_date?.toString() || ''
    await getShorts()
  })
</script>

<template>
  <main-box>
    <div class="video-shorts">
      <div class="video-shorts__head">
        <tab-head :tab-routes="tabRoutes" :title="t('videoShorts')">
          <div class="video-shorts__controllers">
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
      <div class="video-shorts__wrapper">
        <div v-for="short in shorts" :key="short" class="video-shorts__item">
          <video-short :video-short="short" />
        </div>
      </div>
      <div class="video-shorts__pagination">
        <pagination @click-page="updatePage" :page="page" :pages="pages" :limit="limit" :count="count" />
      </div>
    </div>
  </main-box>
</template>

<style lang="scss" scoped>
  .video-shorts {
    margin-bottom: 20px;
    // .video-shorts__head
    &__head {
    }
    // .video-shorts__controllers
    &__controllers {
      display: flex;
      gap: 10px;
    }
    // .video-shorts__wrapper
    &__wrapper {
      padding-left: 10px;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 20px;
    }
    // .video-shorts__item
    &__item {
    }
    // .video-shorts__pagination
    &__pagination {
      padding-left: 10px;
      margin-top: 100px;
    }
  }
</style>
