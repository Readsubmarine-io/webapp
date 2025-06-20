import { Book } from '@/api/book/types'
import { Sale } from '@/api/sale/types'
import { Wallet } from '@/api/user/types'

export type BookEdition = {
  id: string
  address: string
  name: string
  mintedAt: Date
  book?: Book
  ownership?: BookEditionOwnership
  sale?: Sale
}

export type BookEditionOwnership = {
  id: string
  receivedAt: Date
  transferredAt?: Date
  wallet?: Wallet
  bookEdition?: BookEdition
}

export enum UnconfirmedBookEditionType {
  Mint = 'Mint',
  Transfer = 'Transfer',
}

export type UnconfirmedBookEdition = {
  editionAddress: string
  createdAt: Date
  book: Book
  type: UnconfirmedBookEditionType
}
