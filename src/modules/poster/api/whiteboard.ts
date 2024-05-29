import { API } from '@/api'

export const GET_WHITEBOARD = () => API({ url: '/api/v1/admin/poster/workplace', method: 'GET' })

export const ADD_TASK = ({ data }: any) => API({ url: '/api/v1/admin/poster/workplace', data, method: 'POST' })

export const ADD_WRITER_TASK = ({ data }: any) => API({ url: '/api/v1/admin/poster/workplace', data, method: 'PUT' })

export const DELETE_TASK_LANG = ({ id }: any) => API({ url: `/api/v1/admin/poster/workplace/${id}`, method: 'DELETE' })

export const GET_WAIT_LIST = ({ params }: any) => API({ url: '/api/v1/admin/poster/waiting', params, method: 'GET' })

export const GET_PLANNED = ({ params }: any) => API({ url: '/api/v1/admin/poster/planning', params, method: 'GET' })
