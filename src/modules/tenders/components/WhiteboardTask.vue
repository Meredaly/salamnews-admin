<script setup lang="ts">
  import { computed } from 'vue'
  import { Container, Draggable } from 'vue3-smooth-dnd'

  import TaskInfo from '@/components/TaskInfo.vue'
  import TaskItem from './TaskItem.vue'

  const props = defineProps({
    task: { type: Object, default: () => {} },
    new: { type: Boolean, default: false },
    danger: { type: Boolean, default: false }
  })

  const classes = computed(() => {
    return [
      'whiteboard-task',
      {
        'whiteboard-task_new': props.new,
        'whiteboard-task_danger': props.danger,
        _l_1: props.task.langs.length === 1,
        _l_2: props.task.langs.length === 2,
        _l_3: props.task.langs.length === 3
      }
    ]
  })

  const langClasses = (status: string, index: number) => {
    return [
      'whiteboard-task__lang',
      {
        'whiteboard-task__lang_distributed': status === 'EMPTY',
        'whiteboard-task__lang_second': index === 1,
        'whiteboard-task__lang_third': index === 2
      }
    ]
  }

  const getPayload = (index: number) => {
    return props.task.langs[index]
  }
</script>

<template>
  <div :class="classes">
    <div class="whiteboard-task__wrapper">
      <div class="whiteboard-task__main">
        <div class="whiteboard-task__info">
          <task-info :info="task.info" :new="props.new" :danger="props.danger" />
        </div>
        <div class="whiteboard-task__slug">{{ task.slug }}</div>
      </div>
      <Container
        :get-child-payload="getPayload"
        behaviour="copy"
        drag-class="smooth-dnd-ghost"
        group-name="task"
        class="whiteboard-task__langs"
      >
        <Draggable v-for="(taskLang, index) in task.langs" :class="langClasses(taskLang.status, index)">
          <task-item :item="taskLang" :new="props.new" :danger="props.danger" />
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .whiteboard-task {
    border-radius: var(--border-radius);
    width: fit-content;
    min-width: 340px;
    position: relative;
    width: calc(100% - 192px);
    &:hover {
      z-index: 5;
    }

    &._l_1 {
      .whiteboard-task__lang:not(:nth-child(1)) {
        &:deep() {
          .whiteboard-task-item {
            border-right: none;
            border-radius: 0;
          }
        }
      }
    }
    &._l_2 {
      .whiteboard-task__lang:not(:nth-child(2)) {
        &:deep() {
          .whiteboard-task-item {
            border-right: none;
            border-radius: 0;
          }
        }
      }
    }
    &._l_3 {
      .whiteboard-task__lang:not(:nth-child(3)) {
        &:deep() {
          .whiteboard-task-item {
            border-right: none;
            border-radius: 0;
          }
        }
      }
    }
    // .whiteboard-task_new
    &_new {
      .whiteboard-task__main {
        background: #f4faff;
      }
    }
    // .whiteboard-task_danger
    &_danger {
      .whiteboard-task__main {
        background: #feefef;
      }
    }
    // .whiteboard-task__wrapper
    &__wrapper {
      display: flex;
    }
    // .whiteboard-task__main
    &__main {
      display: flex;
      align-items: center;
      padding: 6px;
      position: relative;
      z-index: 4;
      background: #eee;
      width: 100%;
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      border: 1px solid #dedede;
      border-right: none;
    }
    // .whiteboard-task__info
    &__info {
      width: 20px;
      height: 20px;
    }
    // .whiteboard-task__slug
    &__slug {
      padding-left: 6px;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      height: 20px;
      letter-spacing: 0.4px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    // .whiteboard-task__langs
    &__langs {
      display: flex;
      align-items: center;
      min-width: auto;
    }
    // .whiteboard-task__lang
    &__lang {
      margin-left: -176px;
      z-index: 3;
      // .whiteboard-task__lang_distributed
      &_distributed {
        margin-left: -196px;
      }
      // .whiteboard-task__lang_second
      &_second {
        z-index: 2;
      }
      // .whiteboard-task__lang_third
      &_third {
        z-index: 1;
      }
    }
  }
</style>

<style>
  .smooth-dnd-ghost {
    margin-left: 0 !important;
    border-radius: var(--border-radius) !important;
    border: 1px solid #dedede !important;
  }
</style>
