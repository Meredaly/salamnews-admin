<script setup lang="ts">
  import { ref, watch, onMounted, watchEffect, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import ArticleHead from '@/components/article/ArticleHead.vue'
  import ArticleTextarea from '@/components/article/ArticleTextarea.vue'
  import ArticleInfo from '@/components/article/ArticleInfo.vue'
  import ArticleTabBar from '@/components/article/ArticleTabBar.vue'
  import ArticleSliderUploader from '@/components/article/ArticleSliderUploader.vue'
  import ArticlePlan from '@/components/article/ArticlePlan.vue'
  import ArticleEditStatus from '@/components/ArticleEditStatus.vue'
  import PopUpConfirm from '@/components/PopUpConfirm.vue'

  import { ARTICLE_STATUS } from '@/utils/constants'
  import type { InformationList, Menu } from '@/types/base'
  import { getDateTime, joinName } from '@/utils/helpers'

  import {
    UPDATE_PHOTO_REPORT,
    GET_PHOTO_REPORT,
    UPDATE_PHOTO_REPORT_STATUS,
    DELETE_PHOTO_REPORT,
    IMAGE_UPLOAD
  } from '../../api/photoReport'

  const route = useRoute()
  const router = useRouter()

  const { t } = useI18n()

  const articleStatus = ref({
    uuid: route.params.id,
    status: 'EMPTY',
    publication_date: '',
    notification: false
  })

  const tabs = ref([
    { id: 'tkm', name: 'localeTM' },
    { id: 'rus', name: 'localeRU' },
    { id: 'eng', name: 'localeEN' }
  ]) as any

  const article = ref<any>({
    uuid: '',
    title_tm: '',
    title_ru: '',
    title_en: '',
    description_tm: '',
    description_ru: '',
    description_en: '',
    tag_tm: '',
    tag_ru: '',
    tag_en: '',
    author_name_tm: 'SalamNews',
    author_name_ru: 'SalamNews',
    author_name_en: 'SalamNews',
    published_date: null,
    main_photo: {
      author_tm: '',
      author_ru: '',
      author_en: '',
      description_tm: '',
      description_ru: '',
      description_en: '',
      photo: [] as string[]
    }
  })

  const selectedTab = ref(tabs.value[0]) as any
  const lang = computed(() => (selectedTab.value.id === 'tkm' ? 'tm' : selectedTab.value.id === 'rus' ? 'ru' : 'en'))

  const selectTab = (tab: any) => {
    selectedTab.value = tab

    author.value = article.value.main_photo[`author_${lang.value}`]

    description.value = article.value.main_photo[`description_${lang.value}`]
  }

  const editorStatus = ref('SAVED')

  const menu = ref<Menu[]>([
    { id: 1, title: 'planningPublication' },
    { id: 2, title: 'deletePhotoreport' }
  ])

  const author = ref<any>('')
  const description = ref<any>('')

  const articleInfo = ref<InformationList[]>([])

  const updatePhotoReport = async () => {
    try {
      editorStatus.value = 'WRITING'
      await UPDATE_PHOTO_REPORT({ data: article.value })

      editorStatus.value = 'SAVED'
    } catch (error) {
      console.error(error)
      editorStatus.value = 'ERROR'
    }
  }

  const getPhotoReport = async () => {
    try {
      const { data } = await GET_PHOTO_REPORT({ uuid: route.params.id })
      article.value = {
        ...data,
        main_photo: {
          author_tm: data.main_photo.author_tm || '',
          author_ru: data.main_photo.author_ru || '',
          author_en: data.main_photo.author_en || '',
          description_tm: data.main_photo.description_tm || '',
          description_ru: data.main_photo.description_ru || '',
          description_en: data.main_photo.description_en || '',
          published_date: data.published_date || null,
          photo: data.main_photo.photo || []
        }
      }

      articleStatus.value = {
        uuid: route.params.id,
        status: data.status,
        publication_date: data.publication_date || data.published_date,
        notification: false
      }

      const creatorInfo = [
        { key: 'creator', value: joinName(data.creator) },
        { key: 'createdDate', value: getDateTime(data.created_at) }
      ]
      articleInfo.value = [creatorInfo]

      author.value = article.value.main_photo.author_tm

      description.value = article.value.main_photo.description_tm
    } catch (error) {
      console.error(error)
    }
  }

  const updateStatus = async () => {
    try {
      await UPDATE_PHOTO_REPORT_STATUS({ data: articleStatus.value })
      router.go(-1)
    } catch (error) {
      console.error(error)
    }
  }

  const selectDate = (date: string) => {
    articleStatus.value.publication_date = date
    article.value.published_date = !!date ? date : null
  }

  const publishArticle = () => {
    articleStatus.value.status = ARTICLE_STATUS.PUBLISHED

    updateStatus()
  }

  const cancelPublishArticle = () => {
    articleStatus.value.status = ARTICLE_STATUS.EMPTY

    updateStatus()
  }

  const toggleNotification = () => {
    articleStatus.value.notification = !articleStatus.value.notification
  }

  const changeMainPhoto = async (files: FileList) => {
    for (let index = 0; index < files.length; index++) {
      const image = await updateImage(files[index])

      article.value.main_photo.photo.push(image)
    }
  }

  const updateImage = async (file: File): Promise<string> => {
    try {
      const { data } = await IMAGE_UPLOAD({ data: { image: file } })
      return data.image_path_original.toString()
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  const showPlanCalendar = ref(false)
  const openPlanCalendar = () => {
    showPlanCalendar.value = true
  }
  const closePlanCalendar = () => {
    showPlanCalendar.value = false
  }

  const cancelPlanArticle = () => {
    articleStatus.value.status = ARTICLE_STATUS.EMPTY

    updateStatus()
  }
  const sendToWaitList = () => {
    articleStatus.value.status = ARTICLE_STATUS.WAITING
    updateStatus()
  }

  const selectPlanArticle = ({ date, time }: any) => {
    articleStatus.value.status = ARTICLE_STATUS.PLANNING
    articleStatus.value.publication_date = `${date} ${time}`
    updateStatus()
    closePlanCalendar()
  }

  const articleMainTimeout = ref<any>(null)

  onMounted(async () => {
    await getPhotoReport()

    watch(
      () => article.value,
      () => {
        editorStatus.value = 'WRITING'
        clearTimeout(articleMainTimeout.value)
        articleMainTimeout.value = setTimeout(() => {
          updatePhotoReport()
        }, 2000)
      },
      { deep: true }
    )

    watchEffect(() => {
      article.value.main_photo[`author_${lang.value}`] = author.value
    })

    watchEffect(() => {
      article.value.main_photo[`description_${lang.value}`] = description.value
    })
  })

  const selectItem = (item: any) => {
    switch (item.id) {
      case 0:
        cancelPublishArticle()
        break
      case 1:
        openPlanCalendar()
        break
      case 2:
        openConfirmPopUp()
        break
    }
  }

  const showConfirmPopUp = ref(false)

  const closeConfirmPopUp = () => {
    showConfirmPopUp.value = false
  }

  const confirmDelete = async () => {
    try {
      await DELETE_PHOTO_REPORT({ uuid: route.params.id })
      router.go(-1)
    } catch (error) {
      console.error(error)
    }
  }

  const openConfirmPopUp = () => {
    showConfirmPopUp.value = true
  }

  const deleteImage = (idx: any) => {
    article.value.main_photo.photo.splice(idx, 1)
  }
</script>

<template>
  <div v-if="article.uuid" class="article">
    <div class="article__container">
      <div class="article__wrapper">
        <div class="article__note">
          <article-edit-status :editor-status="editorStatus" />
        </div>
        <div class="article__body">
          <div class="article__head">
            <article-head
              @cancel-plan="cancelPlanArticle"
              @send-to-wait-list="sendToWaitList"
              @publish="publishArticle"
              @cancel-publication="cancelPublishArticle"
              @select-item="selectItem"
              @select-date="selectDate"
              @toggle-notification="toggleNotification"
              :menu="menu"
              :publication-date="articleStatus.publication_date"
              :published-date="article.published_date"
              :status="articleStatus.status"
              :notification="articleStatus.notification"
            />
          </div>
          <div class="article__tab-bar">
            <article-tab-bar @select-tab="selectTab" :tabs="tabs" :selected-tab="selectedTab" />
          </div>
          <div class="article__title">
            <article-textarea
              v-if="selectedTab.id === 'tkm'"
              v-model.trim="article.title_tm"
              :placeholder="t('heading')"
              size="BIG"
            />
            <article-textarea
              v-else-if="selectedTab.id === 'rus'"
              v-model.trim="article.title_ru"
              :placeholder="t('heading')"
              size="BIG"
            />
            <article-textarea v-else v-model.trim="article.title_en" :placeholder="t('heading')" size="BIG" />
          </div>
          <div class="article__description">
            <article-textarea
              v-if="selectedTab.id === 'tkm'"
              v-model.trim="article.description_tm"
              :placeholder="t('description')"
              size="LARGE"
            />
            <article-textarea
              v-else-if="selectedTab.id === 'rus'"
              v-model.trim="article.description_ru"
              :placeholder="t('description')"
              size="LARGE"
            />
            <article-textarea
              v-else
              v-model.trim="article.description_en"
              :placeholder="t('description')"
              size="LARGE"
            />
          </div>
          <div class="article__tag">
            <article-textarea
              v-if="selectedTab.id === 'tkm'"
              v-model.trim="article.tag_tm"
              :placeholder="t('tags')"
              size="LARGE"
            />
            <article-textarea
              v-else-if="selectedTab.id === 'rus'"
              v-model.trim="article.tag_ru"
              :placeholder="t('tags')"
              size="LARGE"
            />
            <article-textarea v-else v-model.trim="article.tag_en" :placeholder="t('tags')" size="LARGE" />
          </div>
          <div class="article__author-name">
            <article-textarea
              v-if="selectedTab.id === 'tkm'"
              v-model.trim="article.author_name_tm"
              :placeholder="t('authorsName')"
              size="LARGE"
            />
            <article-textarea
              v-else-if="selectedTab.id === 'rus'"
              v-model.trim="article.author_name_ru"
              :placeholder="t('authorsName')"
              size="LARGE"
            />
            <article-textarea
              v-else
              v-model.trim="article.author_name_en"
              :placeholder="t('authorsName')"
              size="LARGE"
            />
          </div>
          <div class="article__info-pin">
            <div class="article__info">
              <article-info :info="articleInfo" />
            </div>
          </div>

          <div class="article__slider">
            <article-slider-uploader
              v-model:author="author"
              v-model:description="description"
              @change-file="changeMainPhoto"
              @delete-image="deleteImage"
              :photos="article.main_photo.photo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <article-plan v-if="showPlanCalendar" @cancel="closePlanCalendar" @save="selectPlanArticle" />

  <teleport to="#pop-up">
    <pop-up-confirm
      v-if="showConfirmPopUp"
      @no="closeConfirmPopUp"
      @yes="confirmDelete"
      :title="t('doYouReallyWant')"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .article {
    // .article__container
    &__container {
    }
    // .article__wrapper
    &__wrapper {
      display: flex;
      height: 100%;
    }

    // .article__status-box
    &__status-box {
      width: 250px;
      position: sticky;
      top: 118px;
      padding-top: 20px;
      padding-right: 10px;
    }

    // .article__note
    &__note {
      width: 250px;
      border-right: 1px solid #d7d7d7;
    }
    // .article__note-fixer
    &__note-fixer {
      position: sticky;
      top: 172px;
      padding-top: 10px;
      padding-right: 10px;
    }
    // .article__body
    &__body {
      min-height: calc(100vh - 118px);
      margin-left: 50px;
      padding-top: 5px;
      width: 800px;
      padding-bottom: 500px;
    }
    // .article__head
    &__head {
    }
    // .article__title
    &__title {
      margin-top: 23px;
    }
    // .article__description
    &__description {
      margin-top: 10px;
    }
    // .article__tag
    &__tag {
      margin-top: 10px;
    }
    // .article__author-name
    &__author-name {
      margin-top: 10px;
    }
    // .article__info-pin
    &__info-pin {
      margin-top: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // .article__info
    &__info {
    }
    // .article__pin
    &__pin {
    }
    // .article__categories
    &__categories {
      margin-top: 20px;
    }
    // .article__tab-bar
    &__tab-bar {
      margin-top: 20px;
    }
    // .article__slider
    &__slider {
      margin-top: -1px;
    }
    // .article__main-video
    &__main-video {
      margin-top: -1px;
    }
  }
</style>
