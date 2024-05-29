import { API } from '@/api'

export const ADD_DRAFT = ({ data }: any) => API({ url: `/api/v1/admin/horoscope/workplace`, data, method: 'POST' })

export const GET_HOROSCOPES = ({ params }: any) =>
  API({ url: `/api/v1/admin/horoscope/get-by-status`, params, method: 'GET' })

export const UPDATE_HOROSCOPE = ({ data }: any) =>
  API({ url: '/api/v1/admin/horoscope/horoscope', data, method: 'POST' })

export const GET_HOROSCOPE = ({ uuid }: any) => API({ url: `/api/v1/admin/horoscope/horoscope/${uuid}`, method: 'GET' })

export const UPDATE_HOROSCOPE_STATUS = ({ data }: any) =>
  API({ url: `/api/v1/admin/horoscope/update-status`, data, method: 'PUT' })

export const DELETE_HOROSCOPE = ({ uuid }: any) =>
  API({ url: `/api/v1/admin/horoscope/horoscope/${uuid}`, method: 'DELETE' })

export const GET_CONTENT = ({ uuid, params }: any) =>
  API({ url: `/api/v1/admin/horoscope/content/${uuid}`, params, method: 'GET' })

export const UPDATE_CONTENT = ({ data }: any) => API({ url: `/api/v1/admin/horoscope/content`, data, method: 'POST' })

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/horoscope-photo', data, isFormData: true, method: 'POST' })
