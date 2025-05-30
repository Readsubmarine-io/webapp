import { useQuery } from '@tanstack/react-query'

import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export type GetIsPlatformTokenOwnerCallParams = {
  walletAddress: string
}

export type GetIsPlatformTokenOwnerCallResponse = {
  isPlatformTokenOwner: boolean
}

export const getIsPlatformTokenOwnerCall = async ({
  walletAddress,
}: GetIsPlatformTokenOwnerCallParams) => {
  if (!walletAddress) {
    return false
  }

  const response = await http.get<GetIsPlatformTokenOwnerCallResponse>(
    `/v1/platform-token/owner/${walletAddress}`,
  )

  if (response.status !== 200) {
    throw new Error('Failed to get is platform token owner.')
  }

  return response.data.isPlatformTokenOwner
}

export const useGetIsPlatformTokenOwnerQuery = (
  params: GetIsPlatformTokenOwnerCallParams,
) => {
  return useQuery<boolean, Error>({
    queryKey: ['getIsPlatformTokenOwner', params],
    queryFn: () => getIsPlatformTokenOwnerCall(params),
    throwOnError: (error) => {
      assertError(error, 'Failed to get is platform token owner.')
      return true
    },
  })
}
