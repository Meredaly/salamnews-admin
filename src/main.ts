import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player'
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css'

import { i18n } from '@/plugins/i18n'
import router from '@/router'

import '@/modules'

import App from '@/App.vue'

const app = createApp(App)

const pinia = createPinia()

app.use(Vue3VideoPlayer)
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
