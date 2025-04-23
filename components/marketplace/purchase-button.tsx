'use client'

import { sol } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { CheckCircle, Loader2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'

import { useGetBookSalesQuery } from '@/api/book/get-book-sales'
import { useCompleteSaleMutation } from '@/api/sale/complete-sale'
import { SaleStatus } from '@/api/sale/types'
import { Button } from '@/components/ui/button'
import { AUCTION_HOUSE_ADDRESS } from '@/constants/env'
import { useMetaplex } from '@/hooks/use-metaplex'
import { useUserData } from '@/hooks/use-user-data'
import { assertError } from '@/lib/assert-error'

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useCheckWalletsMissmatch } from '@/hooks/use-check-wallets-missmatch'
import { toast } from 'sonner'
import { IncoorectAccountText } from '@/constants/textings'

interface PurchaseButtonProps {
  bookId: string
}

export function PurchaseButton({ bookId }: PurchaseButtonProps) {
  const { data: sales, isLoading: isLoadingSales } = useGetBookSalesQuery({
    bookId,
    status: SaleStatus.Active,
    sortBy: 'price',
    limit: 100,
    offset: 0,
  })

  const [purchaseState, setPurchaseState] = useState<
    'idle' | 'processing' | 'success'
  >('idle')
  const { metaplex } = useMetaplex()
  const { mutateAsync: completeSale } = useCompleteSaleMutation()
  const { user } = useUserData()
  const { checkWalletsMissmatch } = useCheckWalletsMissmatch()

  const sale = user
    ? sales?.find((sale) => sale.seller?.id !== user?.id)
    : undefined

  const handlePurchase = useCallback(async () => {
    try {
      if (!sale || !metaplex || !AUCTION_HOUSE_ADDRESS) {
        throw new Error('No active sales')
      }

      if (checkWalletsMissmatch()) {
        return
      }

      setPurchaseState('processing')

      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(AUCTION_HOUSE_ADDRESS),
      })

      if (!auctionHouse) {
        return
      }

      const listing = await metaplex.auctionHouse().findListingByReceipt({
        auctionHouse,
        receiptAddress: new PublicKey(sale.listingReceipt || ''),
      })

      if (!listing) {
        return
      }

      await metaplex.auctionHouse().buy({
        auctionHouse,
        listing,
        buyer: metaplex.identity(),
        price: sol(sale.price),
      })

      await completeSale({
        saleId: sale.id,
      })

      setPurchaseState('success')
    } catch (error) {
      assertError(error, 'Failed to purchase eBook.')
    } finally {
      setPurchaseState('idle')
    }
  }, [completeSale, metaplex, sale, checkWalletsMissmatch])

  const isDisabled = !sale
  const userSales = sales?.find((sale) => sale.seller?.id === user?.id)

  const getTooltipText = useCallback(() => {
    if (isDisabled && userSales) {
      return 'Only your copies are available for purchase.'
    }

    if (isDisabled && !userSales) {
      return 'No active sales currently available.'
    }

    return 'Click to purchase eBook.'
  }, [isDisabled, userSales])

  if (isLoadingSales) {
    return (
      <Button
        disabled
        className="w-full md:w-auto bg-power-pump-button text-white flex items-center justify-center rounded-lg"
      >
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (purchaseState === 'processing') {
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

  if (purchaseState === 'success') {
    return (
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">Purchase Successful!</span>
        </div>
        <Link
          href="/profile"
          className="block mt-2 underline text-green-700 hover:text-green-900"
        >
          Go to My Profile
        </Link>
      </div>
    )
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Button
            onClick={handlePurchase}
            disabled={isDisabled}
            className="w-full md:w-auto bg-power-pump-button text-white hover:bg-power-pump-button/90 flex items-center justify-center rounded-lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isDisabled
              ? userSales
                ? 'No suitable sales'
                : 'No active sales'
              : `Buy eBook for ${sale?.price} SOL`}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
