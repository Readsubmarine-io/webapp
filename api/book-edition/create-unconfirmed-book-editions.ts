import { useMutation } from '@tanstack/react-query'

import { UnconfirmedBookEdition } from '@/api/book-edition/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export type CreateUnconfirmedBookEditionCallParams = {
  editionAddress: string
  bookId: string
}

const createUnconfirmedBookEditionCall = async (
  params: CreateUnconfirmedBookEditionCallParams,
) => {
  const response = await http.post<UnconfirmedBookEdition>(
    '/v1/edition/unconfirmed',
    params,
  )

  if (response.status !== 201) {
    throw new Error('Failed to create unconfirmed book edition.')
  }

  return response.data
}

export const useCreateUnconfirmedBookEditionMutation = () => {
  return useMutation<
    UnconfirmedBookEdition,
    Error,
    CreateUnconfirmedBookEditionCallParams
  >({
    mutationFn: createUnconfirmedBookEditionCall,
    onError: (error) => {
      assertError(error, 'Failed to create unconfirmed book edition.')
    },
  })
}
