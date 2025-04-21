import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useQuery } from '@tanstack/react-query'

import { assertError } from '@/lib/assert-error'

import { useSignOutMutation } from './sign-out'

export const GET_WALLET_QUERY_KEY = 'wallet'

export const useGetWalletQuery = () => {
  const { mutateAsync: signOut } = useSignOutMutation()

  return useQuery<
    | {
        wallet: PhantomWalletAdapter
      }
    | undefined
  >({
    queryKey: [GET_WALLET_QUERY_KEY],
    queryFn: async () => {
      const wallet = new PhantomWalletAdapter()

      await wallet.autoConnect()

      if (!wallet.connected) {
        throw new Error('Wallet not connected')
      }

      wallet.on('disconnect', () => {
        signOut()
      })

      localStorage.setItem('isConnected', 'true')

      return {
        wallet,
      }
    },
    throwOnError: (error) => {
      assertError(error, 'Failed to connect wallet.')
      return true
    },
    enabled: false,
  })
}
