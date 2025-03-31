import { FileInfo } from '@/api/file/types'

export type User = {
  id: string
  userName: string
  displayName: string
  bio?: string
  website?: string
  avatar?: FileInfo
  email?: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  wallet?: Wallet
}

export type Wallet = {
  address: string
}

export type UserCounters = {
  createdBooks: number
  ownedEditions: number
  activeSales: number
}
