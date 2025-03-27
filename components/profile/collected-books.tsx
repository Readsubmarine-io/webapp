'use client'

import { DollarSign, Download, Eye, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Book } from '@/types/profile'

import { USDPriceDisplay } from '../usd-price-display'
import { BookDetailsDrawer } from './book-details-drawer'
import { ListPrice } from './list-price'
import { SetSalePriceDialog } from './set-sale-price-dialog'

interface CollectedBooksProps {
  books: Book[]
}

export function CollectedBooks({ books }: CollectedBooksProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isSetPriceDialogOpen, setIsSetPriceDialogOpen] = useState(false)
  const [selectedBookForSale, setSelectedBookForSale] = useState<Book | null>(
    null,
  )

  const handleSetSalePrice = (book: Book, price: number) => {
    // In a real application, you would update this on the server
    console.log(`Setting sale price for book ${book.id} to ${price}`)
  }

  const handleViewBook = (book: Book) => {
    setSelectedBook(book)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {books.map((book) => (
        <Card
          key={book.id}
          className="overflow-hidden h-full relative flex flex-row"
        >
          <div className="w-1/3 aspect-[3/4] relative">
            <Image
              src={book.coverImage || '/placeholder.svg'}
              alt={book.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardContent className="p-4 flex flex-col w-2/3 relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-power-pump-button font-semibold">
                #{book.id}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none relative z-10">
                  <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-power-pump-text hover:text-power-pump-button transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 sm:w-56 bg-contextMenu text-contextMenu-foreground">
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onSelect={() => handleViewBook(book)}
                  >
                    <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onSelect={() => {
                      setSelectedBookForSale(book)
                      setIsSetPriceDialogOpen(true)
                    }}
                  >
                    <DollarSign className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">Sale</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center"
                    onSelect={() => console.log('Download', book.id)}
                  >
                    <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">Download</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-power-pump-heading line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-power-pump-text mb-2">{book.author}</p>
            <div className="flex flex-col space-y-1 mt-auto">
              <span className="text-sm text-power-pump-text">
                Bought:{' '}
                <span className="font-semibold">{book.purchasePrice} SOL</span>
              </span>
              <ListPrice
                price={book.price}
                onPriceChange={(newPrice) => handleSetSalePrice(book, newPrice)}
              />
              <span className="text-sm text-power-pump-text">
                Floor:{' '}
                <span className="font-semibold">{book.floorPrice} SOL</span>
                <USDPriceDisplay amount={book.floorPrice * 20} />
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
      {selectedBook && (
        <BookDetailsDrawer
          bookId={selectedBook.id}
          isOpen={!!selectedBook}
          setIsOpen={(isOpen) => !isOpen && setSelectedBook(null)}
        />
      )}
      <SetSalePriceDialog
        isOpen={isSetPriceDialogOpen}
        onOpenChange={setIsSetPriceDialogOpen}
        onConfirm={(price) => {
          if (selectedBookForSale) {
            handleSetSalePrice(selectedBookForSale, price)
          }
          setIsSetPriceDialogOpen(false)
          setSelectedBookForSale(null)
        }}
        initialPrice={selectedBookForSale?.price}
      />
    </div>
  )
}
