import { useQuery } from '@tanstack/react-query'

import { Book } from '@/api/book/types'
import http, { getServerHttp } from '@/lib/http'

export const getBookByIdCall = async (id: string) => {
  const response = await http.get<Book>(`/v1/book/${id}`)

  if (response.status !== 200) {
    throw new Error('Failed to get book by id.')
  }

  return response.data
}

export const getBookByIdPrefetchCall = async (id: string) => {
  const http = getServerHttp()
  const response = await http.get<Book>(`/v1/book/${id}`)

  if (response.status !== 200) {
    throw new Error('Failed to get book by id.')
  }

  return response.data
}

export const GET_BOOK_BY_ID_QUERY_KEY = 'GET_BOOK_BY_ID_QUERY_KEY'

export const getBookByIdPrefetchQuery = (id: string) => {
  return {
    queryKey: [GET_BOOK_BY_ID_QUERY_KEY, id],
    queryFn: () => getBookByIdPrefetchCall(id),
  }
}

export const useGetBookByIdQuery = (id: string) => {
  return useQuery<Book, Error>({
    queryKey: [GET_BOOK_BY_ID_QUERY_KEY, id],
    queryFn: () => getBookByIdCall(id),
  })
}
