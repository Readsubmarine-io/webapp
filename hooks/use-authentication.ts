import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { isServer } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useCallback } from 'react'

import { useGetWalletQuery } from '@/api/auth/get-wallet'
import { useSignInMutation } from '@/api/auth/sign-in'
import { useSignOutMutation } from '@/api/auth/sign-out'
import { useGetUserQuery } from '@/api/user/get-user'
import { useRpc } from '@/hooks/use-rpc'

export const useAuthentication = () => {
  const {
    data: user,
    refetch: refetchUser,
    isFetched: isUserFetched,
    isFetching: isUserFetching,
  } = useGetUserQuery()
  const {
    data,
    refetch: refetchWallet,
    isFetched: isWalletFetched,
    isFetching: isWalletFetching,
  } = useGetWalletQuery()
  const { mutateAsync: signIn } = useSignInMutation()
  const { mutateAsync: signOut } = useSignOutMutation()

  const wallet = data?.wallet
  const walletAddress = data?.wallet.publicKey?.toString()

  const { rpc } = useRpc()

  const [balance, setBalance] = useState(0)

  const getBalance = useCallback(async () => {
    if (!walletAddress || !rpc || isServer) return 0

    const balance = await rpc.getBalance(new PublicKey(walletAddress))

    setBalance(balance / LAMPORTS_PER_SOL)
  }, [rpc, walletAddress])

  useEffect(() => {
    const isConnected = localStorage.getItem('isConnected') === 'true'
    if (isConnected) {
      refetchWallet()
    }
  }, [refetchWallet])

  useEffect(() => {
    if (wallet?.connected) {
      signIn().then(() => {
        refetchUser()
      })
      getBalance()
    }
  }, [wallet, signIn, getBalance, refetchUser])

  const handleDisconnect = useCallback(async () => {
    signOut()
  }, [signOut])

  const handleConnect = useCallback(async () => {
    refetchWallet()
  }, [refetchWallet])

  const isConnected = useMemo(() => {
    return isWalletFetched && isUserFetched
  }, [isUserFetched, isWalletFetched])

  const isConnecting = useMemo(() => {
    return isWalletFetching || isUserFetching
  }, [isWalletFetching, isUserFetching])

  return {
    isConnected,
    isConnecting,
    user,
    balance,
    handleDisconnect,
    handleConnect,
  }
}
