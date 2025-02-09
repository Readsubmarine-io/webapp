"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MintingSectionProps {
  price: number
  currency: string
}

export function MintingSection({ price, currency }: MintingSectionProps) {
  const [tokenCount, setTokenCount] = useState(1)
  const totalPrice = price * tokenCount

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setTokenCount(Math.max(1, tokenCount - 1))}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center"
          >
            -
          </Button>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={tokenCount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "")
              setTokenCount(Math.max(1, Number.parseInt(value) || 1))
            }}
            className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button
            onClick={() => setTokenCount(tokenCount + 1)}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center"
          >
            +
          </Button>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 rounded-full px-6 py-2 sm:py-3 text-sm sm:text-base font-bold transition-colors w-full sm:w-auto">
          Mint {tokenCount} token{tokenCount > 1 ? "s" : ""} for {totalPrice.toFixed(2)} {currency}
        </Button>
      </div>
    </div>
  )
}

