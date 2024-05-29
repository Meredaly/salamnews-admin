import { API } from '@/api'

export const ADD_DRAFT = ({ data }: any) => API({ url: `/api/v1/admin/media/photo-workplace`, data, method: 'POST' })

export const UPDATE_PHOTO_REPORT = ({ data }: any) =>
  API({ url: `/api/v1/admin/media/photo-report`, data, method: 'POST' })

export const GET_PHOTO_REPORT = ({ uuid }: any) =>
  API({ url: `/api/v1/admin/media/photo-report/${uuid}`, method: 'GET' })

export const DELETE_PHOTO_REPORT = ({ uuid }: any) =>
  API({ url: `/api/v1/admin/media/photo-report/${uuid}`, method: 'DELETE' })

export const UPDATE_PHOTO_REPORT_STATUS = ({ data }: any) =>
  API({ url: `/api/v1/admin/media/photo-report-update-status`, data, method: 'PUT' })

export const GET_PHOTO_REPORTS = ({ params }: any) =>
  API({ url: `/api/v1/admin/media/photo-report-by-status`, params, method: 'GET' })

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/photo-report-photo', data, isFormData: true, method: 'POST' })
