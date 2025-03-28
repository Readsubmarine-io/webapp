import { useQuery } from '@tanstack/react-query'

import http from '@/lib/http'

const getUserByUsernameCall = async (username: string) => {
  const response = await http.get(`/user/${username}`)

  return response.data
}

const GET_USER_BY_USERNAME_QUERY_KEY = 'user'

export const useGetUserByUsernameQuery = (username: string) => {
  return useQuery({
    queryKey: [GET_USER_BY_USERNAME_QUERY_KEY, username],
    queryFn: () => getUserByUsernameCall(username),
  })
}
