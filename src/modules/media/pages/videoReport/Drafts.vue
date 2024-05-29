<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import TabHead from '../../components/TabHead.vue'
  import VideoReport from '../../components/VideoReport.vue'
  import Pagination from '@/components/Pagination.vue'
  import MainBox from '../../components/MainBox.vue'
  import PopUpDrafts from '@/components/PopUpDrafts.vue'
  import SButton from '@/UI/SButton.vue'

  import { TabRoutes } from '../../types'

  import { ADD_DRAFT, GET_VIDEO_REPORTS } from '../../api/videoReport'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/media/video-report/drafts',
    published: '/media/video-report/published',
    planned: '/media/video-report/planned'
  }

  const showPopUpDrafts = ref(false)

  const openPopUpDrafts = () => {
    showPopUpDrafts.value = true
  }

  const closePopUpDrafts = () => {
    showPopUpDrafts.value = false
  }

  const loadingDraft = ref(false)
  const addDraft = async (text: string) => {
    try {
      loadingDraft.value = true
      const { data } = await ADD_DRAFT({ data: { name: text } })

      router.push(`/media/video-report/edit/${data.uuid}`)

      closePopUpDrafts()
    } catch (error) {
      console.error(error)
    } finally {
      loadingDraft.value = false
    }
  }

  const count = ref(0)
  const page = ref(1)
  const pages = ref(1)
  const limit = ref(20)

  const videoReports = ref<any>([])

  const getVideoReports = async () => {
    try {
      const { data } = await GET_VIDEO_REPORTS({
        params: {
          limit: limit.value,
          page: page.value - 1,
          status: 'EMPTY'
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

  const goToPath = () => {
    router.push({
      path: `/media/video-report/drafts`,
      query: {
        page: page.value
      }
    })
    getVideoReports()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    await getVideoReports()
  })
</script>

<template>
  <main-box>
    <div class="video-reports">
      <div class="video-reports__head">
        <tab-head :tab-routes="tabRoutes" :title="t('videoReports')">
          <s-button @click="openPopUpDrafts" prev-icon="addCircle" :title="t('videoReport')" />
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

  <teleport to="#pop-up">
    <pop-up-drafts
      v-if="showPopUpDrafts"
      @close="closePopUpDrafts"
      @save="addDraft"
      :loading="loadingDraft"
      :title="t('videoReport')"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .video-reports {
    margin-bottom: 20px;
    // .video-reports__head
    &__head {
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
