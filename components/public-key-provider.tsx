'use client'

import { useRouter } from 'next/navigation'
import { createContext, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useSignOutMutation } from '@/api/auth/sign-out'
import { useUserData } from '@/hooks/use-user-data'

type PublicKeyProviderProps = {
  children: React.ReactNode
  homeRedirect: boolean
}

export const PublicKeyContext = createContext<string | null>(null)

export function PublicKeyProvider({
  children,
  homeRedirect,
}: PublicKeyProviderProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [updatePublicKeyInterval, setUpdatePublicKeyInterval] =
    useState<NodeJS.Timeout | null>(null)
  const { mutate: signOut } = useSignOutMutation()
  const { isAuthenticated } = useUserData()
  const router = useRouter()

  const updatePublicKey = useCallback(
    async (shouldSignOut: boolean = true) => {
      try {
        const handleSignOut = () => {
          try {
            if (!shouldSignOut) {
              return
            }

            signOut()

            if (homeRedirect) {
              router.push('/')
            } else {
              router.refresh()
            }

            toast.warning('Your wallet has been changed. Please sign in again.')
          } catch (error) {
            console.error('Error signing out:', error)
          }
        }

        await window.solana.connect({ onlyIfTrusted: true })
        const newPublicKey = window.solana.publicKey?.toString()

        setPublicKey((current) => {
          if (current && current !== newPublicKey && isAuthenticated) {
            handleSignOut()
          }

          return newPublicKey
        })
      } catch (error) {
        console.error('Error updating public key:', error)
      }
    },
    [isAuthenticated],
  )

  useEffect(() => {
    updatePublicKey(false)
    const interval = setInterval(updatePublicKey, 1000)

    setUpdatePublicKeyInterval((prev) => {
      if (prev) {
        clearInterval(prev)
      }

      return interval
    })

    return () => {
      if (updatePublicKeyInterval) {
        clearInterval(updatePublicKeyInterval)
      }
    }
  }, [isAuthenticated])

  return (
    <PublicKeyContext.Provider value={publicKey}>
      {children}
    </PublicKeyContext.Provider>
  )
}
