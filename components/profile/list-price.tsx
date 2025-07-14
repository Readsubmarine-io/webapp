'use client'

import { Edit } from 'lucide-react'
import { DateTime } from 'luxon'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { BookEdition } from '@/api/book-edition/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatSolanaPrice } from '@/utils/format-solana-price'

import { SetSalePriceDialog } from './set-sale-price-dialog'

interface ListPriceProps {
  bookEdition: BookEdition
  isOwner: boolean
}

export function ListPrice({ bookEdition, isOwner }: ListPriceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const displayPrice = bookEdition.sale?.price
    ? formatSolanaPrice(bookEdition.sale.price, true)
    : '-'

  const isOnMint = useCallback(() => {
    const book = bookEdition.book
    const isMintDataAvailable =
      book?.metrics?.mintedSupply &&
      book.metrics.totalSupply &&
      book.mint?.endDate

    if (!isMintDataAvailable) return true

    const isMintEnded =
      (book.mint?.endDate &&
        DateTime.fromJSDate(book.mint?.endDate) <= DateTime.now()) ||
      book.metrics?.mintedSupply === book.metrics?.totalSupply

    return !isMintEnded
  }, [bookEdition.book])

  const handleEditClick = () => {
    if (isOnMint()) {
      toast.warning('Could not sell when mint is not ended.')
      return
    }
    setIsDialogOpen(true)
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-power-pump-text">
        List: <span className="font-semibold">{displayPrice}</span>
        {/* <USDPriceDisplay amount={(price || 0) * 20} /> */}
      </span>
      {isOwner && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleEditClick}
              className={`text-power-pump-button hover:text-power-pump-button/80 transition-colors ${
                isOnMint() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Edit className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          {isOnMint() && (
            <TooltipContent>
              <p>Could not sell when mint is not ended.</p>
            </TooltipContent>
          )}
        </Tooltip>
      )}
      <SetSalePriceDialog
        bookEdition={bookEdition}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
