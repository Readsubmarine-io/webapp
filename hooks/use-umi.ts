import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useMemo } from 'react'

import { useGetWalletQuery } from '@/api/auth/get-wallet'
import { useRpc } from '@/hooks/use-rpc'

export const useUmi = () => {
  const { rpc } = useRpc()
  const { data } = useGetWalletQuery()
  const wallet = data?.wallet

  const umi = useMemo(() => {
    const baseUmi = createUmi(rpc)
      .use(mplCandyMachine())
      .use(mplTokenMetadata())

    if (wallet && wallet.connected) {
      return baseUmi.use(walletAdapterIdentity(wallet))
    }

    return baseUmi
  }, [rpc, wallet])

  return umi
}
