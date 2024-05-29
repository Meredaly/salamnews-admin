<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import TabHead from '../../components/TabHead.vue'
  import PhotoReport from '../../components/PhotoReport.vue'
  import MainBox from '../../components/MainBox.vue'
  import Pagination from '@/components/Pagination.vue'
  import PopUpDrafts from '@/components/PopUpDrafts.vue'
  import SButton from '@/UI/SButton.vue'

  import { TabRoutes } from '../../types'

  import { ADD_DRAFT, GET_PHOTO_REPORTS } from '../../api/photoReport'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/media/photo-report/drafts',
    published: '/media/photo-report/published',
    planned: '/media/photo-report/planned'
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

      router.push(`/media/photo-report/element/${data.uuid}`)

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

  const photoReports = ref<any>([])

  const getPhotoReports = async () => {
    try {
      const { data } = await GET_PHOTO_REPORTS({
        params: {
          limit: limit.value,
          page: page.value - 1,
          status: 'PLANNING'
        }
      })

      count.value = data.count || 0
      pages.value = Math.ceil(data.count / limit.value)
      photoReports.value = data.get_news_status
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
      path: `/media/photo-report/drafts`,
      query: { page: page.value }
    })
    getPhotoReports()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    await getPhotoReports()
  })
</script>

<template>
  <main-box>
    <div class="photo-reports">
      <div class="photo-reports__head">
        <tab-head :tab-routes="tabRoutes" :title="t('photoReports')">
          <s-button @click="openPopUpDrafts" prev-icon="addCircle" :title="t('addPhotoReport')" />
        </tab-head>
      </div>
      <div class="photo-reports__wrapper">
        <div v-for="photoReport in photoReports" :key="photoReport" class="photo-reports__item">
          <photo-report :photo-report="photoReport" />
        </div>
      </div>
      <div class="photo-reports__pagination">
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
      :title="t('addPhotoReport')"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .photo-reports {
    margin-bottom: 20px;
    // .photo-reports__head
    &__head {
    }
    // .photo-reports__wrapper
    &__wrapper {
      padding-left: 10px;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 20px;
    }
    // .photo-reports__item
    &__item {
    }
    // .photo-reports__pagination
    &__pagination {
      padding-left: 10px;
      margin-top: 100px;
    }
  }
</style>
