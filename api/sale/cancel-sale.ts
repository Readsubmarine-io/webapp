import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { GET_BOOK_EDITIONS_QUERY_KEY } from '@/api/book-edition/get-book-editions'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

import { GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY } from '../user/get-user-counters-by-user-name'

export type CancelSaleCallParams = {
  saleId: string
}

const cancelSaleCall = async ({
  saleId,
}: CancelSaleCallParams): Promise<undefined> => {
  const response = await http.delete<undefined>(`/v1/sale/${saleId}`)

  if (response.status !== 200) {
    throw new Error('Failed to cancel sale.')
  }

  return response.data
}

export const useCancelSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<undefined, Error, CancelSaleCallParams>({
    mutationFn: cancelSaleCall,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_BOOK_EDITIONS_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY],
      })
    },
    onError: (error) => {
      assertError(error, 'Failed to cancel sale.')
    },
    onSettled: () => {
      toast.success('Sale cancelled')
    },
  })
}
