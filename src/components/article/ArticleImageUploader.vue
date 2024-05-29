<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import ArticleTextarea from './ArticleTextarea.vue'
  import Icon from '@/UI/Icon'
  import SButton from '@/UI/SButton.vue'

  import { useBase } from '@/store/base'

  const { t } = useI18n()

  const emit = defineEmits(['update:author', 'update:description', 'changeFile', 'delete'])

  defineProps({
    author: { type: String, default: '' },
    description: { type: String, default: '' },
    photo: { type: String, default: '' }
  })

  const base = useBase()

  const updateAuthor = (author: string) => {
    emit('update:author', author)
  }
  const updateDescription = (author: string) => {
    emit('update:description', author)
  }
  const changeFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files?.length) emit('changeFile', target.files[0])
  }

  const deleteImage = () => {
    emit('delete')
  }
</script>

<template>
  <div class="article-image-uploader">
    <div class="article-image-uploader__head">
      <div class="article-image-uploader__author">
        <article-textarea :value="author" @update="updateAuthor" :placeholder="t('author')" text-end />
      </div>
      <div class="article-image-uploader__delete">
        <s-button @click="deleteImage" prev-icon="deleteForever" :title="t('delete')" />
      </div>
    </div>
    <div class="article-image-uploader__body">
      <div class="article-image-uploader__upload-image">
        <label class="article-image-uploader__upload-label">
          <div class="article-image-uploader__upload-icon">
            <icon name="addCircle" />
          </div>
          <input @change="changeFiles" type="file" accept="image/*" />
        </label>
        <div class="article-image-uploader__image">
          <img v-if="photo" :src="`${base.baseURL}${photo}-1000.webp`" />
        </div>
      </div>
    </div>
    <div class="article-image-uploader__description">
      <article-textarea :value="description" @update="updateDescription" :placeholder="t('description')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .article-image-uploader {
    padding: 20px 0;
    border-top: 1px solid #c9c9c9;
    border-bottom: 1px solid #c9c9c9;
    border-radius: 4px;
    overflow: hidden;

    // .article-image-uploader__head
    &__head {
      display: flex;
      gap: 10px;
    }
    // .article-image-uploader__author
    &__author {
      flex: 1 1;
    }
    // .article-image-uploader__delete
    &__delete {
    }
    // .article-image-uploader__body
    &__body {
      margin-top: 10px;
      position: relative;
    }
    // .article-image-uploader__upload-image
    &__upload-image {
      &:hover {
        .article-image-uploader__image {
          z-index: -1;
        }
      }
    }
    // .article-image-uploader__upload-label
    &__upload-label {
      background: #efefef;
      display: block;
      padding-top: 74.125%;
      position: relative;
      cursor: pointer;
      input {
        display: none;
      }
    }
    // .article-image-uploader__upload-icon
    &__upload-icon {
      border-radius: 4px;
      padding: 12.5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--white);
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    // .article-image-uploader__description
    &__description {
      margin-top: 10px;
    }
    // .article-image-uploader__image
    &__image {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
  }
</style>
