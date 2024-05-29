<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'

  import { useBase } from '@/store/base'
  import { getDateTime, formatTime } from '@/utils/helpers/date'

  defineProps({
    videoReport: {
      type: Object as any
    }
  })

  const { locale } = useI18n()
  const base = useBase()
</script>

<template>
  <router-link :to="`/watan/video/edit/${videoReport?.uuid}`" class="video-report">
    <div class="video-report__image _main-image-container">
      <div class="_main-image-box">
        <img v-if="videoReport?.main_video" :src="base.baseURL + videoReport?.main_video.poster" alt="article" />
      </div>
      <div class="video-report__duration">
        {{ formatTime(Number(videoReport?.main_video?.duration)) }}
      </div>
    </div>
    <div class="video-report__content">
      <div v-if="videoReport?.title_tm || videoReport?.title_ru" class="video-report__title">
        {{ locale === 'tm' ? videoReport?.title_tm : videoReport?.title_ru }}
      </div>
      <div v-else class="video-report__placeholder">{{ videoReport?.slug_name }}</div>
      <div class="video-report__info">
        <div v-if="videoReport?.published_date" class="video-report__count">
          <icon name="calendarOutline" />
          <p>{{ getDateTime(videoReport?.published_date) }}</p>
        </div>
        <div class="video-report__info-right">
          <div class="video-report__count">
            <icon name="chat" />
            <p>0</p>
          </div>
          <div class="video-report__count">
            <icon name="eye" />
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
  .video-report {
    // .video-report__image
    &__image {
      position: relative;
    }
    // .video-report__duration
    &__duration {
      border-radius: 2px;
      background: rgba(223, 47, 47, 0.5);
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 10px;
      color: var(--white);
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: uppercase;
      border-radius: 0 0 4px 0;
    }
    // .video-report__content
    &__content {
      margin-top: 10px;
    }
    // .video-report__title
    &__title {
      color: var(--dark);
      font-size: 16px;
      font-family: $secondFont;
      font-style: normal;
      font-weight: 700;
      line-height: 1.5;
    }

    // .photo-report__placeholder
    &__placeholder {
      color: var(--gray-5);
      font-family: $secondFont;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 1.5;
    }

    // .video-report__info
    &__info {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // .video-report__count
    &__count {
      display: flex;
      align-items: center;
      padding: 5px;
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
    // .video-report__info-right
    &__info-right {
      display: flex;
    }
  }
</style>
