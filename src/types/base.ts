export interface MenuItem {
  id: number | string
  icon: string
  link: string
  title: string
  permissions: string[]
}
export interface Tab {
  uuid: string
  title: string
  count?: number
}
export interface ActionMenu {
  uuid: number | string
  icon?: string
  title: string
}

export type TabRoutes = {
  [key: string]: string
}

export interface Category {
  uuid: string
  name_tm: string
  name_ru: string
  name_en?: string
  category_slug: string
  position: number
  sub_categories: Category[]
}

export interface CategoryForm {
  name_tm: string
  name_ru: string
  name_en?: string
  category_slug: string
  parent_id?: string | null
  position: number
}

export type InformationItem = { key: string; value: string }
export type InformationList = InformationItem[]

export interface Menu {
  id: number
  title: string
}
