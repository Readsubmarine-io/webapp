import { useMutation, useQueryClient } from '@tanstack/react-query'

import { assertError } from '@/lib/assert-error'
import { signOut } from '@/lib/sign-out'

export const useSignOutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      signOut(queryClient)
    },
    onError: (error) => {
      assertError(error, 'Failed to sign out.')
    },
  })
}
