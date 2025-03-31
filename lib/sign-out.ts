import { QueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

import { GET_WALLET_QUERY_KEY } from '@/api/auth/get-wallet'
import { GET_USER_QUERY_KEY } from '@/api/user/get-user'

export const signOut = (queryClient: QueryClient) => {
  Cookies.remove('authToken')
  localStorage.removeItem('isConnected')

  queryClient.resetQueries({
    queryKey: [GET_USER_QUERY_KEY],
  })
  queryClient.resetQueries({
    queryKey: [GET_WALLET_QUERY_KEY],
  })
}
