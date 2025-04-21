import { useMutation, useQueryClient } from '@tanstack/react-query'

import { GET_BOOK_EDITIONS_QUERY_KEY } from '@/api/book-edition/get-book-editions'
import { Sale } from '@/api/sale/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export type UpdateSaleCallParams = {
  saleId: string
  price: number
  listingReceipt: string
}

const updateSaleCall = async ({
  saleId,
  price,
  listingReceipt,
}: UpdateSaleCallParams): Promise<Sale> => {
  const response = await http.put<Sale>(`/v1/sale/${saleId}`, {
    price,
    listingReceipt,
  })

  if (response.status !== 200) {
    throw new Error('Failed to update sale.')
  }

  return response.data
}

export const useUpdateSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Sale, Error, UpdateSaleCallParams>({
    mutationFn: updateSaleCall,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_BOOK_EDITIONS_QUERY_KEY],
      })
    },
    onError: (error) => {
      assertError(error, 'Failed to update sale.')
    },
  })
}
