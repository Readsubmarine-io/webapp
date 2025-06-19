import { useQuery } from '@tanstack/react-query'

import { UnconfirmedBookEdition } from '@/api/book-edition/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export type GetUnconfirmedBookEditionsCallParams = {
  userId: string
}

export const getUnconfirmedBookEditionsCall = async (
  params: GetUnconfirmedBookEditionsCallParams,
) => {
  const response = await http.get<UnconfirmedBookEdition[]>(
    '/v1/edition/unconfirmed',
    {
      params,
    },
  )

  if (response.status !== 200) {
    throw new Error('Failed to get unconfirmed book editions.')
  }

  return response.data
}

export const GET_UNCONFIRMED_BOOK_EDITIONS_QUERY_KEY =
  'unconfirmed-book-edition'

export const useGetUnconfirmedBookEditionsQuery = ({
  userId,
}: GetUnconfirmedBookEditionsCallParams) => {
  return useQuery<UnconfirmedBookEdition[], Error>({
    queryKey: [GET_UNCONFIRMED_BOOK_EDITIONS_QUERY_KEY, userId],
    queryFn: () => getUnconfirmedBookEditionsCall({ userId }),
    throwOnError: (error) => {
      assertError(error, 'Failed to get unconfirmed book editions.')
      return true
    },
  })
}
