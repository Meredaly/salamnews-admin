<script setup lang="ts">
  import { onMounted, ref, computed, watch, watchEffect } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import ArticleHead from '@/components/article/ArticleHead.vue'
  import ArticleTextarea from '@/components/article/ArticleTextarea.vue'
  import ArticlePlan from '@/components/article/ArticlePlan.vue'
  import ArticleInfo from '@/components/article/ArticleInfo.vue'
  import ArticleTabBar from '@/components/article/ArticleTabBar.vue'
  import ArticleEditStatus from '@/components/ArticleEditStatus.vue'
  import ArticleSliderUploader from '@/components/article/ArticleSliderUploader.vue'
  import ArticleImageUploader from '@/components/article/ArticleImageUploader.vue'
  import PopUpConfirm from '@/components/PopUpConfirm.vue'
  import Editor from '@/components/article/Editor.vue'
  import EditorTable from '@/components/article/EditorTable.vue'

  import { ARTICLE_STATUS } from '@/utils/constants'
  import type { Menu, InformationList } from '@/types/base'

  import { getDateTime, joinName } from '@/utils/helpers'

  import {
    UPDATE_HOROSCOPE,
    GET_HOROSCOPE,
    UPDATE_HOROSCOPE_STATUS,
    DELETE_HOROSCOPE,
    GET_CONTENT,
    UPDATE_CONTENT,
    IMAGE_UPLOAD
  } from '../../api/horoscope'

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

  const selectedTab = ref(tabs.value[0]) as any
  const lang = computed(() => (selectedTab.value.id === 'tkm' ? 'tm' : selectedTab.value.id === 'rus' ? 'ru' : 'en'))

  const selectTab = (tab: any) => {
    selectedTab.value = tab

    author.value = article.value.main_photo[`author_${lang.value}`]

    description.value = article.value.main_photo[`description_${lang.value}`]
    getContent()
  }

  const editorStatus = ref('SAVED')

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

  const menu = ref<Menu[]>([
    { id: 1, title: 'planningPublication' },
    { id: 2, title: 'deleteVideo' }
  ])

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

  const toggleNotification = () => {
    articleStatus.value.notification = !articleStatus.value.notification
  }

  const updateHoroscope = async () => {
    try {
      editorStatus.value = 'SAVING'
      await UPDATE_HOROSCOPE({ data: article.value })
      editorStatus.value = 'SAVED'
    } catch (error) {
      console.error(error)
      editorStatus.value = 'ERROR'
    }
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

  const selectDeleteImage = (index: number) => {
    openConfirmPopUp('PHOTO', index)
  }

  const deleteImage = (idx: any) => {
    article.value.main_photo.photo.splice(idx, 1)
  }

  const deleteContentImage = (index: number) => {
    contentDeletable.value.push({
      uuid: content.value[index].uuid,
      type: 'PHOTO',
      method: 'DELETE'
    })
    content.value.splice(index, 1)
    joinContent(index)
    updatePositions()
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

  const author = ref<any>('')
  const description = ref<any>('')
  const articleInfo = ref<InformationList[]>([])

  const getHoroscope = async () => {
    try {
      const { data } = await GET_HOROSCOPE({ uuid: route.params.id })

      article.value = {
        ...data,
        author_name_tm: data.author_name_tm || '',
        author_name_ru: data.author_name_ru || '',
        author_name_en: data.author_name_en || '',
        published_date: data.published_date || null,
        main_photo: {
          author_tm: data.main_photo.author_tm || '',
          author_ru: data.main_photo.author_ru || '',
          author_en: data.main_photo.author_en || '',
          description_tm: data.main_photo.description_tm || '',
          description_ru: data.main_photo.description_ru || '',
          description_en: data.main_photo.description_en || '',
          poster: data.main_photo?.poster || '',
          photo: data.main_photo?.photo || []
        }
      }

      articleStatus.value = {
        uuid: route.params.id,
        status: data.status,
        publication_date: data.published_date || data.publication_date,
        notification: false
      }

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

      author.value = article.value.main_photo.author_tm

      description.value = article.value.main_photo.description_tm
    } catch (error) {
      console.error(error)
    }
  }

  const updateStatus = async () => {
    try {
      await UPDATE_HOROSCOPE_STATUS({ data: articleStatus.value })
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

  const selectItem = (item: any) => {
    switch (item.id) {
      case 0:
        cancelPublishArticle()
        break
      case 1:
        openPlanCalendar()
        break
      case 2:
        openConfirmDeletePopUp()
        break
    }
  }

  const showConfirmDeletePopUp = ref(false)

  const openConfirmDeletePopUp = () => {
    showConfirmDeletePopUp.value = true
  }

  const closeConfirmDeletePopUp = () => {
    showConfirmDeletePopUp.value = false
  }

  const confirmDeleteHoroscope = async () => {
    closeConfirmDeletePopUp()
    try {
      await DELETE_HOROSCOPE({ uuid: article.value.uuid })

      router.go(-1)
    } catch (error) {
      console.error(error)
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
      const { data } = await GET_CONTENT({ uuid: route.params.id, params: { language: selectedTab.value.id } })
      if (data.content_dto) {
        normalizeContent(data.content_dto)
      } else {
        content.value = [
          {
            type: 'TEXT',
            content: '<p></p>',
            order_number: 1
          }
        ]
      }
    } catch (error) {
      console.error(error)
    }
  }

  const normalizeContent = (content_dto: any) => {
    const newContent = JSON.parse(JSON.stringify(content_dto))
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
          slug_lang_id: route.params.id,
          language: selectedTab.value.id,
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

  const confirmDelete = async () => {
    switch (selectedConfirm.value.type) {
      case 'TABLE':
        deleteTable(selectedConfirm.value.index)
        break
      case 'PHOTO':
        deleteContentImage(selectedConfirm.value.index)
        break
    }
    closeConfirmPopUp()
  }

  const changeContentPhoto = async (index: number, file: File) => {
    const image = await updateImage(file)
    content.value[index].content.photo = image
  }

  const articleMainTimeout = ref<any>(null)
  const contentTimeout = ref<any>(null)

  onMounted(async () => {
    await getHoroscope()
    await getContent()

    watch(
      () => article.value,
      () => {
        editorStatus.value = 'WRITING'
        clearTimeout(articleMainTimeout.value)
        articleMainTimeout.value = setTimeout(() => {
          updateHoroscope()
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

    watchEffect(() => {
      article.value.main_photo[`author_${lang.value}`] = author.value
    })

    watchEffect(() => {
      article.value.main_photo[`description_${lang.value}`] = description.value
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
              @publish="publishArticle"
              @cancel-publication="cancelPublishArticle"
              @select-item="selectItem"
              @select-date="selectDate"
              @toggle-notification="toggleNotification"
              :menu="menu"
              :status="articleStatus.status"
              :publication-date="article.publication_date"
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
              v-if="selectedTab.id === 'rus'"
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

          <div class="article__editor">
            <template v-for="(contentItem, index) in content">
              <editor
                v-if="contentItem.type === 'TEXT'"
                v-model="contentItem.content"
                @create-table="createTable(index)"
                @create-image="createImage(index)"
                show-video
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
      title="Вы действительно хотите?"
    />
    <pop-up-confirm
      v-if="showConfirmDeletePopUp"
      @no="closeConfirmDeletePopUp"
      @yes="confirmDeleteHoroscope"
      title="Вы действительно хотите?"
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
      top: 118px;
      padding-top: 30px;
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
      position: relative;
      z-index: 2;
    }
    // .article__categories
    &__categories {
      margin-top: 20px;
    }
    // .article__tab-bar
    &__tab-bar {
      margin-top: 20px;
    }
    // .article__main-video
    &__main-video {
      margin-top: 20px;
    }
  }
</style>
