import { DropdownMenuPortal } from '@radix-ui/react-dropdown-menu'
import { Download, Eye } from 'lucide-react'
import { DollarSign, MoreVertical } from 'lucide-react'
import Image from 'next/image'

import { BookEdition } from '@/api/book-edition/types'
import { ListPrice } from '@/components/profile/list-price'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatSolanaPrice } from '@/utils/format-solana-price'

export type BookEditionCardProps = {
  bookEdition: BookEdition
  isOwner: boolean
  handleViewBook: (bookEdition: BookEdition) => void
  setSelectedBookForSale: (bookEdition: BookEdition) => void
  setIsSetPriceDialogOpen: (isOpen: boolean) => void
}

export function BookEditionCard({
  bookEdition,
  isOwner,
  handleViewBook,
  setSelectedBookForSale,
  setIsSetPriceDialogOpen,
}: BookEditionCardProps) {
  const book = bookEdition.book
  const coverImageUrl = book?.coverImage?.metadata.srcUrl
  const pdfUrl = book?.pdf?.metadata.srcUrl

  return (
    <Card
      key={bookEdition.id}
      className="overflow-hidden h-full relative flex flex-row"
    >
      <div className="w-1/3 aspect-[3/4] relative">
        <Image
          src={coverImageUrl || '/placeholder.svg'}
          alt={book?.title || ''}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardContent className="p-4 flex flex-col w-2/3 relative">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-power-pump-button font-semibold">
            {bookEdition.name}
          </span>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none relative z-10">
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-power-pump-text hover:text-power-pump-button transition-colors" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  className="w-48 sm:w-56 bg-contextMenu text-contextMenu-foreground"
                  align="end"
                >
                  <DropdownMenuItem
                    className="DropdownMenuItem cursor-pointer flex items-center"
                    onSelect={() => handleViewBook(bookEdition)}
                  >
                    <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="DropdownMenuItem cursor-pointer flex items-center"
                    onSelect={() => {
                      setSelectedBookForSale(bookEdition)
                      setIsSetPriceDialogOpen(true)
                    }}
                  >
                    <DollarSign className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">Sale</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="DropdownMenuItem cursor-pointer flex items-center"
                    onSelect={() => window.open(pdfUrl, '_blank')}
                  >
                    <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">Download</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-1 text-power-pump-heading line-clamp-2">
          {book?.title}
        </h3>
        <p className="text-sm text-power-pump-text mb-2">{book?.author}</p>
        <div className="flex flex-col space-y-1 mt-auto">
          {/* <span className="text-sm text-power-pump-text">
            Bought: <span className="font-semibold">-</span>
          </span> */}
          <ListPrice bookEdition={bookEdition} isOwner={isOwner} />
          <span className="text-sm text-power-pump-text">
            Floor price:{' '}
            <span className="font-semibold">
              {book?.metrics?.floorPrice
                ? formatSolanaPrice(book?.metrics?.floorPrice, true)
                : '-'}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
