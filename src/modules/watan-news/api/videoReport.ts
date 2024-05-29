import { API } from '@/api'

export const ADD_DRAFT = ({ data }: any) =>
  API({ url: `/api/v1/admin/watan/watan-news-workplace`, data, method: 'POST' })

export const GET_WATAN_NEWS = ({ params }: any) =>
  API({ url: `/api/v1/admin/watan/watan-news-by-status`, params, method: 'GET' })

export const UPDATE_WATAN = ({ data }: any) => API({ url: `/api/v1/admin/watan/watan-news`, data, method: 'POST' })

export const GET_WATAN = ({ uuid }: any) => API({ url: `/api/v1/admin/watan/watan-news/${uuid}`, method: 'GET' })

export const UPDATE_WATAN_STATUS = ({ data }: any) =>
  API({ url: `/api/v1/admin/watan/watan-news-update-status`, data, method: 'PUT' })

export const UPLOAD_VIDEO = ({ data, onUploadProgress }: any) =>
  API({ url: `/api/v1/admin/watan-news/video`, data, method: 'POST', onUploadProgress, isFormData: true })

export const DELETE_WATAN = ({ uuid }: any) => API({ url: `/api/v1/admin/watan/watan-news/${uuid}`, method: 'DELETE' })

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/watan-news-photo', data, isFormData: true, method: 'POST' })
