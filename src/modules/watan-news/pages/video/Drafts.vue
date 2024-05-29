<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import TabHead from '../../components/TabHead.vue'
  import VideoReport from '../../components/VideoReport.vue'
  import Pagination from '@/components/Pagination.vue'
  import PopUpDrafts from '@/components/PopUpDrafts.vue'
  import MainBox from '../../components/MainBox.vue'
  import SButton from '@/UI/SButton.vue'

  import { TabRoutes } from '../../types'

  import { ADD_DRAFT, GET_WATAN_NEWS } from '../../api/videoReport'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/watan/video/drafts',
    published: '/watan/video/published',
    planned: '/watan/video/planned'
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

      router.push(`/watan/video/edit/${data.uuid}`)

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

  const watanNews = ref<any>([])

  const getWatanNews = async () => {
    try {
      const { data } = await GET_WATAN_NEWS({
        params: {
          limit: limit.value,
          page: page.value - 1,
          status: 'EMPTY'
        }
      })

      count.value = data.count || 0
      pages.value = Math.ceil(data.count / limit.value)
      watanNews.value = data.get_news_status
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
      path: `/watan/video/drafts`,
      query: { page: page.value }
    })
    getWatanNews()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    await getWatanNews()
  })
</script>

<template>
  <main-box>
    <div class="video-reports">
      <div class="video-reports__head">
        <tab-head :tab-routes="tabRoutes" :title="t('watanNews')">
          <s-button @click="openPopUpDrafts" prev-icon="addCircle" :title="t('addWatanNews')" />
        </tab-head>
      </div>
      <div class="video-reports__wrapper">
        <div v-for="watanNew in watanNews" :key="watanNew" class="video-reports__item">
          <video-report :video-report="watanNew" />
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
      :title="t('addWatanNews')"
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
../../../watan-news/types
