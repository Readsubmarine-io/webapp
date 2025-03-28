// Existing types...

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  bio: string
  username: string
  website: string
  walletAddress: string
}

export interface Book {
  id: number
  title: string
  coverImage: string
  price: number
  purchasePrice?: number
  floorPrice: number
  author: string
  description: string
  totalSupply: number
  mintedSupply: number
  isOnSale: boolean
}

export interface Project {
  id: number
  title: string
  coverImage: string
  description: string
  status: 'In Review' | 'Verified'
  createdAt: string
  updatedAt: string
  price: number
  totalSupply: number
  mintedSupply: number
}
