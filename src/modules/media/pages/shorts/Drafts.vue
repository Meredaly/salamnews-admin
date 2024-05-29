<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import TabHead from '../../components/TabHead.vue'
  import VideoShort from '../../components/VideoShort.vue'
  import Pagination from '@/components/Pagination.vue'
  import MainBox from '../../components/MainBox.vue'
  import PopUpDrafts from '@/components/PopUpDrafts.vue'
  import SButton from '@/UI/SButton.vue'

  import { TabRoutes } from '../../types'

  import { ADD_DRAFT, GET_SHORTS } from '../../api/shorts'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/media/shorts/drafts',
    published: '/media/shorts/published',
    planned: '/media/shorts/planned'
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

      router.push(`/media/shorts/edit/${data.uuid}`)

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

  const shorts = ref<any>([])

  const getShorts = async () => {
    try {
      const { data } = await GET_SHORTS({
        params: {
          limit: limit.value,
          page: page.value - 1,
          status: 'EMPTY'
        }
      })

      count.value = data.count || 0
      pages.value = Math.ceil(data.count / limit.value)
      shorts.value = data.get_news_status
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
      path: `/media/shorts/drafts`,
      query: {
        page: page.value
      }
    })
    getShorts()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    await getShorts()
  })
</script>

<template>
  <main-box>
    <div class="video-shorts">
      <div class="video-shorts__head">
        <tab-head :tab-routes="tabRoutes" :title="t('videoShorts')">
          <s-button @click="openPopUpDrafts" prev-icon="addCircle" :title="t('addVideoShort')" />
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

  <teleport to="#pop-up">
    <pop-up-drafts
      v-if="showPopUpDrafts"
      @close="closePopUpDrafts"
      @save="addDraft"
      :loading="loadingDraft"
      title="Добавить Видео шорт"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .video-shorts {
    margin-bottom: 20px;
    // .video-shorts__head
    &__head {
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
