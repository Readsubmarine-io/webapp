import { useMutation } from '@tanstack/react-query'

import { Book } from '@/api/book/types'
import { FileInfo } from '@/api/file/types'
import { assertError } from '@/lib/assert-error'
import http from '@/lib/http'

export type CreateBookCallParams = {
  title: string
  author: string
  shortDescription: string
  longDescription: string
  pages: number
  genres: string[]
  coverImage: FileInfo
  pdf: FileInfo
  metadata: FileInfo
  totalCopies: number
  mintStartDate: Date
  mintEndDate: Date | null
  mintPrice: number
  collectionAddress: string
  mintAddress: string
  contactEmail: string
}

const createBookCall = async (book: CreateBookCallParams) => {
  const response = await http.post<Book>('/v1/book', book)

  if (response.status !== 201) {
    throw new Error('Failed to create book.')
  }

  return response.data
}

export const useCreateBookMutation = () => {
  return useMutation<Book, Error, CreateBookCallParams>({
    mutationFn: createBookCall,
    onError: (error) => {
      assertError(error, 'Failed to create book.')
    },
  })
}
