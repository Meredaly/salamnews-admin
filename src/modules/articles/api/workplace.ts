import { API } from '@/api'

export const GET_DRAFTS = () => API({ url: '/api/v1/admin/article/writing-by-writer', method: 'GET' })

export const GET_PUBLISHED = ({ params }: any) =>
  API({ url: '/api/v1/admin/article/published-by-writer', params, method: 'GET' })
