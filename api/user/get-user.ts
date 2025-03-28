import { useQuery } from '@tanstack/react-query'

import http from '@/lib/http'

const getUserCall = async () => {
  const response = await http.get('/user')

  if (response.status !== 200) {
    throw new Error('Failed to get user.')
  }

  return response.data
}

const GET_USER_QUERY_KEY = 'user'

export const useGetUserQuery = () => {
  return useQuery({
    queryKey: [GET_USER_QUERY_KEY],
    queryFn: getUserCall,
  })
}
