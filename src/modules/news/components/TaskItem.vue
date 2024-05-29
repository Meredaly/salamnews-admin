<script setup lang="ts">
  import { PropType, computed } from 'vue'

  import Icon from '@/UI/Icon'

  import TaskInfo from '@/components/TaskInfo.vue'

  const props = defineProps({
    item: {
      type: Object as PropType<any>,
      default: () => {}
    },
    new: { type: Boolean, default: false },
    danger: { type: Boolean, default: false }
  })

  const getStatusClass = () => {
    const statuses: { [key: string]: string } = {
      WAITING: 'whiteboard-task-item__status_waiting',
      WRITING: 'whiteboard-task-item__status_writing',
      PLANNING: 'whiteboard-task-item__status_planning',
      EMPTY: ''
    }
    return statuses[props.item.status]
  }

  const getStatusIcon = () => {
    const statuses: { [key: string]: string } = {
      WAITING: 'doneAll',
      WRITING: 'clock',
      PLANNING: 'clock',
      EMPTY: ''
    }
    return statuses[props.item.status]
  }

  const classes = computed(() => {
    return [
      'whiteboard-task-item',
      {
        'whiteboard-task-item_new': props.new,
        'whiteboard-task-item_danger': props.danger
      }
    ]
  })
</script>

<template>
  <div :class="classes">
    <div class="whiteboard-task-item__info">
      <task-info :info="item.info" :new="props.new" :danger="props.danger" />
    </div>
    <div class="whiteboard-task-item__slug">{{ item.slug }}</div>
    <div :class="['whiteboard-task-item__status', getStatusClass()]">
      <icon v-if="getStatusIcon()" :name="getStatusIcon()" />
      <p>{{ item.lang }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .whiteboard-task-item {
    display: flex;
    align-items: center;
    padding: 4px 6px;
    border-radius: var(--border-radius);
    width: 240px;
    min-width: 240px;
    background: #eee;
    cursor: pointer;
    position: relative;
    border: 1px solid #dedede;
    &:hover {
      z-index: 2;
    }

    // .whiteboard-task-item_new
    &_new {
      background: #f4faff;
    }
    // .whiteboard-task-item_danger
    &_danger {
      background: #feefef;
    }
    // .whiteboard-task-item__info
    &__info {
      width: 20px;
      height: 20px;
      position: relative;
      z-index: 1;
    }
    // .whiteboard-task-item__slug
    &__slug {
      padding-left: 9px;
      padding-right: 14px;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      height: 18px;
      letter-spacing: 0.4px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      flex: 1 1;
    }
    // .whiteboard-task-item__status
    &__status {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 3px;
      border-radius: var(--border-radius);
      background: #eaeaea;
      border: 1px solid #dedede;
      margin-right: -2px;
      &:deep(.icon) {
        svg {
          width: 16px;
          height: 16px;
        }
      }
      p {
        color: var(--text);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.4px;
        width: 30px;
        text-align: center;
      }
      // .whiteboard-task__status_writing
      &_writing {
        background: #fff2ea;
      }
      // .whiteboard-task__status_planning
      &_planning {
        background: #effee8;
      }
      // .whiteboard-task__status_waiting
      &_waiting {
        background: #ebf6ff;
      }
    }
  }
</style>
