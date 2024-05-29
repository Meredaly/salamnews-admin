<script setup lang="ts">
  import { onMounted, ref, watch, computed, watchEffect } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import ArticleHead from '@/components/article/ArticleHead.vue'
  import ArticleTextarea from '@/components/article/ArticleTextarea.vue'
  import ArticleVideoUploader from '@/components/article/ArticleVideoUploader.vue'
  import ArticlePlan from '@/components/article/ArticlePlan.vue'
  import ArticleEditStatus from '@/components/ArticleEditStatus.vue'
  import ArticleTabBar from '@/components/article/ArticleTabBar.vue'
  import PopUpConfirm from '@/components/PopUpConfirm.vue'

  import { ARTICLE_STATUS } from '@/utils/constants'
  import type { Menu } from '@/types/base'

  import {
    UPDATE_SHORT,
    UPDATE_SHORT_STATUS,
    GET_SHORT,
    UPLOAD_VIDEO,
    IMAGE_UPLOAD,
    DELETE_SHORT_VIDEO
  } from '../../api/shorts'

  const { t } = useI18n()

  const router = useRouter()
  const route = useRoute()

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
    category_id: [],
    published_date: null,
    pixel: null,
    main_video: {
      author_tm: '',
      author_ru: '',
      author_en: '',
      description_tm: '',
      description_ru: '',
      description_en: '',
      photo: '',
      video_path: '',
      duration: '',
      cutting_error: false,
      cutting_status: false
    }
  })

  const author = ref<any>('')
  const description = ref<any>('')

  const selectedTab = ref(tabs.value[0]) as any
  const lang = computed(() => (selectedTab.value.id === 'tkm' ? 'tm' : selectedTab.value.id === 'rus' ? 'ru' : 'en'))

  const selectTab = (tab: any) => {
    selectedTab.value = tab

    author.value = article.value.main_video[`author_${lang.value}`]

    description.value = article.value.main_video[`description_${lang.value}`]
  }

  const menu = ref<Menu[]>([
    { id: 1, title: 'planningPublication' },
    { id: 2, title: 'deleteVideoShort' }
  ])

  const editorStatus = ref('SAVED')

  const updateShort = async () => {
    try {
      editorStatus.value = 'SAVING'
      await UPDATE_SHORT({ data: article.value })
      editorStatus.value = 'SAVED'
    } catch (error) {
      console.error(error)
      editorStatus.value = 'ERROR'
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
  }

  const selectPlanArticle = ({ date, time }: any) => {
    articleStatus.value.publication_date = `${date} ${time}`
    articleStatus.value.status = ARTICLE_STATUS.PLANNING
    updateStatus()
    closePlanCalendar()
  }

  const showConfirmPopUp = ref(false)

  const openConfirmPopUp = () => {
    showConfirmPopUp.value = true
  }

  const closeConfirmPopUp = () => {
    showConfirmPopUp.value = false
  }

  const confirmDelete = async () => {
    closeConfirmPopUp()
    const status = await deleteShortVideo()
    if (status) {
      router.go(-1)
    }
  }
  const deleteShortVideo = async () => {
    try {
      await DELETE_SHORT_VIDEO({ uuid: article.value.uuid })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const getShort = async () => {
    try {
      const { data } = await GET_SHORT({ uuid: route.params.id })

      article.value = {
        ...data,
        main_video: {
          author_tm: data.main_video.author_tm || '',
          author_ru: data.main_video.author_ru || '',
          author_en: data.main_video.author_en || '',
          description_tm: data.main_video.description_tm || '',
          description_ru: data.main_video.description_ru || '',
          description_en: data.main_video.description_en || '',
          published_date: data.published_date || null,
          photo: data.main_video.photo || '',
          duration: data.main_video?.duration || '',
          video_path: data.main_video?.video_path || '',
          cutting_error: data.main_video?.cutting_error || false,
          cutting_status: data.main_video?.cutting_status || false
        }
      }
      data.main_video?.video_path && (videoProgress.value = 101)

      articleStatus.value = {
        uuid: route.params.id,
        status: data.status,
        publication_date: data.published_date || data.publication_date,
        notification: false
      }

      author.value = article.value.main_video.author_tm

      description.value = article.value.main_video.description_tm
    } catch (error) {
      console.error(error)
    }
  }

  const videoProgress = ref(0)
  const changeVideo = async (file: File) => {
    const onUploadProgress = {
      onUploadProgress: (progressEvent: any) => {
        videoProgress.value = Math.round((progressEvent.loaded * 1000) / progressEvent.total) / 10
      }
    }
    const data = await uploadVideo(file, onUploadProgress)
    videoProgress.value = 101

    if (data.status === 'SUCCESS') {
      article.value.main_video.video_path = data.video_path
      article.value.main_video.duration = data.duration
      article.value.main_video.cutting_error = data.cutting_error
      article.value.main_video.cutting_status = data.cutting_status
    }
  }

  const getVideoStatus = (videoData: any) => {
    if (videoData.cutting_error === false && videoData.cutting_status === false && !videoData.video_path) {
      return 'EMPTY'
    }
    if (videoData.cutting_error === true) {
      return 'ERROR'
    }
    if (videoData.cutting_status === false) {
      return 'DONE'
    }
    return 'CUTTING'
  }

  const uploadVideo = async (file: File, onUploadProgress: any) => {
    try {
      const { data } = await UPLOAD_VIDEO({
        data: {
          video: file
        },
        onUploadProgress
      })
      return {
        status: 'SUCCESS',
        ...data
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'ERROR'
      }
    }
  }

  const selectDate = (date: string) => {
    articleStatus.value.publication_date = date
    article.value.published_date = !!date ? date : null
  }

  const updateStatus = async () => {
    try {
      await UPDATE_SHORT_STATUS({ data: articleStatus.value })
      router.go(-1)
    } catch (error) {
      console.error(error)
    }
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

  const sendToWaitList = () => {
    articleStatus.value.status = ARTICLE_STATUS.WAITING
    updateStatus()
  }

  const changeImage = async (file: File) => {
    const image = await updateImage(file)

    article.value.main_video.photo = image
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

  const articleMainTimeout = ref<any>(null)

  onMounted(async () => {
    await getShort()

    watch(
      () => article.value,
      () => {
        editorStatus.value = 'WRITING'
        clearTimeout(articleMainTimeout.value)
        articleMainTimeout.value = setTimeout(() => {
          updateShort()
        }, 2000)
      },
      { deep: true }
    )

    watchEffect(() => {
      article.value.main_video[`author_${lang.value}`] = author.value
    })

    watchEffect(() => {
      article.value.main_video[`description_${lang.value}`] = description.value
    })
  })
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
              :status="articleStatus.status"
              :publication-date="articleStatus.publication_date"
              :published-date="article.published_date"
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
          <div class="article__main-video">
            <article-video-uploader
              v-model:author="author"
              v-model:description="description"
              @change-poster-file="changeImage"
              @change-video-file="changeVideo"
              :poster="article.main_video.photo"
              :video_path="article.main_video.video_path"
              :progress="videoProgress"
              :status="getVideoStatus(article.main_video)"
              :pixel="article.pixel"
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
    // .article__tab-bar
    &__tab-bar {
      margin-top: 20px;
    }
    // .article__main-video
    &__main-video {
      margin-top: 20px;
      &:deep() {
        .article-video-uploader__presentation {
          width: 300px;
          margin-left: auto;
          margin-right: auto;
        }
        .article-video-uploader-presentation__body {
          &::before {
            padding-top: 178%;
          }
        }
        .article-video-uploader__upload-box {
          width: 620px;
          margin-left: auto;
          margin-right: auto;
        }
        .article-video-uploader__upload-label {
          &::before {
            padding-top: 178%;
          }
        }
      }
    }
  }
</style>
