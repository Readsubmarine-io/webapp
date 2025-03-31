import { useQuery } from '@tanstack/react-query'

import http from '@/lib/http'

import { UserCounters } from './types'

export const getUserCountersByUserNameCall = async (username: string) => {
  const response = await http.get<UserCounters>(`/v1/user/${username}/counters`)

  if (response.status !== 200) {
    throw new Error('Failed to get user counters.')
  }

  return response.data
}

export const GET_USER_COUNTERS_BY_USERNAME_QUERY_KEY = 'user-counters'

export const useGetUserCountersByUserNameQuery = (username: string) => {
  return useQuery<UserCounters>({
    queryKey: [GET_USER_COUNTERS_BY_USERNAME_QUERY_KEY, username],
    queryFn: () => getUserCountersByUserNameCall(username),
  })
}
