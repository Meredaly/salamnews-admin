import { API } from '@/api'

export const GET_PUBLISHED = ({ params }: any) => API({ url: '/api/v1/admin/news/published', params, method: 'GET' })

export const GET_DELETED = ({ params }: any) => API({ url: '/api/v1/admin/news/deleted', params, method: 'GET' })
