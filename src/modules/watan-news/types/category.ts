export interface Category {
  uuid: string
  name_tm: string
  name_ru: string
  position: number
}

export interface CategoryDropResult {
  removedIndex: number
  addedIndex: number
  payload: null
}

export interface CategoryForm {
  name_tm: string
  name_ru: string
  position: number
}
