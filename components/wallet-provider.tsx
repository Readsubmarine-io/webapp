'use client'

import { MessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { createContext, useContext, useEffect, useState } from 'react'

type WalletProviderProps = {
  children: React.ReactNode
}

type WalletState = {
  wallet: MessageSignerWalletAdapter | null
  address: string | null
  isConnected: boolean
  supportedWallets: MessageSignerWalletAdapter[]
  onDisconnect: () => void
  setWallet: (wallet: MessageSignerWalletAdapter) => void
  setAddress: (address: string | null) => void
  setIsConnected: (isConnected: boolean) => void
  setOnDisconnect: (onDisconnect: () => void) => void
}

const WalletContext = createContext<WalletState>({
  wallet: null,
  address: null,
  isConnected: false,
  supportedWallets: [],
  onDisconnect: () => {},
  setWallet: () => {},
  setAddress: () => {},
  setIsConnected: () => {},
  setOnDisconnect: () => {},
})

export const useWalletContext = () => {
  const context = useContext<WalletState>(WalletContext)

  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }

  return context
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<MessageSignerWalletAdapter | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onDisconnect, setOnDisconnect] = useState<() => void>(() => {})

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [adapters, _] = useState<MessageSignerWalletAdapter[]>([
    new PhantomWalletAdapter(),
  ])

  useEffect(() => {
    console.log('wallet', wallet)

    if (wallet) {
      wallet.on('disconnect', () => {
        console.log('disconnect')

        setWallet(null)
        setAddress(null)
        setIsConnected(false)
        onDisconnect()
      })
    }
  }, [onDisconnect, wallet])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        address,
        isConnected,
        supportedWallets: adapters,
        setWallet,
        setAddress,
        setIsConnected,
        onDisconnect,
        setOnDisconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
