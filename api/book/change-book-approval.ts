import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Book } from '@/api/book/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

import { GET_BOOK_BY_ID_QUERY_KEY } from './get-book-by-id'
import { GET_BOOKS_QUERY_KEY } from './get-books'

export type ChangeBookApprovalParams = {
  bookId: string
  isApproved: boolean
}

const changeBookApprovalCall = async ({
  bookId,
  isApproved,
}: ChangeBookApprovalParams) => {
  const response = await http.patch<Book>(`/v1/book/${bookId}/approval`, {
    isApproved,
  })

  if (response.status !== 200) {
    throw new Error('Failed to change book approval status.')
  }

  return response.data
}

export const useChangeBookApprovalMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Book, Error, ChangeBookApprovalParams>({
    mutationFn: changeBookApprovalCall,
    onSuccess: () => {
      // Invalidate books queries to refresh the data
      queryClient.invalidateQueries({ queryKey: [GET_BOOKS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [GET_BOOK_BY_ID_QUERY_KEY] })
      toast.success('Book approval status updated successfully')
    },
    onError: (error) => {
      assertError(error, 'Failed to change book approval status.')
    },
  })
}
