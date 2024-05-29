import { API } from '@/api'

export const ADD_DRAFT = ({ data }: any) =>
  API({ url: `/api/v1/admin/media/video-shorts-workplace`, data, method: 'POST' })

export const GET_SHORTS = ({ params }: any) =>
  API({ url: `/api/v1/admin/media/video-shorts-by-status`, params, method: 'GET' })

export const UPDATE_SHORT = ({ data }: any) => API({ url: `/api/v1/admin/media/video-shorts`, data, method: 'POST' })

export const UPDATE_SHORT_STATUS = ({ data }: any) =>
  API({ url: `/api/v1/admin/media/video-shorts-update-status`, data, method: 'PUT' })

export const GET_SHORT = ({ uuid }: any) => API({ url: `/api/v1/admin/media/video-shorts/${uuid}`, method: 'GET' })

export const UPLOAD_VIDEO = ({ data, onUploadProgress }: any) =>
  API({ url: `/api/v1/admin/video-shorts/video`, data, method: 'POST', onUploadProgress, isFormData: true })

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/video-shorts-photo', data, isFormData: true, method: 'POST' })

export const DELETE_SHORT_VIDEO = ({ uuid }: any) =>
  API({ url: `/api/v1/admin/media/video-shorts/${uuid}`, method: 'DELETE' })
