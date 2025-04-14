'use client'

import { DollarSign, Download, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { BookEdition } from '@/api/book-edition/types'
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

import { ListPrice } from './list-price'
import { SetSalePriceDialog } from './set-sale-price-dialog'

interface BookDetailsDrawerProps {
  bookEdition: BookEdition
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isOnSale?: boolean
}

export function BookDetailsDrawer({
  bookEdition,
  isOpen,
  setIsOpen,
  isOnSale = false,
}: BookDetailsDrawerProps) {
  const book = bookEdition.book

  const [isSetPriceDialogOpen, setIsSetPriceDialogOpen] = useState(false)

  const handleSaleClick = () => {
    if (isOnSale) {
      console.log('Canceling sale for book:', bookEdition.id)
      setIsOpen(false)
    } else {
      setIsSetPriceDialogOpen(true)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-screen sm:w-[450px] sm:max-w-[450px] flex flex-col bg-drawer">
        <div className="flex-grow overflow-y-auto pb-4">
          <SheetHeader className="mb-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-bold text-power-pump-heading">
                  {book?.title}
                </SheetTitle>
              </div>
              <SheetDescription className="text-power-pump-text mt-1 text-left">
                by {book?.author}
              </SheetDescription>
            </div>
          </SheetHeader>
          <div className="flex gap-4 mb-6">
            <Image
              src={book?.coverImage?.metadata.srcUrl || '/placeholder.svg'}
              alt={book?.title || ''}
              width={120}
              height={180}
              className="rounded-lg shadow-md object-cover"
            />
            <div className="flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-sm text-power-pump-text">
                  Token:{' '}
                  <span className="font-semibold">{bookEdition.name}</span>
                </p>
                <p className="text-sm text-power-pump-text">
                  Bought: <span className="font-semibold">-</span>
                </p>
                {isOnSale && <ListPrice bookEdition={bookEdition} />}
                <p className="text-sm text-power-pump-text">
                  Floor Price:{' '}
                  <span className="font-semibold">
                    {book?.metrics?.floorPrice
                      ? `${book?.metrics?.floorPrice} SOL`
                      : '-'}
                  </span>
                  {/* <USDPriceDisplay amount={(book.floorPrice || 0) * 20} /> */}
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
                  Format: <span className="font-semibold">PDF</span>
                </p>
                <p className="text-power-pump-text">
                  Pages: <span className="font-semibold">{book?.pages}</span>
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
                    {new Date(book?.createdAt || '').toDateString()}
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
                  src={
                    book?.creator?.avatar?.metadata.srcUrl || '/placeholder.svg'
                  }
                  alt={book?.creator?.displayName || ''}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-power-pump-heading">
                    {book?.author}
                  </h4>
                  <p className="text-sm text-power-pump-text">
                    {book?.creator?.displayName}
                  </p>
                </div>
              </div>
              <p className="text-sm text-power-pump-text">
                {book?.creator?.bio}
              </p>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold text-power-pump-heading mb-2">
                About this book
              </h3>
              <p className="text-sm text-power-pump-text">
                {book?.longDescription || 'No description available.'}
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
        bookEdition={bookEdition}
        isOpen={isSetPriceDialogOpen}
        onOpenChange={setIsSetPriceDialogOpen}
      />
    </Sheet>
  )
}
