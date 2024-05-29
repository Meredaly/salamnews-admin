<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'

  import { useBase } from '@/store/base'
  import { getDateTime } from '@/utils/helpers/date'

  defineProps({
    videoShort: {
      type: Object as any
    }
  })

  const { locale } = useI18n()

  const base = useBase()
</script>

<template>
  <router-link :to="`/media/shorts/edit/${videoShort?.uuid}`" class="video-short">
    <div class="video-short__image _main-image-container">
      <div class="_main-image-box">
        <img v-if="videoShort?.main_video" :src="base.baseURL + videoShort?.main_video.photo" alt="article" />
      </div>
    </div>
    <div class="video-short__content">
      <div v-if="videoShort?.title_tm" class="video-short__title">
        {{ locale === 'tm' ? videoShort?.title_tm : videoShort?.title_ru }}
      </div>
      <div v-else class="video-short__placeholder">{{ videoShort?.slug_name }}</div>

      <div v-if="videoShort.published_date" class="video-short__date">
        <icon name="calendar" />
        <p>{{ getDateTime(videoShort.published_date) }}</p>
      </div>
      <div v-else-if="videoShort.publication_date" class="video-short__date">
        <icon name="clock" />
        <p>{{ getDateTime(videoShort.publication_date) }}</p>
      </div>
      <div class="video-short__info">
        <div class="video-short__info-right">
          <div class="video-short__count">
            <icon name="chat" />
            <p>0</p>
          </div>
          <div class="video-short__count">
            <icon name="eye" />
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
  .video-short {
    // .video-short__image
    &__image {
      position: relative;
      ._main-image-box {
        &::before {
          padding-top: 178%;
        }
      }
    }
    // .video-short__content
    &__content {
      margin-top: 10px;
    }
    // .video-short__title
    &__title {
      color: var(--dark);
      font-size: 14px;
      font-family: $secondFont;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: uppercase;
    }

    // .photo-report__placeholder
    &__placeholder {
      color: var(--gray-5);
      font-family: $secondFont;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: uppercase;
    }
    // .video-short__date
    &__date {
      margin-top: 10px;
      display: flex;
      align-items: center;
      color: #999;
      gap: 4px;
    }
    // .video-short__count
    &__count {
      display: flex;
      align-items: center;
      color: #999;
      gap: 4px;
      &:deep() {
        svg {
          width: 18px;
          height: 18px;
        }
      }
      p {
        font-size: 12px;
        font-weight: 500;
        line-height: 120%;
      }
    }
    // .video-short__info
    &__info {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // .video-short__info-right
    &__info-right {
      display: flex;
      gap: 20px;
    }
  }
</style>
