'use client'

import { Edit } from 'lucide-react'
import { useState } from 'react'

import { USDPriceDisplay } from '../usd-price-display'
import { SetSalePriceDialog } from './set-sale-price-dialog'

interface ListPriceProps {
  price: number | undefined
  onPriceChange: (newPrice: number) => void
}

export function ListPrice({ price, onPriceChange }: ListPriceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const displayPrice = price !== undefined ? price.toFixed(2) : '0.00'

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-power-pump-text">
        List: <span className="font-semibold">{displayPrice} SOL</span>
        <USDPriceDisplay amount={(price || 0) * 20} />
      </span>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="text-power-pump-button hover:text-power-pump-button/80 transition-colors"
      >
        <Edit className="w-4 h-4" />
      </button>
      <SetSalePriceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={(newPrice) => {
          onPriceChange(newPrice)
          setIsDialogOpen(false)
        }}
        initialPrice={price}
      />
    </div>
  )
}
