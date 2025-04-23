import { useCallback, useMemo } from 'react'
import { usePublicKey } from './use-public-key'

import { useUserData } from './use-user-data'
import { assertError } from '@/lib/assert-error'
import { toast } from 'sonner'

export const useCheckWalletsMissmatch = () => {
  const { user } = useUserData()
  const { publicKey } = usePublicKey()

  const checkWalletsMissmatch = useCallback(() => {
    if (!user || !publicKey) {
      return true
    }

    if (user?.wallet?.address !== publicKey) {
      toast.warning('Your account wallet address missmatch connected wallet')
    }

    return user?.wallet?.address !== publicKey
  }, [user, publicKey])

  return {
    checkWalletsMissmatch,
  }
}
