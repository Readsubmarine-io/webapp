import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'

import { useGetWalletQuery } from '@/api/auth/get-wallet'
import { useGetUserQuery } from '@/api/user/get-user'

export const useUserData = () => {
  const { data: user } = useGetUserQuery()
  const { data: walletData } = useGetWalletQuery()

  const wallet = useMemo<PhantomWalletAdapter | null>(() => {
    return walletData?.wallet ?? null
  }, [walletData?.wallet])

  const isAuthenticated = useMemo<boolean>(() => {
    return !!wallet && !!wallet.connected && !!user
  }, [wallet, user])

  return {
    user,
    wallet,
    isAuthenticated,
  }
}
