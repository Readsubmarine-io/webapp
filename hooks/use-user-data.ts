import { useMemo } from 'react'

import { useGetUserQuery } from '@/api/user/get-user'

export const useUserData = () => {
  const { data: user } = useGetUserQuery()

  const isAuthenticated = useMemo<boolean>(() => {
    return !!user
  }, [user])

  return {
    user,
    isAuthenticated,
  }
}
