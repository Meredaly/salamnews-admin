<script setup lang="ts">
  import { PropType } from 'vue'

  import Icon from '@/UI/Icon'
  import { useBase } from '@/store/base'
  import { PhotoReportItem } from '../types/photoReport'

  import { getDateTime } from '@/utils/helpers/date'

  defineProps({
    photoReport: {
      type: Object as PropType<PhotoReportItem>,
      default: {}
    }
  })

  const base = useBase()
</script>

<template>
  <router-link :to="`/media/photo-report/element/${photoReport?.uuid}`" class="photo-report">
    <div class="photo-report__image _main-image-container">
      <div class="_main-image-box">
        <img v-if="photoReport.main_photo" :src="base.baseURL + photoReport.main_photo" alt="article" />
      </div>
    </div>
    <div class="photo-report__content">
      <div v-if="photoReport.title_tm" class="photo-report__title">{{ photoReport.title_tm }}</div>
      <div v-else class="photo-report__placeholder">{{ photoReport.slug_name }}</div>
      <div class="photo-report__info">
        <div v-if="photoReport.published_date" class="photo-report__date">
          <icon name="calendar" />
          <p>{{ getDateTime(photoReport.published_date) }}</p>
        </div>
        <div v-else-if="photoReport.publication_date" class="photo-report__date">
          <icon name="clock" />
          <p>{{ getDateTime(photoReport.publication_date) }}</p>
        </div>
        <div class="photo-report__info-right">
          <div class="photo-report__count">
            <icon name="chat" />
            <p>0</p>
          </div>
          <div class="photo-report__count">
            <icon name="eye" />
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
  .photo-report {
    // .photo-report__image
    &__image {
    }
    // .photo-report__content
    &__content {
      margin-top: 10px;
    }
    // .photo-report__title
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
    // .photo-report__info
    &__info {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // .photo-report__date
    &__date {
      display: flex;
      caption-side: 4px;
      align-items: center;
      font-style: italic;
      color: #999;
    }
    // .photo-report__count
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
    // .photo-report__info-right
    &__info-right {
      display: flex;
      gap: 10px;
    }
  }
</style>
