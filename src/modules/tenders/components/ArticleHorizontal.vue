<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import { getDate } from '@/utils/helpers/date'

  const emit = defineEmits(['open'])

  defineProps({
    article: {
      type: Object as any
    }
  })

  const { t } = useI18n()

  const open = () => {
    emit('open')
  }
</script>

<template>
  <article @click="open" class="tender-horizontal">
    <div v-if="article?.title" class="tender-horizontal__title">
      {{ article?.title }}
    </div>
    <h3 v-else class="tender-horizontal__placeholder">{{ article?.slug_name }}</h3>
    <div class="tender-horizontal__desc">{{ article?.description }}</div>
    <div class="tender-horizontal__category">
      <span v-for="category in article?.category">{{ category.name_ru }}</span>
    </div>
    <div v-if="article.language" class="tender-horizontal__language">
      <icon name="locale_language" />
      {{ article.language === 'TKM' ? t('localeTM') : article.language === 'RUS' ? t('localeRU') : t('localeEN') }}
    </div>
    <div class="tender-horizontal__info">
      <div class="tender-horizontal__date-time">
        <div v-if="article?.start_date" class="tender-horizontal__date">
          <icon name="date_range" />
          <p>{{ getDate(article?.start_date) }}</p>
        </div>
        <div v-if="article?.end_date" class="tender-horizontal__time">
          <icon name="date_range" />
          <p>{{ getDate(article?.end_date) }}</p>
        </div>
      </div>
      <div class="tender-horizontal__counts">
        <div class="tender-horizontal__count">
          <icon name="message" />
          <p>0</p>
        </div>
        <div class="tender-horizontal__count">
          <icon name="visibility" />
          <p>0</p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
  .tender-horizontal {
    display: inline-block;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    // .tender-horizontal__title
    &__title {
      color: var(--dark);
      font-size: 18px;
      font-family: $secondFont;
      font-weight: 600;
      line-height: 120%;
    }

    // .tender-horizontal__placeholder
    &__placeholder {
      color: var(--gray-5);
      font-family: $secondFont;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      text-transform: uppercase;
    }
    // .tender-horizontal__desc
    &__desc {
      margin-top: 6px;
      color: var(--text);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    // .tender-horizontal__category
    &__category {
      margin-top: 2px;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: uppercase;
      color: var(--accent);
      display: flex;
      flex-direction: column;
      span {
      }
    }
    // .tender-horizontal__language
    &__language {
      color: var(--text);
      margin-top: 4px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px 4px 4px;
      background-color: #eef6ff;
      border-radius: 4px;
      width: fit-content;
      &:deep() {
        .icon {
        }
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    // .tender-horizontal__info
    &__info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // .tender-horizontal__date-time
    &__date-time {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
    }
    // .tender-horizontal__date
    &__date {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #fff;
      border-radius: 2px;
      background: var(--category-color, #e86d6d);
      padding: 4px;
      font-style: italic;
      font-weight: 600;
      line-height: 160%; /* 22.4px */
    }
    // .tender-horizontal__time
    &__time {
      display: flex;
      align-items: center;
      gap: 4px;
      border-radius: 2px;
      background: var(--category-socses, #f5f5f5);
      color: var(--date-colors, #999);
      font-style: italic;
      line-height: 160%; /* 22.4px */
      padding: 4px;
    }
    // .tender-horizontal__counts
    &__counts {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
    }
    // .tender-horizontal__count
    &__count {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--date-colors, #999);
      font-weight: 600;
      line-height: 160%; /* 22.4px */
    }
  }
</style>
