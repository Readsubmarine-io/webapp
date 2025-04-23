import { useCallback } from 'react'
import { usePublicKey } from '@/hooks/use-public-key'
import { useUserData } from '@/hooks/use-user-data'
import { toast } from 'sonner'
import { IncoorectAccountText } from '@/constants/textings'
import { useSignOutMutation } from '@/api/auth/sign-out'

export const useCheckWalletsMissmatch = () => {
  const { user } = useUserData()
  const { publicKey } = usePublicKey()
  const { mutateAsync: signOut } = useSignOutMutation()

  const checkWalletsMissmatch = useCallback(() => {
    if (!user || !publicKey) {
      return true
    }

    if (user?.wallet?.address !== publicKey) {
      toast.warning(IncoorectAccountText)
      signOut()
      return true
    }

    return false
  }, [user, publicKey, signOut])

  return {
    checkWalletsMissmatch,
  }
}
