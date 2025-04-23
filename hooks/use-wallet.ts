import {
  MessageSignerWalletAdapter,
  WalletReadyState,
} from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const getAdapters = () => {
  const adapters = [new PhantomWalletAdapter()]

  return adapters
}

export const useWallet = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [supportedWallets, setSupportedWallets] =
    useState<MessageSignerWalletAdapter[]>(getAdapters())

  const [wallet, setWallet] = useState<MessageSignerWalletAdapter | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refetchWalletInterval, setRefetchWalletInterval] =
    useState<NodeJS.Timeout | null>(null)

  const getWallet = useCallback(async () => {
    const availableWallet = supportedWallets?.find(
      (wallet) =>
        wallet.readyState === WalletReadyState.Installed ||
        wallet.readyState === WalletReadyState.Loadable,
    )

    if (!availableWallet) {
      toast.error('No supported wallet found.')
      return
    }

    await setWallet(availableWallet)
  }, [supportedWallets])

  useEffect(() => {
    getWallet()

    const interval = setInterval(() => {
      setSupportedWallets(getAdapters())
    }, 1000)

    setRefetchWalletInterval((prev) => {
      if (prev) {
        clearInterval(prev)
      }

      return interval
    })

    return () => {
      if (refetchWalletInterval) {
        clearInterval(refetchWalletInterval)
      }
    }
  }, [getWallet])

  return {
    wallet,
  }
}
