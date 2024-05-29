<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import SButton from '@/UI/SButton.vue'
  import ArticlesHorizontal from '@/components/ArticlesHorizontal.vue'
  import TabHead from '../../components/TabHead.vue'
  import Pagination from '@/components/Pagination.vue'
  import PopUpDrafts from '@/components/PopUpDrafts.vue'
  import MainBox from '../../components/MainBox.vue'

  import { TabRoutes } from '../../types'

  import { ADD_DRAFT, GET_HOROSCOPES } from '../../api/horoscope'

  const router = useRouter()
  const route = useRoute()

  const { t, locale } = useI18n()

  const tabRoutes: TabRoutes = {
    drafts: '/horoscope/article/drafts',
    published: '/horoscope/article/published',
    planned: '/horoscope/article/planned'
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

      router.push(`/horoscope/article/edit/${data.uuid}`)

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

  const horoscopes = ref<any>([])

  const getHoroscope = async () => {
    try {
      const { data } = await GET_HOROSCOPES({
        params: {
          limit: limit.value,
          page: page.value - 1,
          status: 'EMPTY'
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

  const openHoroscope = ({ article }: any): void => {
    router.push(`/horoscope/article/edit/${article.uuid}`)
  }

  const updatePage = (newPage: number) => {
    page.value = newPage
    goToPath()
  }

  const goToPath = () => {
    router.push({
      path: `/horoscope/article/drafts`,
      query: { page: page.value }
    })
    getHoroscope()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    await getHoroscope()
  })
</script>

<template>
  <main-box>
    <div class="horoscope">
      <div class="horoscope__head">
        <tab-head :tab-routes="tabRoutes" :title="t('horoscope')">
          <s-button @click="openPopUpDrafts" prev-icon="addCircle" :title="t('addHoroscope')" />
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

  <teleport to="#pop-up">
    <pop-up-drafts
      v-if="showPopUpDrafts"
      @close="closePopUpDrafts"
      @save="addDraft"
      :loading="loadingDraft"
      :title="t('addHoroscope')"
    />
  </teleport>
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
      grid-gap: 10px;
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
