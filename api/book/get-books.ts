import { useQuery } from '@tanstack/react-query'

import { Book } from '@/api/book/types'
import { assertError } from '@/lib/assert-error'
import http, { getServerHttp } from '@/lib/http'
import { ListResultBase } from '@/types/list-result-base'
import { ListQueryBaseParams } from '@/types/llist-query-base'

export type GetBooksCallParams = {
  isOnMint?: boolean
  isOnSale?: boolean
  creatorId?: string
  isFeatured?: boolean
  genre?: string
  showHidden?: boolean
  isApproved?: boolean
  sortBy?: 'createdAt' | 'featured' | 'floorPrice' | 'sold24h' | 'totalSold'
} & ListQueryBaseParams

export type GetBooksCallResponse = {
  items: Book[]
} & ListResultBase

export const getBooksCall = async (params: GetBooksCallParams) => {
  const response = await http.get<GetBooksCallResponse>('/v1/book', { params })

  if (response.status !== 200) {
    throw new Error('Failed to get books.')
  }

  return response.data.items
}

export const getBooksPrefetchCall = async (params: GetBooksCallParams) => {
  const http = getServerHttp()
  const response = await http.get<GetBooksCallResponse>('/v1/book', { params })

  if (response.status !== 200) {
    throw new Error('Failed to get books.')
  }

  return response.data.items
}

export const GET_BOOKS_QUERY_KEY = 'book'

export const getBooksPrefetchQuery = (params: GetBooksCallParams) => {
  return {
    queryKey: [GET_BOOKS_QUERY_KEY, params],
    queryFn: () => getBooksPrefetchCall(params),
  }
}

export const useGetBooksQuery = (params: GetBooksCallParams) => {
  return useQuery<Book[], Error>({
    queryKey: [GET_BOOKS_QUERY_KEY, params],
    queryFn: () => getBooksCall(params),
    throwOnError: (error) => {
      assertError(error, 'Failed to get books.')
      return false
    },
  })
}
