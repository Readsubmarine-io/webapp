import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Sale } from '@/api/sale/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

import { GET_BOOK_EDITIONS_QUERY_KEY } from '../book-edition/get-book-editions'
import { GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY } from '../user/get-user-counters-by-user-name'
export type CreateSaleCallParams = {
  bookEditionId: string
  price: number
  listingReceipt: string
}

const createSaleCall = async (
  createSaleCallParams: CreateSaleCallParams,
): Promise<Sale> => {
  const response = await http.post<Sale>('/v1/sale', createSaleCallParams)

  if (response.status !== 201) {
    throw new Error('Failed to create sale.')
  }

  return response.data
}

export const useCreateSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Sale, Error, CreateSaleCallParams>({
    mutationFn: createSaleCall,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_BOOK_EDITIONS_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_USER_COUNTERS_BY_USER_ID_QUERY_KEY],
      })
      toast.success('Sale created')
    },
    onError: (error) => {
      assertError(error, 'Failed to create sale.')
    },
  })
}
