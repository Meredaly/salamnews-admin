import { API } from '@/api'

export const GET_ARTICLE = ({ uuid }: any) => API({ url: `/api/v1/admin/news/news/${uuid}`, method: 'GET' })

export const UPDATE_ARTICLE = ({ data }: any) => API({ url: `/api/v1/admin/news/news`, data, method: 'POST' })

export const GET_CONTENT = ({ uuid }: any) => API({ url: `/api/v1/admin/news/content/${uuid}`, method: 'GET' })

export const UPDATE_CONTENT = ({ data }: any) => API({ url: `/api/v1/admin/news/content`, data, method: 'POST' })

export const UPDATE_STATUS = ({ data }: any) => API({ url: `/api/v1/admin/news/news`, data, method: 'PUT' })

export const UPLOAD_VIDEO = ({ data, onUploadProgress }: any) =>
  API({ url: `/api/v1/admin/news/video`, data, method: 'POST', onUploadProgress, isFormData: true })

export const UPLOAD_CONTENT_VIDEO = ({ data, onUploadProgress }: any) =>
  API({ url: `/api/v1/admin/content-news/video`, data, method: 'POST', onUploadProgress, isFormData: true })
