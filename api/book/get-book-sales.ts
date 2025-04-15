import { useQuery } from '@tanstack/react-query'

import { Sale, SaleStatus } from '@/api/sale/types'
import http from '@/lib/http'
import { ListResultBase } from '@/types/list-result-base'
import { ListQueryBaseParams } from '@/types/llist-query-base'

type GetBookSalesResponse = {
  items: Sale[]
} & ListResultBase

type GetBookSalesParams = {
  bookId: string
  status?: SaleStatus
  sortBy?: 'createdAt' | 'price'
} & ListQueryBaseParams

export const getBookSalesCall = async ({
  bookId,
  status,
  sortBy,
  limit,
  offset,
}: GetBookSalesParams): Promise<Sale[]> => {
  const response = await http.get<GetBookSalesResponse>(
    `/v1/book/${bookId}/sales`,
    {
      params: {
        status,
        sortBy,
        limit,
        offset,
      },
    },
  )

  if (response.status !== 200) {
    throw new Error('Failed to get book sales.')
  }

  return response.data.items
}

export const GET_BOOK_SALES_QUERY_KEY = 'book-sales'

export const useGetBookSalesQuery = (params: GetBookSalesParams) => {
  return useQuery<Sale[], Error>({
    queryKey: [GET_BOOK_SALES_QUERY_KEY, params],
    queryFn: () => getBookSalesCall(params),
  })
}
