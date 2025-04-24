import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { useEffect, useState } from 'react'

import { useRpc } from '@/hooks/use-rpc'
import { useWallet } from '@/hooks/use-wallet'
import { checkWalletConnection } from '@/lib/check-wallet-connection'

import { usePublicKey } from './use-public-key'

export const useMetaplex = () => {
  const { wallet } = useWallet()
  const { rpc } = useRpc()
  const [metaplex, setMetaplex] = useState<Metaplex | null>(null)
  const { publicKey } = usePublicKey()

  useEffect(() => {
    const createMetaplex = async () => {
      if (!wallet) {
        return
      }

      const { wallet: connectedWallet } = await checkWalletConnection(wallet)

      setMetaplex(
        Metaplex.make(rpc).use(walletAdapterIdentity(connectedWallet)),
      )
    }

    createMetaplex()
  }, [rpc, wallet, wallet?.publicKey, publicKey])

  return {
    metaplex,
  }
}
