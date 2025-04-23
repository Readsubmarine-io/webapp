import { useContext } from 'react'
import { PublicKeyContext } from '@/components/public-key-provider'

export const usePublicKey = () => {
  const publicKey = useContext(PublicKeyContext)

  return {
    publicKey,
  }
}
