import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { GET_SETTINGS_QUERY_KEY } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export type UpdateSettingCallParams = {
  key: SettingKey
  value: string | number | string[]
}

const updateSettingCall = async ({ key, value }: UpdateSettingCallParams) => {
  const response = await http.put(`/v1/setting/${key}`, {
    value,
  })

  if (response.status !== 200) {
    throw new Error('Failed to update setting.')
  }

  return response.data
}

export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, UpdateSettingCallParams>({
    mutationFn: updateSettingCall,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_SETTINGS_QUERY_KEY],
      })
      toast.success('Setting updated')
    },
    onError: (error) => {
      assertError(error, 'Failed to update setting.')
    },
  })
}
