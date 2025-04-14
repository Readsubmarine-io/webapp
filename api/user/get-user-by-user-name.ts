import { useQuery } from '@tanstack/react-query'

import { User } from '@/api/user/types'
import http, { getServerHttp } from '@/lib/http'

const getUserByUsernameCall = async (username: string) => {
  const response = await http.get(`/v1/user/${username}`)

  if (response.status !== 200) {
    throw new Error('Failed to get user.')
  }

  return response.data
}

const getUserByUsernamePrefetchCall = async (username: string) => {
  const http = getServerHttp()

  const response = await http.get(`/v1/user/${username}`)

  if (response.status !== 200) {
    throw new Error('Failed to get user.')
  }

  console.log('response.data', response.data)

  return response.data
}

export const GET_USER_BY_USERNAME_QUERY_KEY = 'user'

export const useGetUserByUsernameQuery = (username: string) => {
  return useQuery<User>({
    queryKey: [GET_USER_BY_USERNAME_QUERY_KEY, username],
    queryFn: () => getUserByUsernameCall(username),
  })
}

export const getUserByUsernamePrefetchQuery = (username: string) => {
  return {
    queryKey: [GET_USER_BY_USERNAME_QUERY_KEY, username],
    queryFn: () => getUserByUsernamePrefetchCall(username),
  }
}
