import { API } from '@/api'

export const GET_PUBLISHED = ({ params }: any) => API({ url: '/api/v1/admin/article/published', params, method: 'GET' })

export const GET_DELETED = ({ params }: any) => API({ url: '/api/v1/admin/article/deleted', params, method: 'GET' })
