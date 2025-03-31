import { useMutation, useQueryClient } from '@tanstack/react-query'

import { signOut } from '@/lib/sign-out'

export const useSignOutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      signOut(queryClient)
    },
  })
}
