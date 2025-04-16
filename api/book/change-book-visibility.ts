import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Book } from '@/api/book/types'
import http from '@/lib/http'

import { GET_BOOK_BY_ID_QUERY_KEY } from './get-book-by-id'
import { GET_BOOKS_QUERY_KEY } from './get-books'

export type ChangeBookVisibilityParams = {
  bookId: string
  isShown: boolean
}

const changeBookVisibilityCall = async ({
  bookId,
  isShown,
}: ChangeBookVisibilityParams) => {
  const response = await http.patch<Book>(`/v1/book/${bookId}/visibility`, {
    isShown,
  })

  if (response.status !== 200) {
    throw new Error('Failed to change book visibility.')
  }

  return response.data
}

export const useChangeBookVisibilityMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Book, Error, ChangeBookVisibilityParams>({
    mutationFn: changeBookVisibilityCall,
    onSuccess: () => {
      // Invalidate books queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [GET_BOOKS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [GET_BOOK_BY_ID_QUERY_KEY] })
    },
  })
}
