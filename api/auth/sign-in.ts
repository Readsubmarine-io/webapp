import { useMutation } from '@tanstack/react-query'
import { getBase58Decoder } from '@solana/kit'
import Cookies from 'js-cookie'

import { useGetWalletQuery } from '@/api/auth/get-wallet'
import http from '@/lib/http'
import { useGetUserQuery } from '../user/get-user'

type SignInStartCallParams = {
  walletAddress: string
}

type SignInStartCallResponse = {
  nonce: string
}

const signInStartCall = async ({
  walletAddress,
}: SignInStartCallParams): Promise<SignInStartCallResponse> => {
  const response = await http.post('/v1/auth/sign-in/start', {
    walletAddress,
  })

  return response.data
}

type SignInCompleteCallParams = {
  walletAddress: string
  message: string
  signature: string
}

type SignInCompleteCallResponse = {
  authToken: string
  userId: string
}

const signInCompleteCall = async (
  params: SignInCompleteCallParams,
): Promise<SignInCompleteCallResponse> => {
  const response = await http.post('/v1/auth/sign-in/complete', {
    ...params,
  })

  return response.data
}

export const useSignInMutation = () => {
  const { data: walletData } = useGetWalletQuery()
  const { refetch: refetchUser } = useGetUserQuery()

  const wallet = walletData?.wallet
  const walletAddress = walletData?.wallet.publicKey?.toString()

  return useMutation({
    mutationFn: async () => {
      const token = Cookies.get('authToken')

      if (token) {
        return token
      }

      if (!wallet || !walletAddress) {
        throw new Error('Wallet not connected')
      }

      const { nonce } = await signInStartCall({
        walletAddress,
      })

      const message = `Sign in with Solana. ${nonce}`
      const signature = await wallet.signMessage(Buffer.from(message))

      const { authToken } = await signInCompleteCall({
        walletAddress: walletAddress!,
        message,
        signature: getBase58Decoder().decode(signature),
      })

      return authToken
    },
    onSuccess: (authToken) => {
      Cookies.set('authToken', authToken)
      refetchUser()
    },
  })
}
