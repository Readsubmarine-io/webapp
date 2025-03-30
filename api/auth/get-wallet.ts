import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useQuery } from '@tanstack/react-query'

const getWalletCall = async () => {
  const wallet = new PhantomWalletAdapter()

  await wallet.autoConnect()

  if (!wallet.connected) {
    throw new Error('Wallet not connected')
  }

  localStorage.setItem('isConnected', 'true')

  return {
    wallet,
  }
}

export const GET_WALLET_QUERY_KEY = 'wallet'

export const useGetWalletQuery = () => {
  return useQuery<{
    wallet: PhantomWalletAdapter
  }>({
    queryKey: [GET_WALLET_QUERY_KEY],
    queryFn: getWalletCall,
    enabled: false,
  })
}
