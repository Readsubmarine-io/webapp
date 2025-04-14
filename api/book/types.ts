import { FileInfo } from '../file/types'
import { User } from '../user/types'

export type Book = {
  id: string
  title: string
  author: string
  shortDescription: string
  longDescription: string
  pages: number
  genres: string[]
  coverImage: FileInfo
  pdf: FileInfo
  metadata: FileInfo
  collectionAddress: string
  isApproved: boolean
  isShown: boolean
  contactEmail: string
  featured: number
  createdAt: Date
  updatedAt: Date
  creator?: User
  metrics?: BookMetrics
  mint?: Mint
}

export type BookMetrics = {
  id: string
  totalSupply: number
  mintedSupply: number
  price?: string
  floorPrice?: string
  activeSales: number
  sold24h: number
  totalSold: number
  totalOwners: number
  book?: Book
}

export type Mint = {
  id: string
  startDate: Date
  endDate?: Date
  price: number
  mintAddress: string
  book?: Book
}
