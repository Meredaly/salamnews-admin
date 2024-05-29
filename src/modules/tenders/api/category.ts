import { API } from '@/api'

export const GET_CATEGORY = () => API({ url: '/api/v1/admin/tender/category', method: 'GET' })

export const ADD_CATEGORY = ({ data }: any) => API({ url: '/api/v1/admin/tender/category', data, method: 'POST' })

export const UPDATE_CATEGORY = ({ data, id }: any) =>
  API({ url: `/api/v1/admin/tender/category/${id}`, data, method: 'PUT' })

export const DELETE_CATEGORY = ({ id }: any) => API({ url: `/api/v1/admin/tender/category/${id}`, method: 'DELETE' })

export const UPDATE_CATEGORIES_POSITION = ({ data }: any) =>
  API({ url: '/api/v1/admin/tender/category/change-position', data, method: 'POST' })
