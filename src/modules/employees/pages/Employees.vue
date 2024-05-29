<script setup lang="ts">
  import { ref, reactive, watch, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import STextField from '@/UI/STextField.vue'
  import SButton from '@/UI/SButton.vue'
  import STabBar from '@/UI/STabBar.vue'

  import EmployeeHorizontal from '../components/EmployeeHorizontal.vue'

  import { DELETE_EMPLOYEE, GET_EMPLOYEES } from '../api/employee'

  import { Tab } from '@/types/base'
  import { Employee } from '../types/employee'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const tabs = computed<Tab[]>(() => [
    { uuid: 'WRITER', title: t('writer') },
    { uuid: 'REDACTOR', title: t('redactor') },
    { uuid: 'MODERATOR', title: t('moderator') }
  ])

  const activeTab = ref<Tab>(tabs.value[0])
  const selectTab = (tab: Tab) => {
    activeTab.value = tab
    params.job_title = tab.uuid
    pushByParams()
  }

  const openAddEmployee = () => {
    router.push('/employees/employee/new')
  }

  const params = reactive({
    search: '',
    job_title: ''
  })

  const employees = ref<Employee[]>([])
  const getEmployees = async () => {
    try {
      const { data } = await GET_EMPLOYEES({
        params: params
      })
      employees.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  const deleteEmployee = async (uuid: string) => {
    try {
      await DELETE_EMPLOYEE({ id: uuid })
    } catch (error) {
      console.error(error)
    }
  }

  const selectEmployeeAction = async (action: String, index: number) => {
    if (action === 'UPDATE') {
      router.push(`/employees/employee/${employees.value[index].uuid}`)
    }
    if (action === 'DELETE') {
      await deleteEmployee(employees.value[index].uuid)
      employees.value = employees.value.slice(index, 1)
    }
  }

  const searchInterval = ref<number | null>(null)
  const search = (text: string) => {
    params.search = text

    if (searchInterval.value) clearTimeout(searchInterval.value)
    searchInterval.value = setTimeout(() => {
      pushByParams()
    }, 500)
  }

  const pushByParams = () => {
    router.push({
      path: '/employees/list',
      query: params
    })
  }

  const getDataByRouteFilter = () => {
    const query = route.query

    params.search = query.search?.toString() || ''
    params.job_title = query.job_title?.toString() || activeTab.value?.uuid

    getEmployees()
  }

  watch(
    () => route.fullPath,
    () => {
      getDataByRouteFilter()
    },
    { immediate: true }
  )
</script>

<template>
  <div class="employees">
    <div class="employees__head">
      <div class="employees__title _page-title">{{ t('employeesList') }}</div>
      <div class="employees__controllers">
        <s-text-field
          @update-value="search"
          v-model="params.search"
          prev-icon="search"
          :placeholder="t('search')"
          small
          width="240px"
        />
        <s-button @click="openAddEmployee" :title="t('addEmployee')" prev-icon="moreEdit" />
      </div>
    </div>
    <div class="employees__tabs">
      <s-tab-bar @select-tab="selectTab" :tabs="tabs" :activeTab="activeTab" />
    </div>
    <div class="employees__body">
      <div class="employees__list">
        <div v-for="(employee, index) in employees" :key="employee.uuid" class="employees__item">
          <employee-horizontal @select-action="(action) => selectEmployeeAction(action, index)" :employee="employee" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .employees {
    width: 900px;
    // .employees__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0 10px 10px;
    }
    // .employees__title
    &__title {
    }
    // .employees__controllers
    &__controllers {
      display: flex;
      gap: 10px;
    }
    // .employees__tabs
    &__tabs {
      margin-top: 10px;
    }
    // .employees__body
    &__body {
      padding-left: 6px;
      padding-top: 20px;
    }
    // .employees__list
    &__list {
    }
    // .employees__item
    &__item {
    }
  }
</style>
