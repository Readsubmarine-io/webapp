import {
  MessageSignerWalletAdapter,
  WalletReadyState,
} from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useCallback, useEffect, useState } from 'react'

const getAdapters = () => {
  const adapters = [new PhantomWalletAdapter()]

  return adapters
}

export const useWallet = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [supportedWallets, setSupportedWallets] =
    useState<MessageSignerWalletAdapter[]>(getAdapters())
  const [wallet, setWallet] = useState<MessageSignerWalletAdapter | null>(null)

  const getWallet = useCallback(async () => {
    const availableWallet = supportedWallets?.find((wallet) => {
      return (
        wallet.readyState === WalletReadyState.Installed ||
        wallet.readyState === WalletReadyState.Loadable
      )
    })

    if (!availableWallet) {
      return
    }

    await setWallet(availableWallet)
  }, [supportedWallets])

  useEffect(() => {
    getWallet()
  }, [getWallet])

  return {
    wallet,
  }
}
