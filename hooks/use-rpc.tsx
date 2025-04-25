import { Connection } from '@solana/web3.js'
import { useMemo } from 'react'

import { RPC_URL } from '@/constants/env'

export const useRpc = () => {
  const rpc = useMemo(() => {
    return new Connection(RPC_URL)
  }, [])

  return { rpc }
}
