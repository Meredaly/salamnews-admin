<script setup lang="ts">
  import { PropType, computed } from 'vue'
  import Icon from '@/UI/Icon'
  import type { Banner } from '../types'

  import { useBase } from '@/store/base'

  import { getDate } from '@/utils/helpers/date'

  const base = useBase()

  const props = defineProps({
    banner: { type: Object as PropType<Banner>, default: () => {} }
  })

  const image = computed(() => {
    return props.banner.image_web || props.banner.image_mobile || props.banner.image_alternative || null
  })
</script>

<template>
  <div class="banner-item">
    <div class="banner-item__wrapper">
      <div class="banner-item__image">
        <img v-if="image" :src="base.baseURL + image" />
      </div>
      <div class="banner-item__title">{{ banner.title }}</div>
      <div class="banner-item__info">
        <div class="banner-item__dates">
          <div v-if="banner.start_date" class="banner-item__date">
            <icon name="calendar" />
            <p>{{ getDate(banner.start_date) }}</p>
          </div>
          <div v-if="banner.end_date" class="banner-item__date">
            <icon name="calendar" />
            <p>{{ getDate(banner.end_date) }}</p>
          </div>
        </div>
        <div :class="['banner-item__visibility', { _hidden: !banner.visibility }]">Видимость</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .banner-item {
    cursor: pointer;

    // .banner-item__wrapper
    &__wrapper {
    }
    // .banner-item__image
    &__image {
      height: 200px;
      background: #efefef;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
    // .banner-item__title
    &__title {
      margin-top: 10px;
      font-size: 16px;
      font-weight: 700;
      font-family: $secondFont;
      color: var(--dark);
      line-height: 1.5;
    }
    // .banner-item__info
    &__info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
    }
    // .banner-item__dates
    &__dates {
      display: flex;
      gap: 10px;
    }
    // .banner-item__date
    &__date {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #999;
    }
    // .banner-item__visibility
    &__visibility {
      padding: 4px 10px;
      border-radius: 4px;
      background-color: #1c7c33;
      color: var(--white);
      &._hidden {
        background-color: var(--accent);
      }
    }
  }
</style>
