import { PublicKey } from '@solana/web3.js'
import { useCallback } from 'react'

import { usePublicKey } from '@/hooks/use-public-key'
import { useRpc } from '@/hooks/use-rpc'

export const useAccountBalance = () => {
  const { rpc } = useRpc()
  const { publicKey } = usePublicKey()

  const getBalance = useCallback(async () => {
    if (!publicKey) {
      return 0
    }

    const balance = await rpc.getBalance(new PublicKey(publicKey))

    return balance
  }, [publicKey, rpc])

  return {
    getBalance,
  }
}
