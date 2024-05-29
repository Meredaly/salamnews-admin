import { API } from '@/api'

export const ADD_BANNER = ({ data }: any) => API({ url: `/api/v1/admin/banner/add`, data, method: 'POST' })

export const GET_BANNERS = ({ params }: any) => API({ url: `/api/v1/admin/banner/get`, params, method: 'GET' })

export const UPDATE_BANNER = ({ id, data }: any) =>
  API({ url: `/api/v1/admin/banner/update/${id}`, data, method: 'PUT' })

export const GET_BANNER = ({ uuid }: any) => API({ url: `/api/v1/admin/banner/get/${uuid}`, method: 'GET' })

export const DELETE_BANNER = ({ uuid }: any) => API({ url: `/api/v1/admin/banner/delete/${uuid}`, method: 'DELETE' })

export const IMAGE_UPLOAD = ({ data }: any) =>
  API({ url: '/api/v1/admin/banner/add-image', data, isFormData: true, method: 'POST' })
