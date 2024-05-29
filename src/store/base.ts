import { defineStore } from 'pinia'

export const useBase = defineStore({
  id: 'base',
  state: () => ({
    baseURL: import.meta.env.VITE_APP_BASE_URL
  }),
  getters: {},
  actions: {}
})
