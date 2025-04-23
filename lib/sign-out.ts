import { QueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

import { GET_USER_QUERY_KEY } from '@/api/user/get-user'

export const signOut = (queryClient: QueryClient) => {
  Cookies.remove('authToken')

  queryClient.resetQueries({
    queryKey: [GET_USER_QUERY_KEY],
  })
}
