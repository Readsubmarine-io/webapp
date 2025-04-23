'use client'

import { createContext, useEffect, useState } from 'react'

export const PublicKeyContext = createContext<string | null>(null)

export function PublicKeyProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [updatePublicKeyInterval, setUpdatePublicKeyInterval] =
    useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const interval = setInterval(async () => {
      await window.solana.connect({ onlyIfTrusted: true })
      const publicKey = window.solana.publicKey?.toString()

      if (publicKey) {
        setPublicKey(publicKey)
      }
    }, 1000)

    setUpdatePublicKeyInterval((prev) => {
      if (prev) {
        clearInterval(prev)
      }

      return interval
    })

    return () => {
      if (updatePublicKeyInterval) {
        clearInterval(updatePublicKeyInterval)
      }
    }
  }, [])

  return (
    <PublicKeyContext.Provider value={publicKey}>
      {children}
    </PublicKeyContext.Provider>
  )
}
