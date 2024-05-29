import { API } from '@/api'

export const GET_PINNED_NEWS = ({ params }: any) => API({ url: '/api/v1/admin/news/pinned', params, method: 'GET' })
