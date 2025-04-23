import { useCallback, useEffect } from 'react'

import { useSignInMutation } from '@/api/auth/sign-in'
import { useSignOutMutation } from '@/api/auth/sign-out'
import { useGetUserQuery } from '@/api/user/get-user'

export const useAuthentication = () => {
  const {
    refetch: refetchUser,
    isFetching: isFetchingUser,
    isFetched: isFetchedUser,
  } = useGetUserQuery()
  const { mutateAsync: callSignIn } = useSignInMutation()
  const { mutateAsync: callSignOut } = useSignOutMutation()

  const signIn = useCallback(async () => {
    await callSignIn(false)
    await refetchUser()
  }, [callSignIn, refetchUser])

  const signOut = useCallback(async () => {
    await callSignOut()
  }, [callSignOut])

  useEffect(() => {
    const checkToken = async () => {
      const token = await callSignIn(true)

      if (token) {
        await refetchUser()
      }
    }

    checkToken()
  }, [callSignIn, refetchUser])

  return {
    isSigningIn: isFetchingUser,
    isSignedIn: isFetchedUser,
    signIn,
    signOut,
  }
}
