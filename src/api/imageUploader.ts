import { API } from '@/api'

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/news-photo', data, isFormData: true, method: 'POST' })
