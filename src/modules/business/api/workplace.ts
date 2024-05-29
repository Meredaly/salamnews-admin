import { API } from '@/api'

export const GET_DRAFTS = () => API({ url: '/api/v1/admin/business/writing-by-writer', method: 'GET' })

export const GET_PUBLISHED = ({ params }: any) =>
  API({ url: '/api/v1/admin/business/published-by-writer', params, method: 'GET' })
