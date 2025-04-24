'use client'

import { sol } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { BookEdition } from '@/api/book-edition/types'
import { useCancelSaleMutation } from '@/api/sale/cancel-sale'
import { useCreateSaleMutation } from '@/api/sale/create-sale'
import { useUpdateSaleMutation } from '@/api/sale/update-sale'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AUCTION_HOUSE_ADDRESS } from '@/constants/env'
import { IncoorectAccountText } from '@/constants/textings'
import { useCheckWalletsMissmatch } from '@/hooks/use-check-wallets-missmatch'
import { useMetaplex } from '@/hooks/use-metaplex'
import { assertError } from '@/lib/assert-error'

import { NumberInput } from '../ui/number-input'

interface SetSalePriceDialogProps {
  bookEdition: BookEdition
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const calculateSellerFee = (price: number) => {
  const feePercentage = 0.025 // 2.5%
  return price * feePercentage
}

export function SetSalePriceDialog({
  bookEdition,
  isOpen,
  onOpenChange,
}: SetSalePriceDialogProps) {
  const { metaplex } = useMetaplex()
  const { mutateAsync: createSale } = useCreateSaleMutation()
  const { mutateAsync: updateSale } = useUpdateSaleMutation()

  const [userListPrice, setUserListPrice] = useState(
    bookEdition.sale?.price ?? 0,
  )
  const { checkWalletsMissmatch } = useCheckWalletsMissmatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmSale = useCallback(async () => {
    try {
      if (
        userListPrice <= 0 ||
        !metaplex ||
        !bookEdition?.address ||
        !AUCTION_HOUSE_ADDRESS
      ) {
        return
      }

      if (checkWalletsMissmatch()) {
        return
      }

      setIsLoading(true)

      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(AUCTION_HOUSE_ADDRESS),
      })

      if (!auctionHouse) {
        return
      }

      const listing = await metaplex.auctionHouse().list(
        {
          auctionHouse,
          seller: metaplex.identity(),
          mintAccount: new PublicKey(bookEdition.address),
          price: sol(userListPrice),
          printReceipt: true,
        },
        {
          commitment: 'confirmed',
        },
      )

      if (bookEdition.sale) {
        await updateSale({
          saleId: bookEdition.sale.id,
          price: userListPrice,
          listingReceipt: listing.listing.receiptAddress?.toString() || '',
        })
      } else {
        await createSale({
          bookEditionId: bookEdition.id,
          price: userListPrice,
          listingReceipt: listing.listing.receiptAddress?.toString() || '',
        })
      }

      onOpenChange(false)
    } catch (error) {
      assertError(error, 'Failed to set sale price.')
    } finally {
      setIsLoading(false)
    }
  }, [
    bookEdition.address,
    bookEdition.id,
    bookEdition.sale,
    createSale,
    metaplex,
    onOpenChange,
    updateSale,
    userListPrice,
    checkWalletsMissmatch,
  ])

  const { mutateAsync: cancelSale } = useCancelSaleMutation()

  const handleCancelSale = useCallback(async () => {
    try {
      if (
        !metaplex ||
        !bookEdition.sale?.listingReceipt ||
        !bookEdition.sale?.id
      ) {
        return
      }

      if (checkWalletsMissmatch()) {
        return
      }

      setIsLoading(true)

      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(AUCTION_HOUSE_ADDRESS),
      })

      if (!auctionHouse) {
        return
      }

      const listing = await metaplex.auctionHouse().findListingByReceipt({
        auctionHouse,
        receiptAddress: new PublicKey(bookEdition.sale?.listingReceipt || ''),
      })

      if (!listing) {
        return
      }

      await metaplex.auctionHouse().cancelListing(
        {
          auctionHouse,
          listing,
        },
        {
          commitment: 'confirmed',
        },
      )

      await cancelSale({
        saleId: bookEdition.sale.id,
      })

      onOpenChange(false)
    } catch (error) {
      assertError(error, 'Failed to cancel sale.')
    } finally {
      setIsLoading(false)
    }
  }, [
    metaplex,
    bookEdition.sale?.listingReceipt,
    bookEdition.sale?.id,
    cancelSale,
    onOpenChange,
    checkWalletsMissmatch,
  ])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dialog">
        <DialogHeader>
          <DialogTitle>Set Sale Price</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <NumberInput
            initialValue={bookEdition.sale?.price ?? 0}
            onChange={(value) => setUserListPrice(value)}
            allowDecimal={true}
            placeholder="Enter sale price in SOL"
            disabled={isLoading}
          />
          <div className="text-sm text-power-pump-text space-y-1">
            <p>
              Seller fee (2.5%):{' '}
              {userListPrice && !isNaN(userListPrice)
                ? `${calculateSellerFee(userListPrice).toFixed(4)} SOL`
                : '-'}
            </p>
            <p>
              You will receive:{' '}
              {userListPrice && !isNaN(userListPrice)
                ? `${(userListPrice - calculateSellerFee(userListPrice)).toFixed(4)} SOL`
                : '-'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleConfirmSale}
            disabled={isLoading}
            className="bg-power-pump-button text-white hover:bg-power-pump-button/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-200"
          >
            {bookEdition.sale ? 'Update Price' : 'Confirm'}
          </Button>

          {bookEdition.sale && (
            <Button
              onClick={handleCancelSale}
              disabled={isLoading}
              className="bg-red-500 text-white hover:bg-red-500/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-200"
            >
              Cancel Sale
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
