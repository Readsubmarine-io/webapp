'use client'

import { Edit } from 'lucide-react'
import { useState } from 'react'

import { BookEdition } from '@/api/book-edition/types'

import { SetSalePriceDialog } from './set-sale-price-dialog'

interface ListPriceProps {
  bookEdition: BookEdition
}

export function ListPrice({ bookEdition }: ListPriceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const displayPrice = bookEdition.sale?.price
    ? `${bookEdition.sale.price} SOL`
    : '-'

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-power-pump-text">
        List: <span className="font-semibold">{displayPrice}</span>
        {/* <USDPriceDisplay amount={(price || 0) * 20} /> */}
      </span>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="text-power-pump-button hover:text-power-pump-button/80 transition-colors"
      >
        <Edit className="w-4 h-4" />
      </button>
      <SetSalePriceDialog
        bookEdition={bookEdition}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
