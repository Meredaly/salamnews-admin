<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import SDatepicker from '@/UI/SDatepicker'
  import ArticleNote from '@/components/article/ArticleNote.vue'
  import ArticleHead from '@/components/article/ArticleHead.vue'
  import ArticleTextarea from '@/components/article/ArticleTextarea.vue'
  import ArticleInfo from '@/components/article/ArticleInfo.vue'
  import ArticleCategories from '@/components/article/ArticleCategories.vue'
  import ArticleVideoUploader from '@/components/article/ArticleVideoUploader.vue'
  import ArticleImageUploader from '@/components/article/ArticleImageUploader.vue'
  import ArticlePlan from '@/components/article/ArticlePlan.vue'
  import ArticleEditStatus from '@/components/ArticleEditStatus.vue'
  import Editor from '@/components/article/Editor.vue'
  import EditorTable from '@/components/article/EditorTable.vue'
  import PopUpConfirm from '@/components/PopUpConfirm.vue'

  import { ARTICLE_STATUS } from '@/utils/constants'
  import {
    GET_ARTICLE,
    UPDATE_ARTICLE,
    GET_CONTENT,
    UPDATE_CONTENT,
    UPDATE_STATUS,
    UPLOAD_CONTENT_VIDEO,
    IMAGE_UPLOAD
  } from '../api/article'
  import { GET_CATEGORY } from '../api/category'

  import { getDateTime, joinName } from '@/utils/helpers'
  import type { InformationList, Menu } from '@/types/base'

  const route = useRoute()
  const router = useRouter()

  const { locale, t } = useI18n()

  const editorStatus = ref('SAVED')

  const articleStatus = ref({
    uuid: route.params.article,
    status: 'EMPTY',
    publication_date: '',
    notification: false
  })

  const article = ref<any>({
    uuid: '',
    title: '',
    description: '',
    tag: '',
    author_name: '',
    note: '',
    published_date: null,
    category_id: [],
    start_date: '',
    end_date: ''
  })

  const menu = ref<Menu[]>([
    { id: 0, title: 'returnToCorrection' },
    { id: 1, title: 'planningPublication' }
  ])

  const articleInfo = ref<InformationList[]>([])
  const getArticle = async () => {
    try {
      const { data } = await GET_ARTICLE({ uuid: route.params.article })
      article.value = {
        uuid: data.uuid,
        title: data.title || '',
        description: data.description || '',
        tag: data.tag || '',
        author_name: data.author_name || 'SalamNews',
        note: data.note || '',
        category_id: [],
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        published_date: data.published_date || null
      }
      articleStatus.value = {
        uuid: route.params.article,
        status: data.status,
        publication_date: data.published_date || data.publication_date,
        notification: false
      }

      article.value.category_id =
        data.category?.map((category: any) => {
          selectedCategories.value.push({
            category_id: category.category_id,
            category_slug: category.category_slug,
            name: `${locale.value === 'tm' ? category.name_tm : category.name_ru}`
          })

          return category.category_id
        }) || []

      const gaveInfo = []
      if (data.gave_task && data.gave_task_date) {
        gaveInfo.push({ key: 'gaveTask', value: joinName(data.gave_task) })
        gaveInfo.push({ key: 'gaveTaskDate', value: getDateTime(data.gave_task_date) })
      }

      const creatorInfo = [
        { key: 'creator', value: joinName(data.creator) },
        { key: 'createdDate', value: getDateTime(data.created_at) }
      ]
      articleInfo.value = [creatorInfo, gaveInfo]
    } catch (error) {
      console.error(error)
    }
  }

  const updateStatus = async () => {
    try {
      await UPDATE_STATUS({
        data: articleStatus.value
      })
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
    articleStatus.value.status = ARTICLE_STATUS.WAITING
    updateStatus()
  }

  const returnToCorrectionArticle = () => {
    articleStatus.value.status = ARTICLE_STATUS.WRITING
    updateStatus()
  }

  const updateArticle = async () => {
    try {
      editorStatus.value = 'SAVING'
      await UPDATE_ARTICLE({
        data: {
          ...article.value,
          category_id: article.value.category_id.length ? article.value.category_id : null
        }
      })
      editorStatus.value = 'SAVED'
    } catch (error) {
      console.error(error)
      editorStatus.value = 'ERROR'
    }
  }

  const categories = ref<any>([])
  const getCategories = async () => {
    try {
      const { data } = await GET_CATEGORY()
      categories.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  const selectedCategories = ref<any>([])
  const selectCategory = (category: any) => {
    selectedCategories.value.push({
      category_id: category.category_id,
      category_slug: category.category_slug,
      name: `${locale.value === 'tm' ? category.name_tm : category.name_ru}`
    })

    article.value.category_id = selectedCategories.value.map((category: any) => category.category_slug)
  }

  const deleteCategory = (category: any) => {
    selectedCategories.value = selectedCategories.value.filter(
      (cat: any) => cat.category_slug !== category.category_slug
    )
    article.value.category_id = selectedCategories.value.map((category: any) => category.category_slug)
  }

  const updateImage = async (file: File): Promise<string> => {
    try {
      const { data } = await IMAGE_UPLOAD({
        data: {
          image: file
        }
      })
      return data.image_path_original.toString()
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  const content = ref([
    {
      type: 'TEXT',
      content: '<p></p>',
      order_number: 1
    }
  ]) as any

  const contentDeletable = ref([]) as any

  const getContent = async () => {
    try {
      const { data } = await GET_CONTENT({ uuid: route.params.article })
      if (data.content_dto) {
        normalizeContent(data.content_dto)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const normalizeContent = (content_dto: any) => {
    const newContent = content_dto
      .sort((a: any, b: any) => a.order_number - b.order_number)
      .map((contentItem: any) => {
        contentItem.method = 'UPDATE'
        return contentItem
      })

    if (JSON.stringify(newContent) !== JSON.stringify(content.value)) {
      content.value = newContent
    }
  }

  const updateContent = async (): Promise<any> => {
    try {
      editorStatus.value = 'SAVING'
      const { data } = await UPDATE_CONTENT({
        data: {
          slug_lang_id: route.params.article,
          content_dto: [...content.value, ...contentDeletable.value]
        }
      })
      if (data.content_dto) {
        contentDeletable.value = []
        normalizeContent(data.content_dto)
      }
      editorStatus.value = 'SAVED'
    } catch (error) {
      console.error(error)
      editorStatus.value = 'ERROR'
    }
  }

  const updatePositions = () => {
    for (let position = 1; position <= content.value.length; position++) {
      content.value[position - 1].order_number = position
    }
  }

  const createTable = (index: number) => {
    const [before, after] = content.value[index].content.split('<hr>')

    if (before === '' || before === '<p></p>') {
      contentDeletable.value.push({
        uuid: content.value[index].uuid,
        type: 'TEXT',
        method: 'DELETE'
      })
      content.value[index] = {
        type: 'TABLE',
        content: `<table><tbody><tr><td></td><td></td><td></td></tr></tbody></table>`,
        order_number: 0
      }
      content.value.splice(index + 1, 0, {
        type: 'TEXT',
        content: after || '<p></p>',
        order_number: 0
      })
    } else {
      content.value[index].content = before

      content.value.splice(index + 1, 0, {
        type: 'TABLE',
        content: `<table><tbody><tr><td></td><td></td><td></td></tr></tbody></table>`,
        order_number: 0
      })

      content.value.splice(index + 2, 0, {
        type: 'TEXT',
        content: after || '<p></p>',
        order_number: 0
      })
    }
    updatePositions()
  }

  const selectDeleteTable = (index: number) => {
    openConfirmPopUp('TABLE', index)
  }

  const deleteTable = (index: number) => {
    contentDeletable.value.push({
      uuid: content.value[index].uuid,
      type: 'TABLE',
      method: 'DELETE'
    })
    content.value.splice(index, 1)
    joinContent(index)
    updatePositions()
  }

  const createImage = (index: number) => {
    const [before, after] = content.value[index].content.split('<hr>')

    if (before === '' || before === '<p></p>') {
      contentDeletable.value.push({
        uuid: content.value[index].uuid,
        type: 'TEXT',
        method: 'DELETE'
      })
      content.value[index] = {
        type: 'PHOTO',
        content: {
          author: '',
          description: '',
          photo: ''
        },
        order_number: 0
      }
      content.value.splice(index + 1, 0, {
        type: 'TEXT',
        content: after || '<p></p>',
        order_number: 0
      })
    } else {
      content.value[index].content = before

      content.value.splice(index + 1, 0, {
        type: 'PHOTO',
        content: {
          author: '',
          description: '',
          photo: ''
        },
        order_number: 0
      })

      content.value.splice(index + 2, 0, {
        type: 'TEXT',
        content: after || '<p></p>',
        order_number: 0
      })
    }
    updatePositions()
  }

  const selectDeleteImage = (index: number) => {
    openConfirmPopUp('PHOTO', index)
  }

  const deleteImage = (index: number) => {
    contentDeletable.value.push({
      uuid: content.value[index].uuid,
      type: 'PHOTO',
      method: 'DELETE'
    })
    content.value.splice(index, 1)
    joinContent(index)
    updatePositions()
  }

  const changeContentPhoto = async (index: number, file: File) => {
    const image = await updateImage(file)
    content.value[index].content.photo = image
  }

  const createVideo = (index: number) => {
    const [before, after] = content.value[index].content.split('<hr>')

    if (before === '' || before === '<p></p>') {
      contentDeletable.value.push({
        uuid: content.value[index].uuid,
        type: 'TEXT',
        method: 'DELETE'
      })
      content.value[index] = {
        type: 'VIDEO',
        content: {
          author: '',
          description: '',
          poster: '',
          video_path: '',
          duration: '',
          cutting_error: false,
          cutting_status: false
        },
        order_number: 0
      }
      content.value.splice(index + 1, 0, {
        type: 'TEXT',
        content: after || '<p></p>',
        order_number: 0
      })
    } else {
      content.value[index].content = before

      content.value.splice(index + 1, 0, {
        type: 'VIDEO',
        content: {
          author: '',
          description: '',
          poster: '',
          video_path: '',
          duration: '',
          cutting_error: false,
          cutting_status: false
        },
        order_number: 0
      })
      content.value.splice(index + 2, 0, {
        type: 'TEXT',
        content: after || '<p></p>',
        order_number: 0
      })
    }
    updatePositions()
  }

  const selectDeleteVideo = (index: number) => {
    openConfirmPopUp('VIDEO', index)
  }

  const deleteVideo = (index: number) => {
    contentDeletable.value.push({
      uuid: content.value[index].uuid,
      type: 'VIDEO',
      method: 'DELETE'
    })
    content.value.splice(index, 1)
    joinContent(index)
    updatePositions()
  }

  const changeContentPoster = async (index: number, file: File) => {
    const image = await updateImage(file)
    content.value[index].content.poster = image
  }

  const joinContent = (index: number) => {
    if (content.value[index]?.type === 'TEXT' && content.value[index - 1]?.type === 'TEXT') {
      content.value[index - 1].content += content.value[index].content
      contentDeletable.value.push({
        uuid: content.value[index].uuid,
        type: 'TEXT',
        method: 'DELETE'
      })
      content.value.splice(index, 1)
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

  const contentVideoProgress = ref<any>({})
  const changeContentVideo = async (index: number, file: File) => {
    const onUploadProgress = {
      onUploadProgress: (progressEvent: any) => {
        contentVideoProgress.value[index] = Math.round((progressEvent.loaded * 1000) / progressEvent.total) / 10
      }
    }
    const data = await uploadVideo(file, onUploadProgress)
    contentVideoProgress.value[index] = 101
    if (data.status === 'SUCCESS') {
      content.value[index].content.video_path = data.video_path
      content.value[index].content.duration = data.duration
      content.value[index].content.cutting_error = data.cutting_error
      content.value[index].content.cutting_status = data.cutting_status
    }
  }

  const uploadVideo = async (file: File, onUploadProgress: any) => {
    try {
      const { data } = await UPLOAD_CONTENT_VIDEO({
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

  const showPlanCalendar = ref(false)
  const openPlanCalendar = () => {
    showPlanCalendar.value = true
  }
  const closePlanCalendar = () => {
    showPlanCalendar.value = false
  }

  const cancelPlanArticle = () => {
    articleStatus.value.status = ARTICLE_STATUS.WAITING
    articleStatus.value.publication_date = ''

    updateStatus()
  }
  const sendToWaitList = () => {
    articleStatus.value.status = ARTICLE_STATUS.WAITING
    articleStatus.value.publication_date = ''
    updateStatus()
  }

  const selectPlanArticle = ({ date, time }: any) => {
    articleStatus.value.status = ARTICLE_STATUS.PLANNING
    articleStatus.value.publication_date = `${date} ${time}`
    updateStatus()
    closePlanCalendar()
  }

  const toggleNotification = () => {
    articleStatus.value.notification = !articleStatus.value.notification
  }

  const showConfirmPopUp = ref(false)
  const selectedConfirm = ref({
    type: '',
    index: 0
  })
  const openConfirmPopUp = (type: string, index: number) => {
    selectedConfirm.value = {
      type,
      index
    }
    showConfirmPopUp.value = true
  }
  const closeConfirmPopUp = () => {
    showConfirmPopUp.value = false
  }

  const confirmDelete = async () => {
    switch (selectedConfirm.value.type) {
      case 'TABLE':
        deleteTable(selectedConfirm.value.index)
        break
      case 'PHOTO':
        deleteImage(selectedConfirm.value.index)
        break
      case 'VIDEO':
        deleteVideo(selectedConfirm.value.index)
    }
    closeConfirmPopUp()
  }

  const selectItem = (item: any) => {
    switch (item.id) {
      case 0:
        returnToCorrectionArticle()
        break
      case 1:
        openPlanCalendar()
        break
    }
  }

  const articleMainTimeout = ref<any>(null)
  const contentTimeout = ref<any>(null)

  onMounted(async () => {
    await getContent()
    await getArticle()
    await getCategories()

    watch(
      () => article.value,
      () => {
        editorStatus.value = 'WRITING'
        clearTimeout(articleMainTimeout.value)
        articleMainTimeout.value = setTimeout(() => {
          updateArticle()
        }, 2000)
      },
      { deep: true }
    )
    watch(
      () => content.value,
      () => {
        editorStatus.value = 'WRITING'
        clearTimeout(contentTimeout.value)
        contentTimeout.value = setTimeout(() => {
          updateContent()
        }, 2000)
      },
      { deep: true }
    )
  })
</script>

<template>
  <div v-if="article.uuid" class="article">
    <div class="article__container">
      <div class="article__wrapper">
        <div class="article__note">
          <article-edit-status :editor-status="editorStatus" />
          <div class="article__note-fixer">
            <article-note v-model.trim="article.note" />
          </div>
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
          <div class="article__title">
            <article-textarea v-model.trim="article.title" :placeholder="t('heading')" size="BIG" />
          </div>
          <div class="article__description">
            <article-textarea v-model.trim="article.description" :placeholder="t('description')" size="LARGE" />
          </div>
          <div class="article__tag">
            <article-textarea v-model.trim="article.tag" :placeholder="t('tags')" size="LARGE" />
          </div>
          <div class="article__author-name">
            <article-textarea v-model.trim="article.author_name" :placeholder="t('authorsName')" size="LARGE" />
          </div>
          <div class="article__info-pin">
            <div class="article__info">
              <article-info :info="articleInfo" />
            </div>
            <div class="article__dates">
              <s-datepicker v-model="article.start_date" width="150px" right />
              <span>-</span>
              <s-datepicker v-model="article.end_date" width="150px" right />
            </div>
          </div>
          <div class="article__categories">
            <article-categories
              @select-category="selectCategory"
              @delete-category="deleteCategory"
              :categories="categories"
              :selected-categories="selectedCategories"
            />
          </div>
          <div class="article__editor">
            <template v-for="(contentItem, index) in content">
              <editor
                v-if="contentItem.type === 'TEXT'"
                v-model="contentItem.content"
                @create-table="createTable(index)"
                @create-image="createImage(index)"
                @create-video="createVideo(index)"
              />
              <editor-table
                v-if="contentItem.type === 'TABLE'"
                v-model="contentItem.content"
                @delete="selectDeleteTable(index)"
              />
              <article-image-uploader
                v-if="contentItem.type === 'PHOTO'"
                @delete="selectDeleteImage(index)"
                @change-file="(file: File)=> changeContentPhoto(index, file)"
                v-model:author="contentItem.content.author"
                v-model:description="contentItem.content.description"
                :photo="contentItem.content.photo"
              />
              <article-video-uploader
                v-if="contentItem.type === 'VIDEO'"
                @change-poster-file="(file: File)=> changeContentPoster(index, file)"
                @change-video-file="(file:File)=> changeContentVideo(index, file)"
                @delete="selectDeleteVideo(index)"
                :poster="contentItem.content.poster"
                :video_path="contentItem.content.video_path"
                :progress="contentVideoProgress[index]"
                :status="getVideoStatus(contentItem.content)"
                deletable
              />
            </template>
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
    // .article__dates
    &__dates {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    // .article__categories
    &__categories {
      margin-top: 20px;
    }
    // .article__tab-bar
    &__tab-bar {
      margin-top: 20px;
    }
    // .article__editor
    &__editor {
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
