import { API } from '@/api'

export const GET_EMPLOYEES = ({ params }: any) => API({ url: '/api/v1/admin/employee', params, method: 'GET' })

export const GET_EMPLOYEE = ({ id }: any) => API({ url: `/api/v1/admin/employee/${id}`, method: 'GET' })

export const ADD_EMPLOYEE = ({ data }: any) => API({ url: '/api/v1/admin/employee', data, method: 'POST' })

export const UPDATE_EMPLOYEE = ({ data, id }: any) => API({ url: `/api/v1/admin/employee/${id}`, data, method: 'PUT' })

export const DELETE_EMPLOYEE = ({ id }: any) => API({ url: `/api/v1/admin/employee/${id}`, method: 'DELETE' })

export const ADD_EMPLOYEE_IMAGE = ({ data }: any) => API({ url: '/api/v1/admin/employee/photo', data, isFormData: true, method: 'POST' })
