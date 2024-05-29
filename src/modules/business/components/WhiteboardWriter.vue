<script setup lang="ts">
  import { ref, computed, PropType } from 'vue'
  import { Container, Draggable } from 'vue3-smooth-dnd'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import TaskItem from './TaskItem.vue'

  import { useBase } from '@/store/base'

  import { ARTICLE_STATUS } from '@/utils/constants'
  import { DropResult, Employee, TaskLanguage, TasksCount } from '../types/whiteboard'

  const emit = defineEmits(['add', 'delete'])

  const props = defineProps({
    writer: {
      type: Object as PropType<Employee>,
      default: () => {}
    },
    tasks: {
      type: Array as PropType<TaskLanguage[]>,
      default: () => []
    }
  })

  const base = useBase()
  const { t } = useI18n()

  const showArticles = ref(false)

  const toggleSowArticle = () => {
    showArticles.value = !showArticles.value
  }

  const dragEnterStatus = ref(false)
  const classes = computed(() => {
    return [
      'whiteboard-writer',
      {
        'whiteboard-writer_show': showArticles.value,
        'whiteboard-writer_dragenter': dragEnterStatus.value
      }
    ]
  })

  const roleNames = {
    REDACTOR: t('redactor'),
    WRITER: t('writer')
  } as any

  const dragEnter = () => {
    dragEnterStatus.value = true
  }
  const dragLeave = () => {
    dragEnterStatus.value = false
  }

  const dropPlaceholderOptions = {
    className: 'drop-preview',
    animationDuration: '150',
    showOnTop: false
  }

  const getPayload = (index: number) => {
    return props.tasks[index]
  }

  const onDrop = (dropResult: DropResult) => {
    dragLeave()
    if (dropResult.removedIndex !== null) {
      emit('delete', dropResult.payload)
    }
    if (dropResult.addedIndex !== null) {
      emit('add', dropResult.payload)
    }
  }

  const tasksCount = computed((): TasksCount => {
    return props.tasks.reduce(
      (count: TasksCount, task: TaskLanguage) => {
        switch (task.status) {
          case ARTICLE_STATUS.WRITING:
            count.writing++
            break
          case ARTICLE_STATUS.WAITING:
            count.waiting++
            break
        }
        return count
      },
      { writing: 0, waiting: 0 }
    )
  })

  const computeHoursDifference = (dateString: string) => {
    const givenDate: any = new Date(dateString)
    const currentDate: any = new Date()
    const difference = currentDate - givenDate

    const hours = Math.floor(difference / (60 * 60 * 1000))

    return hours
  }

  const computeIsNew = (date: string) => {
    return computeHoursDifference(date) <= 24
  }
  const computeIsDanger = (date: string) => {
    return computeHoursDifference(date) >= 48
  }
</script>

<template>
  <Container
    :class="classes"
    :get-child-payload="getPayload"
    @drop="onDrop"
    @drag-enter="dragEnter"
    @drag-leave="dragLeave"
    behaviour="drop-zone"
    group-name="task"
    :drop-placeholder="dropPlaceholderOptions"
  >
    <button @click="toggleSowArticle" class="whiteboard-writer__info">
      <div class="whiteboard-writer__content">
        <div class="whiteboard-writer__avatar">
          <img v-if="writer.path" :src="base.baseURL + writer.path" :alt="writer.name" />
          <div v-else>{{ writer.name[0]?.toLocaleUpperCase() }}{{ writer.surname[0]?.toLocaleUpperCase() }}</div>
        </div>
        <div class="whiteboard-writer__user-info">
          <div class="whiteboard-writer__username">{{ writer.name }} {{ writer.surname }}</div>
          <div class="whiteboard-writer__role">{{ roleNames[writer.job_title] }}</div>
        </div>
      </div>
      <div class="whiteboard-writer__articles-statuses">
        <div class="whiteboard-writer__articles-status whiteboard-writer__articles-status_writing">
          <icon name="clock" />
          <p>{{ tasksCount.writing }}</p>
        </div>
        <div class="whiteboard-writer__articles-status whiteboard-writer__articles-status_waiting">
          <icon name="doneAll" />
          <p>{{ tasksCount.waiting }}</p>
        </div>
      </div>
      <div class="whiteboard-writer__arrow">
        <icon name="chevronDown" />
      </div>
    </button>
    <div class="whiteboard-writer__articles-box">
      <Container
        :get-child-payload="getPayload"
        @drop="onDrop"
        @drag-enter="dragEnter"
        @drag-leave="dragLeave"
        class="whiteboard-writer__articles-list"
        group-name="task"
        :drop-placeholder="dropPlaceholderOptions"
      >
        <Draggable v-for="task in tasks" class="whiteboard-writer__article">
          <task-item :item="task" :new="computeIsNew(task.created_at)" :danger="computeIsDanger(task.created_at)" />
        </Draggable>
      </Container>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
  .whiteboard-writer {
    // .whiteboard-writer_show
    &_show {
      .whiteboard-writer__info {
        border: 1px solid #f0f0f0;
      }
      .whiteboard-writer__articles-box {
        display: block;
      }
      .whiteboard-writer__arrow {
        transform: rotate(180deg);
      }
    }
    &:hover {
      .whiteboard-writer__info {
        border: 1px solid #f0f0f0;
      }
    }
    // .whiteboard-writer_dragenter
    &_dragenter {
      .whiteboard-writer__info {
        border: 1px solid var(--dark) !important;
      }
      .whiteboard-writer__articles-box {
        border: 1px solid var(--dark) !important;
      }
    }

    // .whiteboard-writer__info
    &__info {
      width: 100%;
      border-radius: var(--border-radius);
      border: 1px solid #f7f7f7;
      background: #f7f7f7;
      display: flex;
      align-items: center;
      padding: 3px 9px;
    }
    // .whiteboard-writer__content
    &__content {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1 1;
      width: 0;
      padding-right: 4px;
    }
    // .whiteboard-writer__avatar
    &__avatar {
      width: 36px;
      min-width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      background: #eaeaea;
      border: 1px solid #dedede;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    // .whiteboard-writer__user-info
    &__user-info {
      text-align: left;
    }
    // .whiteboard-writer__username
    &__username {
      color: var(--text);
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    // .whiteboard-writer__role
    &__role {
      color: var(--text);
      font-size: 11px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    // .whiteboard-writer__articles-statuses
    &__articles-statuses {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    // .whiteboard-writer__articles-status
    &__articles-status {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 4px;
      border-radius: var(--border-radius);
      background: #eaeaea;
      border: 1px solid #dedede;
      margin-right: 4px;
      &:deep(.icon) {
        svg {
          width: 16px;
          height: 16px;
        }
      }
      p {
        color: var(--text);
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.4px;
        width: 20px;
      }
      // .whiteboard-writer__articles-status_writing
      &_writing {
        background: #fff2ea;
      }
      // .whiteboard-writer__articles-status_waiting
      &_waiting {
        background: #ebf6ff;
      }
    }
    // .whiteboard-writer__arrow
    &__arrow {
      color: var(--dark);
      &:deep(.icon) {
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    // .whiteboard-writer__articles-box
    &__articles-box {
      margin-top: 4px;
      display: none;
      border-radius: 4px;
      border: 1px solid #f0f0f0;
      background: #f9f9f9;
      padding: 5px 9px;
      width: 100%;
    }
    // .whiteboard-writer__articles-list
    &__articles-list {
      width: 100%;
      min-height: 50px;
      :deep() {
        .smooth-dnd-stretcher-element {
          width: 100%;
          height: 40px !important;
        }
        .smooth-dnd-drop-preview-constant-class {
          position: relative;
          padding-top: 2px;
          height: auto !important;
          &::before {
            content: '';
            display: block;
            background-color: var(--gray-5);
            border: 1px dashed #ccc;
            height: 36px;
            width: 100%;
            border-radius: var(--border-radius);
          }
        }

        .smooth-dnd-draggable-wrapper {
          overflow: revert !important;
        }
      }
    }
    // .whiteboard-writer__article
    &__article {
      &:not(:first-child) {
        padding-top: 2px;
      }
    }
  }
</style>
