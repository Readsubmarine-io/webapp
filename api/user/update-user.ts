import { useMutation, useQueryClient } from '@tanstack/react-query'

import http from '@/lib/http'

import { GET_USER_QUERY_KEY } from './get-user'
import { GET_USER_BY_USERNAME_QUERY_KEY } from './get-user-by-user-name'

type UpdateUserCallParams = {
  displayName?: string
  bio?: string
  website?: string
  email?: string
}

const updateUserCall = async (updatedFields: UpdateUserCallParams) => {
  const response = await http.put('/v1/user', {
    ...updatedFields,
  })

  if (response.status !== 200) {
    throw new Error('Failed to update user.')
  }

  return response.data
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserCall,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_USER_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [GET_USER_BY_USERNAME_QUERY_KEY],
      })
    },
  })
}
