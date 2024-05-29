import { API } from '@/api'

export const GET_PROFILE = () => API({ url: '/api/v1/admin/profile_employee', method: 'GET' })
