<script setup lang="ts">
  import { PropType, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'

  import { InformationList } from '@/types/base'

  const { t } = useI18n()

  const props = defineProps({
    info: { type: Array as PropType<InformationList[]>, default: () => [] },
    new: { type: Boolean, default: false },
    danger: { type: Boolean, default: false }
  })

  const classes = computed(() => {
    return [
      'task-info',
      {
        'task-info_new': props.new,
        'task-info_danger': props.danger
      }
    ]
  })
  const statusInfo = {
    EMPTY: { class: 'task-info__item-text_empty', title: 'empty' },
    WRITING: { class: 'task-info__item-text_writing', title: 'writing' },
    WAITING: { class: 'task-info__item-text_waiting', title: 'waiting' },
    PUBLISHED: { class: 'task-info__item-text_published', title: 'published' },
    DELETED: { class: 'task-info__item-text_deleted', title: 'deleted' },
    PLANNING: { class: 'task-info__item-text_planning', title: 'planning' }
  } as any
</script>

<template>
  <div :class="classes">
    <div class="task-info__button">
      <icon name="info" />
    </div>
    <div class="task-info__menu-box">
      <div class="task-info__menu">
        <template v-for="infoBox in info">
          <div class="task-info__box">
            <div v-for="infoItem in infoBox" class="task-info__item">
              <template v-if="infoItem.key === 'status'">
                <div class="task-info__item-name">{{ t(infoItem.key) }}</div>
                <div v-if="infoItem.value" :class="['task-info__item-text', statusInfo[infoItem.value].class]">
                  {{ t(statusInfo[infoItem.value].title) }}
                </div>
              </template>
              <template v-else>
                <div class="task-info__item-name">{{ t(infoItem.key) }}</div>
                <div class="task-info__item-text">{{ infoItem.value }}</div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .task-info {
    position: relative;
    &:hover {
      .task-info__button {
        color: #ffadad;
      }
      .task-info__menu-box {
        display: block;
      }
    }
    // .task-info_new
    &_new {
      .task-info__button {
        color: #009dff !important;
      }
    }
    // .task-info_danger
    &_danger {
      .task-info__button {
        color: #df2f2f !important;
      }
    }

    // .task-info__button
    &__button {
      color: #c8c8c8;
      cursor: pointer;
      &:deep(.icon) {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .task-info__menu-box
    &__menu-box {
      position: absolute;
      top: 100%;
      padding-top: 17px;
      display: none;
    }
    // .task-info__menu
    &__menu {
      border-radius: var(--border-radius);
      border: 1px solid #efefef;
      background: #fff;
      box-shadow: -2px 1px 9px 0px rgba(0, 0, 0, 0.1);
      padding: 10px;
    }
    // .task-info__box
    &__box {
      position: relative;
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
    // .task-info__item
    &__item {
      display: flex;
      &:not(:first-child) {
        margin-top: 3px;
      }
    }
    // .task-info__item-name
    &__item-name {
      color: #737171;
      font-size: 10px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      width: 90px;
      min-width: 90px;
    }
    // .task-info__item-text
    &__item-text {
      color: #000;
      font-size: 10px;
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
      // .task-info__item-text_planning
      &_planning {
        color: #195c14;
      }
      // .task-info__item-text_deleted
      &_deleted {
        color: var(--accent);
      }
    }
  }
</style>
