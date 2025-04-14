import { useQuery } from '@tanstack/react-query'

import { User } from '@/api/user/types'
import http, { getServerHttp } from '@/lib/http'

export const getUserCall = async () => {
  const response = await http.get<User>('/v1/user')

  if (response.status !== 200) {
    throw new Error('Failed to get user.')
  }

  return response.data
}

export const getUserPrefetchCall = async () => {
  const http = getServerHttp()

  const response = await http.get<User>('/v1/user')

  if (response.status !== 200) {
    throw new Error('Failed to get user.')
  }

  return response.data
}

export const GET_USER_QUERY_KEY = 'user'

export const useGetUserQuery = () => {
  return useQuery<User>({
    queryKey: [GET_USER_QUERY_KEY],
    queryFn: getUserCall,
    enabled: false,
    retry: false,
  })
}

export const getUserPrefetchQuery = () => {
  return {
    queryKey: [GET_USER_QUERY_KEY],
    queryFn: getUserPrefetchCall,
  }
}
