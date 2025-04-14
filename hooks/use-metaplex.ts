import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { useMemo } from 'react'

import { useGetWalletQuery } from '@/api/auth/get-wallet'

import { useRpc } from './use-rpc'

export const useMetaplex = () => {
  const { data } = useGetWalletQuery()
  const { rpc } = useRpc()
  const wallet = data?.wallet

  const metaplex = useMemo(() => {
    if (!wallet) {
      return null
    }

    return Metaplex.make(rpc).use(walletAdapterIdentity(wallet))
  }, [rpc, wallet])

  return {
    metaplex,
  }
}
