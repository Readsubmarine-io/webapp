import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { Umi } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useEffect, useState } from 'react'

import { useRpc } from '@/hooks/use-rpc'
import { useWallet } from '@/hooks/use-wallet'
import { checkWalletConnection } from '@/lib/check-wallet-connection'

import { usePublicKey } from './use-public-key'

export const useUmi = () => {
  const { rpc } = useRpc()
  const { wallet } = useWallet()
  const [umi, setUmi] = useState<Umi | null>(null)
  const { publicKey } = usePublicKey()

  useEffect(() => {
    const initializeUmi = async () => {
      if (!wallet) {
        return
      }

      const { wallet: connectedWallet } = await checkWalletConnection(wallet)

      const baseUmi = createUmi(rpc)
        .use(mplCandyMachine())
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(connectedWallet))

      setUmi(baseUmi)
    }

    initializeUmi()
  }, [rpc, wallet, publicKey])

  return {
    umi,
  }
}
