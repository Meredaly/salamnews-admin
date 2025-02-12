import { API } from '@/api'

export const GET_ARTICLE = ({ uuid }: any) => API({ url: `/api/v1/admin/article/article/${uuid}`, method: 'GET' })

export const UPDATE_ARTICLE = ({ data }: any) => API({ url: `/api/v1/admin/article/article`, data, method: 'POST' })

export const GET_CONTENT = ({ uuid }: any) => API({ url: `/api/v1/admin/article/content/${uuid}`, method: 'GET' })

export const UPDATE_CONTENT = ({ data }: any) => API({ url: `/api/v1/admin/article/content`, data, method: 'POST' })

export const UPDATE_STATUS = ({ data }: any) => API({ url: `/api/v1/admin/article/article`, data, method: 'PUT' })

export const UPLOAD_VIDEO = ({ data, onUploadProgress }: any) =>
  API({ url: `/api/v1/admin/article/video`, data, method: 'POST', onUploadProgress, isFormData: true })

export const UPLOAD_CONTENT_VIDEO = ({ data, onUploadProgress }: any) =>
  API({ url: `/api/v1/admin/article-content/video`, data, method: 'POST', onUploadProgress, isFormData: true })

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/article-photo', data, isFormData: true, method: 'POST' })
