import { useQuery } from '@tanstack/react-query'

import { BookEdition } from '@/api/book-edition/types'
import http, { getServerHttp } from '@/lib/http'
import { ListResultBase } from '@/types/list-result-base'
import { ListQueryBaseParams } from '@/types/llist-query-base'

export type GetBookEditionsCallParams = {
  bookId?: string
  ownerAddress?: string
  isOnSale?: boolean
} & ListQueryBaseParams

export type GetBookEditionsCallResponse = {
  items: BookEdition[]
} & ListResultBase

export const getBookEditionsCall = async (
  params: GetBookEditionsCallParams,
) => {
  const response = await http.get<GetBookEditionsCallResponse>('/v1/edition', {
    params,
  })

  if (response.status !== 200) {
    throw new Error('Failed to get book editions.')
  }

  return response.data.items
}

export const getBookEditionsPrefetchCall = async (
  params: GetBookEditionsCallParams,
) => {
  const http = getServerHttp()
  const response = await http.get<GetBookEditionsCallResponse>('/v1/edition', {
    params,
  })

  if (response.status !== 200) {
    throw new Error('Failed to get book editions.')
  }

  return response.data.items
}

export const GET_BOOK_EDITIONS_QUERY_KEY = 'book-edition'

export const getBookEditionsPrefetchQuery = (
  params: GetBookEditionsCallParams,
) => {
  return {
    queryKey: [GET_BOOK_EDITIONS_QUERY_KEY, params],
    queryFn: () => getBookEditionsPrefetchCall(params),
  }
}

export const useGetBookEditionsQuery = (params: GetBookEditionsCallParams) => {
  return useQuery<BookEdition[], Error>({
    queryKey: [GET_BOOK_EDITIONS_QUERY_KEY, params],
    queryFn: () => getBookEditionsCall(params),
  })
}
