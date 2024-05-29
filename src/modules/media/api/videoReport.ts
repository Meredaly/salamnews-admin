import { API } from '@/api'

export const ADD_DRAFT = ({ data }: any) => API({ url: `/api/v1/admin/media/video-workplace`, data, method: 'POST' })

export const GET_VIDEO_REPORTS = ({ params }: any) =>
  API({ url: `/api/v1/admin/media/video-report-by-status`, params, method: 'GET' })

export const GET_VIDEO_REPORT = ({ uuid }: any) =>
  API({ url: `/api/v1/admin/media/video-report/${uuid}`, method: 'GET' })

export const UPDATE_VIDEO_REPORT = ({ data }: any) =>
  API({ url: `/api/v1/admin/media/video-report`, data, method: 'POST' })

export const UPDATE_VIDEO_STATUS = ({ data }: any) =>
  API({ url: `/api/v1/admin/media/video-report-update-status`, data, method: 'PUT' })

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/video-report-photo', data, isFormData: true, method: 'POST' })

export const UPLOAD_VIDEO = ({ data, onUploadProgress }: any) =>
  API({ url: `/api/v1/admin/video-report/video`, data, method: 'POST', onUploadProgress, isFormData: true })

export const DELETE_VIDEO_REPORT = ({ uuid }: any) =>
  API({ url: `/api/v1/admin/media/video-report/${uuid}`, method: 'DELETE' })
