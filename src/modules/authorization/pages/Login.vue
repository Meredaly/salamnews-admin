<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useCookies } from 'vue3-cookies'
  import { useRouter } from 'vue-router'

  import STextField from '@/UI/STextField.vue'
  import SButton from '@/UI/SButton.vue'

  import { AUTHORIZATION } from '../api'

  const { cookies } = useCookies()
  const router = useRouter()

  const form = reactive({
    login: '',
    password: ''
  })

  const loading = ref(false)
  const errorForm = ref(false)
  const login = async () => {
    try {
      loading.value = true
      errorForm.value = false
      const { data: token, status } = await AUTHORIZATION({
        data: form
      })
      if (status === false) {
        errorForm.value = true
        loading.value = false
        return
      }

      cookies.set('Authorization', token, 100000000)
      router.push('/news/workplace/drafts')
    } catch (error) {
      errorForm.value = true
      loading.value = false
      console.error(error)
    }
  }

  const passwordVisibility = ref(false)
  const togglePasswordVisibility = () => {
    passwordVisibility.value = !passwordVisibility.value
  }
</script>

<template>
  <div class="login">
    <div class="login__wrapper">
      <div class="login__box">
        <div class="login__logo">
          <img src="@/assets/images/logo.svg" />
        </div>
        <form @submit.prevent="login" class="login__form">
          <div class="login__login">
            <s-text-field v-model="form.login" :error="errorForm" label="Логин" :disabled="loading" />
          </div>
          <div class="login__password">
            <s-text-field
              v-model="form.password"
              :error="errorForm"
              :disabled="loading"
              :type="passwordVisibility ? 'text' : 'password'"
              :appendIcon="passwordVisibility ? 'eye' : 'eyeOff'"
              @click:append="togglePasswordVisibility"
              label="Пароль"
              isAppendClickable
            />
          </div>
          <div class="login__button">
            <s-button title="Войти" type="submit" block large :loading="loading" :disabled="loading" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login {
    // .login__wrapper
    &__wrapper {
      width: 100%;
      min-height: 100vh;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
    }
    // .login__box
    &__box {
      width: 408px;
      padding: 40px;
      background-color: var(--white);
      border-radius: 20px;
    }
    // .login__logo
    &__logo {
      display: flex;
      justify-content: center;
      img {
        width: 129px;
        height: 37.229px;
      }
    }
    // .login__form
    &__form {
      margin-top: 20px;
    }
    // .login__login
    &__login {
    }
    // .login__password
    &__password {
      margin-top: 10px;
    }
    // .login__button
    &__button {
      margin-top: 20px;
    }
  }
</style>
