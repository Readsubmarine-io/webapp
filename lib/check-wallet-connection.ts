import { MessageSignerWalletAdapter } from '@solana/wallet-adapter-base'

export const checkWalletConnection = async (
  wallet: MessageSignerWalletAdapter,
): Promise<{
  wallet: MessageSignerWalletAdapter
  address: string
}> => {
  if (!wallet.connected) {
    await wallet.connect()
  }

  if (!wallet.connected) {
    throw new Error('Failed to connect wallet.')
  }

  const address = wallet.publicKey?.toBase58()

  if (!address) {
    throw new Error('Wallet address not found.')
  }

  return {
    wallet,
    address,
  }
}
