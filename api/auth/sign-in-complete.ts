import { useMutation } from '@tanstack/react-query'

import http from '@/lib/http'

type SignInCompleteCallParams = {
  walletAddress: string
  signature: string
}

type SignInCompleteCallResponse = {
  accessToken: string
  userId: string
}

const signInCompleteCall = async (
  params: SignInCompleteCallParams,
): Promise<SignInCompleteCallResponse> => {
  const response = await http.post('/auth/sign-in/complete', {
    ...params,
  })

  return response.data
}

export const useSignInCompleteMutation = () => {
  return useMutation({
    mutationFn: (params: SignInCompleteCallParams) =>
      signInCompleteCall(params),
  })
}
