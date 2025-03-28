import axios from 'axios'
import { cookies } from 'next/headers'

import { API_BASE_URL } from '@/constants/env'

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const getToken = async () => {
  const cookieStore = await cookies()

  const token = cookieStore.get('authToken')

  return token?.value
}

http.interceptors.request.use(
  async (config) => {
    const token = await getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default http
