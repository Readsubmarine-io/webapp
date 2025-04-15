import { useMutation, useQueryClient } from '@tanstack/react-query'

import { GET_BOOK_EDITIONS_QUERY_KEY } from '@/api/book-edition/get-book-editions'
import http from '@/lib/http'

import { GET_BOOK_SALES_QUERY_KEY } from '../book/get-book-sales'
import { GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY } from '../user/get-user-counters-by-user-name'

export type CompleteSaleCallParams = {
  saleId: string
}

const completeSaleCall = async ({
  saleId,
}: CompleteSaleCallParams): Promise<undefined> => {
  const response = await http.post<undefined>(`/v1/sale/${saleId}/complete`)

  if (response.status !== 200) {
    throw new Error('Failed to complete sale.')
  }

  return response.data
}

export const useCompleteSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<undefined, Error, CompleteSaleCallParams>({
    mutationFn: completeSaleCall,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_BOOK_EDITIONS_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_BOOK_SALES_QUERY_KEY],
      })
    },
  })
}
