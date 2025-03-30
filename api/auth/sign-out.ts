import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { GET_WALLET_QUERY_KEY, useGetWalletQuery } from '@/api/auth/get-wallet'
import { GET_USER_QUERY_KEY } from '@/api/user/get-user'

export const useSignOutMutation = () => {
  const { data } = useGetWalletQuery()
  const queryClient = useQueryClient()

  const wallet = data?.wallet

  return useMutation({
    mutationFn: async () => {
      Cookies.remove('authToken')
      localStorage.removeItem('isConnected')

      if (wallet) {
        wallet.disconnect()
      }

      queryClient.resetQueries({
        queryKey: [GET_USER_QUERY_KEY],
      })
      queryClient.resetQueries({
        queryKey: [GET_WALLET_QUERY_KEY],
      })
    },
  })
}
