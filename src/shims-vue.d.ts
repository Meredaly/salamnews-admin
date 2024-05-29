declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'vue-i18n' {
  import { createI18n, useI18n } from 'vue-i18n'
  export { createI18n, useI18n }
}

declare module 'vue3-smooth-dnd' {
  import { Container, Draggable } from 'vue3-smooth-dnd'
  export { Container, Draggable }
}

declare module '@cloudgeek/playcore-hls'
declare module '@cloudgeek/vue3-video-player'
