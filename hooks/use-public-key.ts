import { PublicKey } from '@solana/web3.js'
import { useEffect, useMemo, useState } from 'react'
import { useRpc } from './use-rpc'

export const usePublicKey = () => {
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

  return {
    publicKey,
  }
}
