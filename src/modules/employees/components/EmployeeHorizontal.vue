<script setup lang="ts">
  import { PropType, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import DropdownDots from '@/UI/DropdownDots.vue'

  import { useBase } from '@/store/base'

  import { ActionMenu } from '@/types/base'
  import { Employee } from '../types/employee'

  const emit = defineEmits(['selectAction'])

  const props = defineProps({
    employee: {
      type: Object as PropType<Employee>,
      default: {}
    }
  })

  const router = useRouter()
  const base = useBase()
  const { t } = useI18n()

  const actions = computed<ActionMenu[]>(() => [
    { uuid: 'UPDATE', icon: 'moreEdit', title: t('edit') },
    { uuid: 'DELETE', icon: 'delete', title: t('delete') }
  ])

  const openEmployee = () => {
    router.push(`/employees/employee/${props.employee.uuid}`)
  }
  const selectAction = (action: ActionMenu) => {
    emit('selectAction', action.uuid)
  }
</script>

<template>
  <div class="employee">
    <div @click="openEmployee" class="employee__image">
      <div class="_box">
        <img v-if="employee.path" :src="base.baseURL + employee.path" :alt="employee.name" />
        <div v-else class="employee__avatar">
          {{ employee.name[0]?.toLocaleUpperCase() }} {{ employee.surname[0]?.toLocaleUpperCase() }}
        </div>
      </div>
    </div>
    <div @click="openEmployee" class="employee__info">
      <div class="employee__name">{{ employee.name }} {{ employee.surname }}</div>
      <div class="employee__description">{{ employee.description }}</div>
    </div>
    <div class="employee__action">
      <dropdown-dots @select-item="selectAction" :menu="actions" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .employee {
    display: flex;
    align-items: center;
    border-radius: var(--border-radius);
    gap: 6px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
    // .employee__image
    &__image {
      padding: 10px 0 10px 30px;
      ._box {
        width: 60px;
        height: 60px;
        background-color: var(--gray-5);

        // background-color: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
        object-fit: cover;
        object-position: center;
      }
    }
    // .employee__info
    &__info {
      flex: 1 1;
      color: var(--text);
      padding: 10px 0;
    }
    // .employee__name
    &__name {
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    // .employee__avatar
    &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // .employee__description
    &__description {
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-top: 4px;
    }
    // .employee__action
    &__action {
      padding: 10px 30px 10px 0;
    }
  }
</style>
