export type TabRoutes = {
  [key: string]: string
}

export type InformationItem = { key: string; value: string }
export type InformationList = InformationItem[]

export interface Banner {
  uuid: string
  type: string
  title: string
  image_web: string | null
  image_mobile: string | null
  image_alternative: string | null
  url: string | null
  visibility: boolean
  start_date: string | null
  end_date: string | null
}
