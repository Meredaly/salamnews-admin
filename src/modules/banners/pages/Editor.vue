<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import SButton from '@/UI/SButton.vue'
  import SDatepicker from '@/UI/SDatepicker'
  import ArticleEditStatus from '@/components/ArticleEditStatus.vue'
  import PopUpConfirm from '@/components/PopUpConfirm.vue'
  import ArticleTextarea from '@/components/article/ArticleTextarea.vue'
  import BannerImageUploader from '../components/BannerImageUploader.vue'

  import { GET_BANNER, DELETE_BANNER, IMAGE_UPLOAD, UPDATE_BANNER } from '../api'

  const route = useRoute()
  const router = useRouter()

  const { t } = useI18n()

  const editorStatus = ref('SAVED')

  const article = ref<any>({
    uuid: '',
    type: '',
    title: '',
    image_web: '',
    image_mobile: '',
    image_alternative: '',
    url: '',
    start_date: '',
    end_date: '',
    visibility: true
  })

  const getBanner = async () => {
    try {
      const { data } = await GET_BANNER({ uuid: route.params.id })

      article.value = data
    } catch (error) {
      console.error(error)
    }
  }
  const updateBanner = async () => {
    try {
      editorStatus.value = 'SAVING'
      await UPDATE_BANNER({
        id: article.value.uuid,
        data: {
          ...article.value,
          start_date: article.value.start_date || null,
          end_date: article.value.end_date || null
        }
      })
      editorStatus.value = 'SAVED'
    } catch (error) {
      console.error(error)
      editorStatus.value = 'ERROR'
    }
  }

  const changeDesktopImage = async (file: File) => {
    const image = await uploadImage(file)
    if (image) {
      article.value.image_web = image
    }
  }

  const changeMobileImage = async (file: File) => {
    const image = await uploadImage(file)
    if (image) {
      article.value.image_mobile = image
    }
  }

  const changeAlternativeImage = async (file: File) => {
    const image = await uploadImage(file)
    if (image) {
      article.value.image_alternative = image
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const { data } = await IMAGE_UPLOAD({ data: { image: file } })
      return data.image_path.toString()
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  const toggleVisible = () => {
    article.value.visibility = !article.value.visibility
  }

  const showConfirmDeletePopUp = ref(false)

  const openConfirmDeletePopUp = () => {
    showConfirmDeletePopUp.value = true
  }

  const closeConfirmDeletePopUp = () => {
    showConfirmDeletePopUp.value = false
  }

  const confirmDeleteBanner = async () => {
    closeConfirmDeletePopUp()
    try {
      await DELETE_BANNER({ uuid: article.value.uuid })

      router.go(-1)
    } catch (error) {
      console.error(error)
    }
  }

  const back = () => {
    router.go(-1)
  }

  const bannerTimeout = ref<any>(null)

  onMounted(async () => {
    await getBanner()

    watch(
      () => article.value,
      () => {
        editorStatus.value = 'WRITING'
        clearTimeout(bannerTimeout.value)
        bannerTimeout.value = setTimeout(() => {
          updateBanner()
        }, 2000)
      },
      { deep: true }
    )
  })
</script>

<template>
  <div class="article">
    <div class="article__container">
      <div class="article__wrapper">
        <div class="article__note">
          <article-edit-status :editor-status="editorStatus" />
        </div>
        <div class="article__body">
          <div class="article__head">
            <div class="article-head">
              <div class="article-head__back">
                <s-button @click="back" :title="t('back')" styles="light" prev-icon="chevronLeft" />
                <s-button @click="openConfirmDeletePopUp" prev-icon="deleteForever" :title="t('delete')" />
              </div>
              <div class="article-head__dates">
                <div class="article-head__date">
                  <s-datepicker v-model="article.start_date" width="150px" />
                </div>
                <div class="article-head__date">
                  <s-datepicker v-model="article.end_date" width="150px" />
                </div>
                <div class="article-head__date">
                  <s-button v-if="article.visibility" @click="toggleVisible" prev-icon="eye" title="Видимый" />
                  <s-button v-else @click="toggleVisible" prev-icon="eye" styles="secondary" title="Невидимый" />
                </div>
              </div>
            </div>
          </div>
          <div class="article__url">
            <article-textarea v-model.trim="article.title" :placeholder="t('title')" size="LARGE" />
          </div>
          <div class="article__url">
            <article-textarea v-model.trim="article.url" placeholder="Url" size="LARGE" />
          </div>
          <div class="article__images">
            <div class="article__image">
              <div class="article__image-title">Веб версия</div>
              <banner-image-uploader @change-file="changeDesktopImage" :photo="article.image_web" />
            </div>
            <div class="article__image">
              <div class="article__image-title">Мобильная версия</div>
              <banner-image-uploader @change-file="changeMobileImage" :photo="article.image_mobile" />
            </div>
            <div class="article__image">
              <div class="article__image-title">Альтернативная версия</div>
              <banner-image-uploader @change-file="changeAlternativeImage" :photo="article.image_alternative" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-confirm
      v-if="showConfirmDeletePopUp"
      @no="closeConfirmDeletePopUp"
      @yes="confirmDeleteBanner"
      title="Вы действительно хотите удалить баннер?"
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
      margin-left: 20px;
      padding-top: 20px;
      width: 800px;
      padding-bottom: 500px;
    }
    // .article__head
    &__head {
    }
    // .article__url
    &__url {
      margin-top: 20px;
    }
    // .article__images
    &__images {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    //.article__image
    &__image {
      flex: 1 1;
      width: 0;
    }
    // .article__image-title
    &__image-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
  .article-head {
    display: flex;
    justify-content: space-between;
    // .article-head__back
    &__back {
      display: flex;
      gap: 10px;
    }
    // .article-head__dates
    &__dates {
      display: flex;
      gap: 10px;
    }
    // .article-head__date
    &__date {
    }
  }
</style>
