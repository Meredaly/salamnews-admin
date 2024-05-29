import { API } from '@/api'

export const GET_PUBLISHED = ({ params }: any) =>
  API({ url: '/api/v1/admin/business/published', params, method: 'GET' })

export const GET_DELETED = ({ params }: any) => API({ url: '/api/v1/admin/business/deleted', params, method: 'GET' })
