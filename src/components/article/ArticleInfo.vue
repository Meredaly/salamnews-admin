<script setup lang="ts">
  import SButton from '@/UI/SButton.vue'
  import { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { InformationList } from '@/types/base'

  const { t } = useI18n()

  defineProps({
    info: { type: Array as PropType<InformationList[]>, default: () => [] }
  })
</script>

<template>
  <div class="article-info">
    <div class="article-info__button">
      <s-button prev-icon="info" styles="light" />
    </div>
    <div class="article-info__menu">
      <div class="article-info__menu-box">
        <template v-for="infoBox in info">
          <table class="article-info__box">
            <tr v-for="infoItem in infoBox" class="article-info__item">
              <td class="article-info__item-name">{{ t(infoItem.key) }}</td>
              <td class="article-info__item-text">{{ infoItem.value }}</td>
            </tr>
          </table>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .article-info {
    position: relative;
    &:hover {
      .article-info__menu {
        display: block;
      }
    }
    // .article-info__button
    &__button {
    }
    // .article-info__menu
    &__menu {
      position: absolute;
      top: 100%;
      padding-top: 5px;
      left: 0;
      display: none;
      z-index: 1;
    }
    // .article-info__menu-box
    &__menu-box {
      padding: 10px;
      border-radius: var(--border-radius);
      border: 1px solid #efefef;
      background: #fff;
      box-shadow: -2px 1px 9px 0px rgba(0, 0, 0, 0.1);
    }
    // .article-info__box
    &__box {
      position: relative;
      width: max-content;
      &:not(:first-child) {
        padding-top: 9px;
        &::before {
          content: '';
          position: absolute;
          width: calc(100% - 16px);
          height: 1px;
          background: #d9d9d9;
          top: 4px;
          left: 8px;
        }
      }
    }
    // .article-info__item
    &__item {
      &:not(:first-child) {
        margin-top: 3px;
      }
    }
    // .article-info__item-name
    &__item-name {
      color: #737171;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      width: 90px;
      min-width: 90px;
      width: max-content;
      padding-right: 5px;
    }
    // .article-info__item-text
    &__item-text {
      color: #000;
      font-size: 12px;
      font-weight: 400;
      line-height: normal;
      width: max-content;
      // .task-info__item-text_empty
      &_empty {
      }
      // .task-info__item-text_writing
      &_writing {
        color: #a2731d;
      }
      // .task-info__item-text_waiting
      &_waiting {
        color: #1d3aa2;
      }
      // .task-info__item-text_published
      &_published {
        color: #30b227;
      }
      // .task-info__item-text_deleted
      &_deleted {
        color: var(--accent);
      }
    }
  }
</style>
