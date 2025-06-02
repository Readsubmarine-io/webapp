import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { GET_BOOKS_QUERY_KEY } from '@/api/book/get-books'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export type DeleteBookCallParams = {
  id: string
}

const deleteBookCall = async (params: DeleteBookCallParams) => {
  const response = await http.delete(`/v1/book/${params.id}`)

  if (response.status !== 200) {
    throw new Error('Failed to delete book.')
  }

  return response.data
}

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteBookCallParams>({
    mutationFn: deleteBookCall,
    onError: (error) => {
      assertError(error, 'Failed to delete book.')
    },
    onSuccess: () => {
      toast.success('Book deleted successfully')
      queryClient.invalidateQueries({ queryKey: [GET_BOOKS_QUERY_KEY] })
    },
  })
}
