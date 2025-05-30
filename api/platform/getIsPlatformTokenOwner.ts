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
  try {
    if (!walletAddress) {
      return false
    }

    const response = await http.get<GetIsPlatformTokenOwnerCallResponse>(
      `/v1/platform-token/owner/${walletAddress}`,
    )

    if (response.status !== 200) {
      return false
    }

    return response.data.isPlatformTokenOwner
  } catch (error) {
    console.error(error)
    return false
  }
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
