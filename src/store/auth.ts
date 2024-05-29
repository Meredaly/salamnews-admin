import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

import { GET_PROFILE } from '@/api/auth.api'

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    isAuth: false,
    user: {
      uuid: '',
      name: '',
      surname: '',
      login: '',
      password: '',
      job_title: '',
      path: '',
      description: ''
    }
  }),
  getters: {
    getUser(): any {
      return this.user
    }
  },
  actions: {
    async fetchUser(): Promise<void> {
      try {
        const { cookies } = useCookies()
        if (cookies.get('Authorization')) {
          const { data } = await GET_PROFILE()
          this.isAuth = true
          this.user = data
        }
      } catch (error) {
        console.error(error)
      }
    },
    logOut() {
      this.isAuth = false
      this.user = {
        uuid: '',
        name: '',
        surname: '',
        login: '',
        password: '',
        job_title: '',
        path: '',
        description: ''
      }
      const { cookies } = useCookies()
      cookies.remove('Authorization')
    }
  }
})
