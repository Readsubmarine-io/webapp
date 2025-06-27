import { getBase58Decoder } from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'

import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { useWallet } from '@/hooks/use-wallet'
import { assertError } from '@/lib/assert-error'
import { checkWalletConnection } from '@/lib/check-wallet-connection'
import http from '@/lib/http'

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
  const { wallet } = useWallet()
  const { data: settings } = useGetSettingsQuery()

  return useMutation({
    mutationFn: async (checkToken: boolean = false) => {
      const token = Cookies.get('authToken')

      if (token) {
        return token
      }

      if (checkToken) {
        return
      }

      if (!wallet) {
        assertError(
          new Error('No supported wallet found.'),
          'No supported wallet found.',
        )
        return
      }

      if (!settings || !settings[SettingKey.SignInMessage]) {
        assertError(new Error('No settings found.'), 'No settings found.')
        return
      }

      const { wallet: connectedWallet } = await checkWalletConnection(wallet)

      const { nonce } = await signInStartCall({
        walletAddress: wallet.publicKey?.toString() ?? '',
      })

      const message = `${settings[SettingKey.SignInMessage] || 'Sign in with Solana.'} \n\n ${nonce}`
      const signature = await connectedWallet.signMessage(Buffer.from(message))

      const { authToken } = await signInCompleteCall({
        walletAddress: wallet.publicKey?.toString() ?? '',
        message,
        signature: getBase58Decoder().decode(signature),
      })

      Cookies.set('authToken', authToken)

      return authToken
    },
    onError: (error) => {
      assertError(error, 'Failed to sign in.')
    },
  })
}
