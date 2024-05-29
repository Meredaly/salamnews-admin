import axios from 'axios'
import { useCookies } from 'vue3-cookies'

import { Request } from './types'

const baseURL = import.meta.env.VITE_APP_BASE_URL

export const API = async ({
  url,
  method = 'POST',
  headers = {},
  params = {},
  data = {},
  onUploadProgress = {},
  isFormData = false
}: Request) => {
  const { cookies } = useCookies()

  if (isFormData) {
    const formData = new FormData()
    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'multipart/form-data'

    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value)
    }
    data = formData
  }
  if (cookies.get('Authorization')) {
    headers['Authorization'] = cookies.get('Authorization')
  }

  const response = await axios({
    url: `${baseURL}${url}`,
    method,
    headers,
    ...onUploadProgress,
    params,
    data
  })
  return response.data
}