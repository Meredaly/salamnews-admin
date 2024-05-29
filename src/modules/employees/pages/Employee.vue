<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import SButton from '@/UI/SButton.vue'
  import STextField from '@/UI/STextField.vue'
  import SDropdown from '@/UI/SDropdown.vue'

  import { useBase } from '@/store/base'

  import { ActionMenu } from '@/types/base'
  import { EmployeeForm } from '../types/employee'

  import { ADD_EMPLOYEE, ADD_EMPLOYEE_IMAGE, GET_EMPLOYEE, UPDATE_EMPLOYEE } from '../api/employee'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const base = useBase()

  const back = () => {
    router.go(-1)
  }

  const employee = ref<EmployeeForm>({
    name: '',
    surname: '',
    login: '',
    description: '',
    password: '',
    job_title: 'WRITER',
    path: ''
  })
  const showPassword = ref(false)
  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }

  const jobTitles = computed<ActionMenu[]>(() => [
    { uuid: 'WRITER', title: t('writer') },
    { uuid: 'REDACTOR', title: t('redactor') },
    { uuid: 'MODERATOR', title: t('moderator') }
  ])

  const selectJobTitle = (jobTitle: ActionMenu) => {
    employee.value.job_title = jobTitle.uuid.toString()
  }

  const deleteJobTitle = () => {
    employee.value.job_title = ''
  }

  const selectedJobTitle = computed(
    () => jobTitles.value.find((jobTitle) => jobTitle.uuid === employee.value.job_title) || null
  )

  const imageFile = ref<File | null>(null)
  const imagePreview = ref<string>('')
  const imageRef = ref<HTMLInputElement | null>(null)
  const changeImage = (event: Event) => {
    const files: FileList | null = (event.target as HTMLInputElement).files
    if (files) {
      imageFile.value = files[0]
      imagePreview.value = URL.createObjectURL(files[0])
      if (imageRef.value) {
        imageRef.value.value = ''
      }
    }
  }
  const addEmployeeImage = async () => {
    const { data } = await ADD_EMPLOYEE_IMAGE({
      data: {
        file: imageFile.value
      }
    })
    employee.value.path = data
  }

  const saveEmployee = async () => {
    try {
      if (imageFile.value) await addEmployeeImage()
      if (route.params.id !== 'new') {
        await UPDATE_EMPLOYEE({ id: route.params.id, data: employee.value })
      } else {
        await ADD_EMPLOYEE({ data: employee.value })
      }
      back()
    } catch (error) {
      console.error(error)
    }
  }

  const getEmployee = async () => {
    try {
      const { data } = await GET_EMPLOYEE({ id: route.params.id })
      employee.value = {
        name: data.name,
        surname: data.surname,
        description: data.description,
        login: data.login,
        password: '',
        job_title: data.job_title,
        path: ''
      }
      imagePreview.value = data.path ? `${base.baseURL}${data.path}` : ''
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    if (route.params.id !== 'new') {
      getEmployee()
    }
  })
</script>

<template>
  <div class="employee">
    <div class="employee__wrapper">
      <div class="employee__head">
        <button @click="back" class="employee__back">
          <icon name="chevronLeft" />
          <p class="_page-title">{{ t('back') }}</p>
        </button>
        <div class="employee__save">
          <s-button @click="saveEmployee" prev-icon="check" :title="t('save')" />
        </div>
      </div>
      <div class="employee__body">
        <div class="employee__avatar">
          <img v-if="imagePreview" :src="imagePreview" />
          <label class="employee__avatar-update">
            <input @change="changeImage" type="file" accept="image/*" ref="imageRef" />
            <icon name="addCircle" />
          </label>
        </div>
        <div class="employee__info">
          <div class="employee__info-box">
            <s-text-field v-model="employee.name" :label="t('name')" />
          </div>
          <div class="employee__info-box">
            <s-text-field v-model="employee.surname" :label="t('surname')" />
          </div>
          <div class="employee__info-box">
            <s-dropdown
              @select-item="selectJobTitle"
              @clear="deleteJobTitle"
              :selected-item="selectedJobTitle"
              :menu="jobTitles"
              :label="t('jobTitle')"
            />
          </div>
          <div class="employee__info-box"></div>
          <div class="employee__info-box employee__info-box_big">
            <s-text-field v-model="employee.description" :label="t('description')" />
          </div>
          <div class="employee__info-box">
            <s-text-field v-model="employee.login" :label="t('login')" />
          </div>
          <div class="employee__info-box">
            <s-text-field
              @click:append="togglePassword"
              v-model="employee.password"
              :label="t('password')"
              :append-icon="showPassword ? 'eyeOff' : 'eye'"
              :type="showPassword ? 'text' : 'password'"
              isAppendClickable
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .employee {
    width: 900px;

    // .employee__wrapper
    &__wrapper {
    }
    // .employee__head
    &__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
    }
    // .employee__back
    &__back {
      display: flex;
      padding: 10px;
      display: flex;
      gap: 10px;
      align-items: center;
      background-color: transparent;
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .employee__save
    &__save {
    }
    // .employee__body
    &__body {
      display: flex;
      gap: 10px;
      padding: 25px 18.5px;
    }
    // .employee__avatar
    &__avatar {
      width: 180px;
      min-width: 180px;
      height: 180px;
      position: relative;
      border-radius: 50%;
      background-color: var(--gray-5);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 50%;
      }
    }
    // .employee__avatar-update
    &__avatar-update {
      cursor: pointer;
      right: 0;
      bottom: 0;
      position: absolute;
      padding: 5px;
      background-color: var(--white);
      border-radius: 50%;
      z-index: 1;
      input {
        display: none;
      }
      &:deep() {
        .icon {
          svg {
            width: 40px;
            height: 40px;
          }
        }
      }
    }

    // .employee__info
    &__info {
      flex: 1 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px 17px;
      padding-top: 15px;
    }
    // .employee__info-box
    &__info-box {
      &_big {
        grid-column-start: span 2;
      }
    }
  }
</style>
