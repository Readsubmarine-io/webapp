import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import { useSignInMutation } from '@/api/auth/sign-in'
import { useSignOutMutation } from '@/api/auth/sign-out'
import { useGetUserQuery } from '@/api/user/get-user'

export const useAuthentication = (homeRedirect: boolean = false) => {
  const router = useRouter()
  const {
    refetch: refetchUser,
    isFetching: isFetchingUser,
    isFetched: isFetchedUser,
  } = useGetUserQuery()
  const { mutateAsync: callSignIn, isPending: isSignInPending } =
    useSignInMutation()
  const { mutateAsync: callSignOut } = useSignOutMutation()

  const signIn = useCallback(async () => {
    await callSignIn(false)
    await refetchUser()
  }, [callSignIn, refetchUser])

  const signOut = useCallback(async () => {
    await callSignOut()

    if (homeRedirect) {
      router.push('/')
    }
  }, [callSignOut, homeRedirect, router])

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
    isSigningIn: isFetchingUser || isSignInPending,
    isSignedIn: isFetchedUser,
    signIn,
    signOut,
  }
}
