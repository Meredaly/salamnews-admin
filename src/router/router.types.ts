import type { VueElement } from 'vue'
import type { LayoutsEnum } from '@/layouts/layouts.types'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutsEnum
    layoutComponent?: VueElement
  }
}
