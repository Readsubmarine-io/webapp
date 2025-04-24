import { useQuery } from '@tanstack/react-query'

import { UserCounters } from '@/api/user/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export const getUserCountersByUserIdCall = async (userId: string) => {
  console.log('userId', userId)

  if (!userId) {
    return {
      createdBooks: 0,
      ownedEditions: 0,
      activeSales: 0,
    }
  }

  const response = await http.get<UserCounters>(`/v1/user/${userId}/counters`)

  if (response.status !== 200) {
    throw new Error('Failed to get user counters.')
  }

  return response.data
}

export const GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY = 'user-counters'

export const useGetUserCountersByUserIdQuery = (userId: string) => {
  return useQuery<UserCounters>({
    queryKey: [GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY, userId],
    queryFn: () => getUserCountersByUserIdCall(userId),
    throwOnError: (error) => {
      assertError(error, 'Failed to get user counters.')
      return true
    },
  })
}
