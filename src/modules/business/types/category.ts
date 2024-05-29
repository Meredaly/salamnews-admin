export interface Category {
  uuid: string
  name_tm: string
  name_ru: string
  name_en: string
  category_slug: string
  position: number
  sub_categories: Category[]
}

export interface CategoryDropResult {
  removedIndex: number
  addedIndex: number
  payload: null
}

export interface CategoryForm {
  name_tm: string
  name_ru: string
  name_en: string
  parent_id: string | null
  position: number
}
