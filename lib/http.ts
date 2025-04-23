import axios from 'axios'
import Cookies from 'js-cookie'

import { API_BASE_URL } from '@/constants/env'
import { getQueryClient } from '@/lib/get-query-client'
import { signOut } from '@/lib/sign-out'

const queryClient = getQueryClient()

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const getToken = () => {
  const token = Cookies.get('authToken')

  return token
}

http.interceptors.request.use(
  async (config) => {
    if (config.headers.Authorization) {
      return config
    }

    const token = getToken()

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
    console.log(error)

    if (error?.response?.status === 401) {
      signOut(queryClient)
    }

    return Promise.reject(error)
  },
)

const getServerHttp = (token?: string) => {
  const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  })

  return http
}

export default http
export { getServerHttp }
