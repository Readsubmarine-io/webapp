import { useMutation } from '@tanstack/react-query'

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
  const response = await http.post('/auth/sign-in/start', {
    walletAddress,
  })

  return response.data
}

export const useSignInStartMutation = () => {
  return useMutation({
    mutationFn: (params: SignInStartCallParams) => signInStartCall(params),
  })
}
