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

  const [balance, setBalance] = useState('0.00')

  const getBalance = useCallback(async () => {
    if (!walletAddress || !rpc || isServer) return 0

    const balance = await rpc.getBalance(new PublicKey(walletAddress))

    setBalance((balance / LAMPORTS_PER_SOL).toFixed(2))
  }, [rpc, walletAddress])

  useEffect(() => {
    const isConnected = localStorage.getItem('isConnected') === 'true'
    if (isConnected) {
      refetchWallet()
    }
  }, [refetchWallet])

  const handleSignIn = useCallback(async () => {
    if (!wallet?.connected) return

    await signIn()
    refetchUser()
  }, [wallet, signIn, refetchUser])

  const handleGetBalance = useCallback(() => {
    if (!wallet?.connected) return () => {}

    getBalance()
    const interval = setInterval(async () => {
      wallet.on('disconnect', () => {
        clearInterval(interval)
      })

      await getBalance()
    }, 10000)

    return () => clearInterval(interval)
  }, [wallet, getBalance])

  const handleAccountChange = useCallback(() => {
    if (!wallet?.connected) return () => {}

    const publicKey = wallet.publicKey?.toString()

    const interval = setInterval(async () => {
      const currentPublicKey = wallet.publicKey?.toString()

      if (currentPublicKey !== publicKey) {
        clearInterval(interval)
        wallet.disconnect()
        await signOut()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [signOut, wallet])

  useEffect(() => {
    if (wallet?.connected) {
      handleSignIn()
      const clearBalanceInterval = handleGetBalance()
      const clearAccountChangeInterval = handleAccountChange()

      return () => {
        clearBalanceInterval()
        clearAccountChangeInterval()
      }
    }
  }, [wallet, handleSignIn, handleGetBalance, handleAccountChange])

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
