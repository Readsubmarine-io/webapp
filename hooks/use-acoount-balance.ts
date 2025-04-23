import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@/hooks/use-wallet'
import { useRpc } from '@/hooks/use-rpc'
import { checkWalletConnection } from '@/lib/check-wallet-connection'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export const useAccountBalance = () => {
  const [balance, setBalance] = useState<string | null>('0.00')
  const [balanceInterval, setBalanceInterval] = useState<NodeJS.Timeout | null>(
    null,
  )
  const { wallet } = useWallet()
  const { rpc } = useRpc()

  const getBalance = useCallback(async () => {
    if (!wallet) {
      return
    }

    const { wallet: connectedWallet } = await checkWalletConnection(wallet)

    if (!connectedWallet || !connectedWallet.publicKey) {
      return
    }

    const balance = await rpc.getBalance(connectedWallet.publicKey)

    setBalance((balance / LAMPORTS_PER_SOL).toFixed(2))
  }, [wallet])

  useEffect(() => {
    getBalance()
    const interval = setInterval(async () => {
      await getBalance()
    }, 10000)

    setBalanceInterval((prev) => {
      if (prev) {
        clearInterval(prev)
      }

      return interval
    })

    return () => {
      if (balanceInterval) {
        clearInterval(balanceInterval)
      }
    }
  }, [getBalance])

  return {
    balance,
  }
}
