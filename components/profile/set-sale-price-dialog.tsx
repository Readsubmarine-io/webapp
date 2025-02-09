"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SetSalePriceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (price: number) => void
  initialPrice?: number
}

const calculateSellerFee = (price: number) => {
  const feePercentage = 0.025 // 2.5%
  return price * feePercentage
}

export function SetSalePriceDialog({ isOpen, onOpenChange, onConfirm, initialPrice }: SetSalePriceDialogProps) {
  const [tempListPrice, setTempListPrice] = useState(initialPrice?.toString() || "")

  useEffect(() => {
    if (isOpen && initialPrice) {
      setTempListPrice(initialPrice.toString())
    }
  }, [isOpen, initialPrice])

  const handleConfirmSale = () => {
    const price = Number.parseFloat(tempListPrice)
    if (!isNaN(price) && price > 0) {
      onConfirm(price)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dialog">
        <DialogHeader>
          <DialogTitle>Set Sale Price</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Input
            type="number"
            value={tempListPrice}
            onChange={(e) => setTempListPrice(e.target.value)}
            placeholder="Enter sale price in SOL"
          />
          <div className="text-sm text-power-pump-text space-y-1">
            <p>
              Seller fee (2.5%):{" "}
              {tempListPrice && !isNaN(Number.parseFloat(tempListPrice))
                ? `${calculateSellerFee(Number.parseFloat(tempListPrice)).toFixed(4)} SOL`
                : "-"}
            </p>
            <p>
              You will receive:{" "}
              {tempListPrice && !isNaN(Number.parseFloat(tempListPrice))
                ? `${(Number.parseFloat(tempListPrice) - calculateSellerFee(Number.parseFloat(tempListPrice))).toFixed(4)} SOL`
                : "-"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleConfirmSale}
            className="bg-power-pump-button text-white hover:bg-power-pump-button/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-200"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

