<script setup lang="ts">
  import { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import { useBase } from '@/store/base'
  import { getDateTime } from '@/utils/helpers/date'

  const emit = defineEmits(['open'])

  const { t, locale } = useI18n()

  const base = useBase()

  defineProps({
    article: {
      type: Object as PropType<any>,
      default: null
    }
  })

  const open = () => {
    emit('open')
  }

  const getCategory = (category: any): string => {
    let parentName = ''
    if (category.parent_id) {
      parentName = `${locale.value === 'tm' ? category.parent_name_tm : category.parent_name_ru} / `
    }
    return `${parentName}${locale.value === 'tm' ? category.name_tm : category.name_ru}`
  }
</script>

<template>
  <article @click="open" class="article-horizontal">
    <div class="article-horizontal__image">
      <div class="_main-image-container">
        <div class="_main-image-box">
          <template v-if="article.main_type === 'PHOTO'">
            <img v-if="article.main_photo" :src="base.baseURL + article.main_photo + '-300.webp'" alt="article" />
          </template>
          <template v-if="article.main_type === 'VIDEO'">
            <img v-if="article.main_video" :src="base.baseURL + article.main_video + '-300.webp'" alt="article" />
          </template>
        </div>
      </div>
    </div>
    <div class="article-horizontal__content">
      <h3 v-if="article.title" class="article-horizontal__title">{{ article.title }}</h3>
      <h3 v-else class="article-horizontal__placeholder">{{ article.slug_name }}</h3>
      <div class="article-horizontal__category">
        <span v-for="category in article.category">{{ getCategory(category) }}</span>
      </div>
      <div class="article-horizontal__info">
        <div v-if="article.published_date" class="article-horizontal__date">
          <icon name="calendar" />
          <p>{{ getDateTime(article.published_date) }}</p>
        </div>
        <div v-else-if="article.publication_date" class="article-horizontal__date">
          <icon name="clock" />
          <p>{{ getDateTime(article.publication_date) }}</p>
        </div>
        <div v-if="false" class="article-horizontal__counts">
          <div class="article-horizontal__count">
            <icon name="chat" />
            <p>0</p>
          </div>
          <div class="article-horizontal__count">
            <icon name="thumbUpAlt" />
            <p>0</p>
          </div>
          <div class="article-horizontal__count">
            <icon name="eye" />
            <p>0</p>
          </div>
          <div class="article-horizontal__count">
            <icon name="user" />
            <p>0</p>
          </div>
        </div>
      </div>
      <div v-if="article.language" class="article-horizontal__information">
        <icon name="locale_language" />
        {{ article.language === 'TKM' ? t('localeTM') : article.language === 'RUS' ? t('localeRU') : t('localeEN') }}
      </div>
      <div v-if="article.writer_id" class="article-horizontal__information">
        <icon name="personEdit" /> {{ article.writer?.name }} {{ article.writer?.surname }}
      </div>
      <div v-if="article.note" class="article-horizontal__note">{{ article.note }}</div>
    </div>
  </article>
</template>

<style scoped lang="scss">
  .article-horizontal {
    display: flex;
    width: 100%;
    padding: 10px;
    border-radius: var(--border-radius);
    gap: 10px;
    cursor: pointer;
    // .article-horizontal__image
    &__image {
      width: 190px;
      min-width: 190px;
      background-color: var(--gray-1);
    }
    // .article-horizontal__content
    &__content {
      flex: 1 1;
      width: 0;
    }
    // .article-horizontal__title
    &__title {
      color: var(--dark);
      font-family: $secondFont;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    // .article-horizontal__placeholder
    &__placeholder {
      color: var(--gray-5);
      font-family: $secondFont;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    // .article-horizontal__description
    &__description {
      margin-top: 6px;
      color: var(--text);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    // .article-horizontal__category
    &__category {
      margin-top: 2px;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      color: var(--accent);
      span {
        &:not(:last-child) {
          &::after {
            content: ',';
            padding-right: 6px;
          }
        }
      }
    }
    // .article-horizontal__information
    &__information {
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
    // .article-horizontal__note
    &__note {
      margin-top: 2px;
      color: var(--accent);
      font-size: 10px;
      font-style: italic;
      font-weight: 600;
      line-height: normal;
      padding: 4px;
      border-radius: var(--border-radius);
      background-color: var(--accent-100);
      width: fit-content;
    }
    // .article-horizontal__info
    &__info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }
    // .article-horizontal__date
    &__date {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #999;
    }

    // .article-horizontal__counts
    &__counts {
      margin-top: 2px;
      display: flex;
      gap: 15px;
    }
    // .article-horizontal__count
    &__count {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #999;
      &:deep() {
        .icon {
          svg {
            width: 16px;
            height: 16px;
          }
        }
      }
      p {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
</style>
