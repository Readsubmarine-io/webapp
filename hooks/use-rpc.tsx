import { Connection } from '@solana/web3.js'
import { useMemo } from 'react'

export const useRpc = () => {
  const rpc = useMemo(() => {
    return new Connection('https://api.devnet.solana.com')
  }, [])

  return { rpc }
}
