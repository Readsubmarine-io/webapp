import { BookEdition } from '../book-edition/types'
import { User } from '../user/types'

export type Sale = {
  id: string
  price: number
  listingReceipt: string
  status: SaleStatus
  createdAt: Date
  bookEdition?: BookEdition
  seller?: User
}

export enum SaleStatus {
  Active = 'Active',
  Sold = 'Sold',
  Canceled = 'Canceled',
}
