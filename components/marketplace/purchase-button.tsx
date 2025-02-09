"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

export function PurchaseButton() {
  const [purchaseState, setPurchaseState] = useState<"idle" | "processing" | "success">("idle")

  const handlePurchase = async () => {
    setPurchaseState("processing")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setPurchaseState("success")
  }

  if (purchaseState === "processing") {
    return (
      <Button
        disabled
        className="w-full md:w-auto bg-power-pump-button text-white flex items-center justify-center rounded-lg"
      >
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Processing
      </Button>
    )
  }

  if (purchaseState === "success") {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">Purchase Successful!</span>
        </div>
        <Link href="/profile" className="block mt-2 underline text-green-700 hover:text-green-900">
          Go to My Profile
        </Link>
      </div>
    )
  }

  return (
    <Button
      onClick={handlePurchase}
      className="w-full md:w-auto bg-power-pump-button text-white hover:bg-power-pump-button/90 flex items-center justify-center rounded-lg"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Buy eBook
    </Button>
  )
}

