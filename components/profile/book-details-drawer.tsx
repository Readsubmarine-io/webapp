'use client'

import { DollarSign, Download, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { USDPriceDisplay } from '../usd-price-display'
import { ListPrice } from './list-price'
import { SetSalePriceDialog } from './set-sale-price-dialog'

interface Author {
  name: string
  title: string
  bio: string
  avatar: string
}

interface BookDetails {
  id: number
  title: string
  author: Author
  coverImage: string
  tokenId?: string
  purchasePrice?: number
  floorPrice?: number
  description?: string
  details?: {
    format?: string
    pages?: number
    publishedDate?: string
  }
}

interface BookDetailsDrawerProps {
  bookId: number
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isOnSale?: boolean
}

// Simulated API call
const fetchBookDetails = async (id: number): Promise<BookDetails> => {
  // In a real application, this would be an actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  return {
    id,
    title: 'The Quantum Nexus',
    author: {
      name: 'Dr. Amelia Quantum',
      title: 'Physicist and Philosopher',
      bio: 'Dr. Amelia Quantum is a world-renowned physicist and philosopher, known for her groundbreaking work in quantum mechanics and its philosophical implications. She has authored numerous books and papers, bridging the gap between science and philosophy.',
      avatar: '/placeholder.svg',
    },
    coverImage:
      'https://img-cdn.magiceden.dev/autoquality:size:1024000:20:80/f:webp/rs:fill:640:640:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fupload%2F5f983c07-23c8-48d8-a33b-9eac42bd1d9e',
    tokenId: '1234',
    purchasePrice: 1.5,
    floorPrice: 2.0,
    description:
      'The Quantum Nexus is a groundbreaking exploration of the intersection between quantum physics and consciousness. Dr. Amelia Quantum takes readers on a mind-bending journey through the fabric of reality, challenging our perceptions of time, space, and the nature of existence itself.',
    details: {
      format: 'PDF',
      pages: 342,
      publishedDate: 'May 15, 2023',
    },
  }
}

export function BookDetailsDrawer({
  bookId,
  isOpen,
  setIsOpen,
  isOnSale = false,
}: BookDetailsDrawerProps) {
  const [book, setBook] = useState<BookDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [listPrice, setListPrice] = useState<number | undefined>(undefined)
  const [isSetPriceDialogOpen, setIsSetPriceDialogOpen] = useState(false)

  useEffect(() => {
    if (isOpen && bookId) {
      setIsLoading(true)
      fetchBookDetails(bookId)
        .then((data) => {
          setBook(data)
          setListPrice(data.purchasePrice)
        })
        .catch((error) => console.error('Error fetching book details:', error))
        .finally(() => setIsLoading(false))
    }
  }, [isOpen, bookId])

  const handleSaleClick = () => {
    if (isOnSale) {
      console.log('Canceling sale for book:', bookId)
      setIsOpen(false)
    } else {
      setIsSetPriceDialogOpen(true)
    }
  }

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-screen sm:w-[450px] sm:max-w-[450px] flex flex-col bg-drawer">
          <div className="flex-grow overflow-y-auto pb-4 flex items-center justify-center">
            <p>Loading book details...</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  if (!book) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-screen sm:w-[450px] sm:max-w-[450px] flex flex-col bg-drawer">
        <div className="flex-grow overflow-y-auto pb-4">
          <SheetHeader className="mb-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-bold text-power-pump-heading">
                  {book.title}
                </SheetTitle>
              </div>
              <SheetDescription className="text-power-pump-text mt-1 text-left">
                by {book.author.name}
              </SheetDescription>
            </div>
          </SheetHeader>
          <div className="flex gap-4 mb-6">
            <Image
              src={book.coverImage || '/placeholder.svg'}
              alt={book.title}
              width={120}
              height={180}
              className="rounded-lg shadow-md object-cover"
            />
            <div className="flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-sm text-power-pump-text">
                  Token ID:{' '}
                  <span className="font-semibold">#{book.tokenId}</span>
                </p>
                <p className="text-sm text-power-pump-text">
                  Purchase Price:{' '}
                  <span className="font-semibold">
                    {book.purchasePrice} SOL
                  </span>
                </p>
                {isOnSale && (
                  <ListPrice
                    price={listPrice}
                    onPriceChange={(newPrice) => setListPrice(newPrice)}
                  />
                )}
                <p className="text-sm text-power-pump-text">
                  Floor Price:{' '}
                  <span className="font-semibold">{book.floorPrice} SOL</span>
                  <USDPriceDisplay amount={(book.floorPrice || 0) * 20} />
                </p>
              </div>
              {isOnSale && (
                <Badge
                  variant="secondary"
                  className="bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white self-start mt-2"
                >
                  On Sale
                </Badge>
              )}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-power-pump-heading mb-2">
                Book Details
              </h3>
              <div className="text-sm space-y-2">
                <p className="text-power-pump-text">
                  Format:{' '}
                  <span className="font-semibold">{book.details?.format}</span>
                </p>
                <p className="text-power-pump-text">
                  Pages:{' '}
                  <span className="font-semibold">{book.details?.pages}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Science Fiction
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800"
                  >
                    Fantasy
                  </Badge>
                </div>
                <p className="text-power-pump-text">
                  Published:{' '}
                  <span className="font-semibold">
                    {book.details?.publishedDate}
                  </span>
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold text-power-pump-heading mb-2">
                About the Author
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={book.author.avatar || '/placeholder.svg'}
                  alt={book.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-power-pump-heading">
                    {book.author.name}
                  </h4>
                  <p className="text-sm text-power-pump-text">
                    {book.author.title}
                  </p>
                </div>
              </div>
              <p className="text-sm text-power-pump-text">{book.author.bio}</p>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold text-power-pump-heading mb-2">
                About this book
              </h3>
              <p className="text-sm text-power-pump-text">
                {book.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex justify-between gap-4">
            <Button
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => console.log('Download clicked')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              className={`flex-1 ${
                isOnSale
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              onClick={handleSaleClick}
            >
              {isOnSale ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Sale
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Sale
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
      <SetSalePriceDialog
        isOpen={isSetPriceDialogOpen}
        onOpenChange={setIsSetPriceDialogOpen}
        onConfirm={(price) => {
          setListPrice(price)
          setIsOpen(false)
        }}
        initialPrice={listPrice}
      />
    </Sheet>
  )
}
