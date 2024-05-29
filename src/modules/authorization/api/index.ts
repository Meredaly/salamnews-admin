import { API } from '@/api'

export const AUTHORIZATION = ({ data }: any) => API({ url: '/api/v1/admin/employee/login', data, method: 'POST' })
