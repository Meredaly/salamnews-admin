<script setup lang="ts">
  import { PropType, ref } from 'vue'
  import { Thumbs } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import ArticleTextarea from './ArticleTextarea.vue'
  import { useBase } from '@/store/base'

  const emit = defineEmits(['update:author', 'update:description', 'changeFile', 'deleteImage'])

  defineProps({
    author: { type: String, default: '' },
    description: { type: String, default: '' },
    photos: { type: Array as PropType<string[]>, default: [] }
  })

  const { t } = useI18n()

  const base = useBase()

  const updateAuthor = (author: string) => {
    emit('update:author', author)
  }
  const updateDescription = (author: string) => {
    emit('update:description', author)
  }

  const thumbsSwiper = ref(null)
  const setThumbsSwiper = (swiper: any) => {
    thumbsSwiper.value = swiper
  }

  const changeFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files?.length) emit('changeFile', target.files)
  }

  const deleteImage = (index: number): void => {
    emit('deleteImage', index)
  }
</script>

<template>
  <div class="article-slider-uploader">
    <div class="article-slider-uploader__author">
      <article-textarea :value="author" @update="updateAuthor" :placeholder="t('author')" text-end />
    </div>
    <div class="article-slider-uploader__main">
      <swiper
        :slides-per-view="1"
        :space-between="10"
        :modules="[Thumbs]"
        :thumbs="{ swiper: thumbsSwiper }"
        class="article-slider-uploader__main-swiper"
      >
        <swiper-slide v-for="(photo, index) in photos" :key="photo" class="article-slider-uploader__main-slide">
          <button @click="deleteImage(index)" class="article-slider-uploader__main-delete">
            <icon name="deleteForever" />
          </button>
          <div class="article-slider-uploader__main-image">
            <img :src="`${base.baseURL}${photo}-1000.webp`" />
          </div>
        </swiper-slide>
        <swiper-slide class="article-slider-uploader__main-slide">
          <label class="article-slider-uploader__main-slide-add">
            <div class="article-slider-uploader__main-slide-add-icon">
              <icon name="addCircle" />
            </div>
            <input @change="changeFiles" type="file" accept="image/*" />
          </label>
        </swiper-slide>
      </swiper>
    </div>
    <div class="article-slider-uploader__thumb">
      <swiper
        :slides-per-view="'auto'"
        :space-between="10"
        :modules="[Thumbs]"
        @swiper="setThumbsSwiper"
        watch-slides-progress
        class="article-slider-uploader__thumb-swiper"
      >
        <swiper-slide v-for="photo in photos" :key="photo" class="article-slider-uploader__thumb-slide">
          <div class="article-slider-uploader__thumb-image">
            <img :src="`${base.baseURL}${photo}-1000.webp`" />
          </div>
        </swiper-slide>
        <swiper-slide class="article-slider-uploader__thumb-slide">
          <label class="article-slider-uploader__thumb-add">
            <div class="article-slider-uploader__thumb-add-icon">
              <icon name="addCircle" />
            </div>
            <input @change="changeFiles" type="file" />
          </label>
        </swiper-slide>
      </swiper>
    </div>
    <div class="article-slider-uploader__description">
      <article-textarea :value="description" @update="updateDescription" :placeholder="t('description')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .article-slider-uploader {
    padding: 20px 0;
    border-top: 1px solid #c9c9c9;
    border-bottom: 1px solid #c9c9c9;

    // .article-slider-uploader__main
    &__main {
      &:deep() {
        .swiper {
          width: 100%;
          overflow: hidden;
        }
        .swiper-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: flex;
          transition-property: transform;
          box-sizing: content-box;
          touch-action: pan-y;
        }
        .swiper-android .swiper-slide,
        .swiper-wrapper {
          transform: translate3d(0px, 0, 0);
        }
        .swiper-horizontal {
          touch-action: pan-y;
        }

        .swiper-slide {
          flex-shrink: 0;
          width: 100%;
          height: 100%;
          position: relative;
          transition-property: transform;
          display: block;
        }
      }
    }
    // .article-slider-uploader__main-swiper
    &__main-swiper {
    }
    // .article-slider-uploader__main-slide
    &__main-slide {
      position: relative;
    }
    // .article-slider-uploader__main-delete
    &__main-delete {
      position: absolute;
      z-index: 1;
      top: 10px;
      right: 10px;
      background: rgba(223, 47, 47, 0.5);
      border-radius: 4px;
      color: var(--white);
      padding: 8px;
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
      &:hover {
        background-color: var(--accent);
      }
    }
    // .article-slider-uploader__main-image
    &__main-image {
      border-radius: 4px;
      overflow: hidden;
      padding-top: 74.125%;
      position: relative;
      background: #efefef;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    // .article-slider-uploader__thumb
    &__thumb {
      margin-top: 10px;
      &:deep() {
        .swiper {
          width: 100%;
          overflow: hidden;
        }
        .swiper-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: flex;
          transition-property: transform;
          box-sizing: content-box;
          touch-action: pan-y;
        }
        .swiper-android .swiper-slide,
        .swiper-wrapper {
          transform: translate3d(0px, 0, 0);
        }
        .swiper-horizontal {
          touch-action: pan-y;
        }

        .swiper-slide {
          flex-shrink: 0;
          width: 100%;
          height: 100%;
          position: relative;
          transition-property: transform;
          display: block;
        }
        .swiper-slide-thumb-active {
          .article-slider-uploader__thumb-image {
            &::before {
              background: transparent;
            }
          }
        }
      }
    }
    // .article-slider-uploader__main-slide-add
    &__main-slide-add {
      border-radius: 4px;
      overflow: hidden;
      padding-top: 74.125%;
      position: relative;
      background: #efefef;
      cursor: pointer;
      user-select: none;
      display: block;
      input {
        display: none;
      }
    }
    // .article-slider-uploader__main-slide-add-icon
    &__main-slide-add-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--white);
      padding: 12.5px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;

      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    // .article-slider-uploader__thumb-swiper
    &__thumb-swiper {
    }
    // .article-slider-uploader__thumb-slide
    &__thumb-slide {
      width: 158px !important;
    }
    // .article-slider-uploader__thumb-image
    &__thumb-image {
      border-radius: 4px;
      border-radius: 4px;
      overflow: hidden;
      padding-top: 74.125%;
      position: relative;
      background: #efefef;
      cursor: pointer;
      img {
        position: absolute;
        object-fit: cover;
        object-position: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      &::before {
        content: '';
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%);
      }
      &:hover {
        &::before {
          background: transparent;
        }
      }
    }
    // .article-slider-uploader__thumb-add
    &__thumb-add {
      border-radius: 4px;
      overflow: hidden;
      padding-top: 74.125%;
      position: relative;
      background: #efefef;
      cursor: pointer;
      user-select: none;
      display: block;
      input {
        display: none;
      }
    }
    // .article-slider-uploader__thumb-add-icon
    &__thumb-add-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--white);
      padding: 12.5px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;

      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .article-slider-uploader__author
    &__author {
      margin-bottom: 10px;
    }
    // .article-slider-uploader__description
    &__description {
      margin-top: 10px;
    }
  }
</style>
