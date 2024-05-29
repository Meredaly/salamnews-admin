import { API } from '@/api'

export const GET_DRAFTS = () => API({ url: '/api/v1/admin/tender/writing-by-writer', method: 'GET' })

export const GET_PUBLISHED = ({ params }: any) =>
  API({ url: '/api/v1/admin/tender/published-by-writer', params, method: 'GET' })
