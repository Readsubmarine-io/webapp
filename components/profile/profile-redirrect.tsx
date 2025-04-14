'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useGetUserQuery } from '@/api/user/get-user'

export function ProfileRedirect() {
  const router = useRouter()
  const { data: user } = useGetUserQuery()

  useEffect(() => {
    if (user) {
      router.push(`/profile/${user.userName}`)
    }
  }, [user, router])

  return <></>
}
