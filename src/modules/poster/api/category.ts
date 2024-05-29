import { API } from '@/api'

export const GET_CATEGORY = () => API({ url: '/api/v1/admin/poster/category', method: 'GET' })

export const ADD_CATEGORY = ({ data }: any) => API({ url: '/api/v1/admin/poster/category', data, method: 'POST' })

export const UPDATE_CATEGORY = ({ data, id }: any) =>
  API({ url: `/api/v1/admin/poster/category/${id}`, data, method: 'PUT' })

export const DELETE_CATEGORY = ({ id }: any) => API({ url: `/api/v1/admin/poster/category/${id}`, method: 'DELETE' })

export const UPDATE_CATEGORIES_POSITION = ({ data }: any) =>
  API({ url: '/api/v1/admin/poster/category/change-position', data, method: 'POST' })