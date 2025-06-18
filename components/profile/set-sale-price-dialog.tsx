'use client'

import { sol } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { DateTime } from 'luxon'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { BookEdition } from '@/api/book-edition/types'
import { useGetIsPlatformTokenOwnerQuery } from '@/api/platform/getIsPlatformTokenOwner'
import { useCancelSaleMutation } from '@/api/sale/cancel-sale'
import { useCreateSaleMutation } from '@/api/sale/create-sale'
import { useUpdateSaleMutation } from '@/api/sale/update-sale'
import { useGetUserQuery } from '@/api/user/get-user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NumberInput } from '@/components/ui/number-input'
import {
  AUCTION_HOUSE_ADDRESS,
  REDUCED_AUCTION_HOUSE_ADDRESS,
} from '@/constants/env'
import { useCheckWalletsMissmatch } from '@/hooks/use-check-wallets-missmatch'
import { useMetaplex } from '@/hooks/use-metaplex'
import { useRpc } from '@/hooks/use-rpc'
import { assertError } from '@/lib/assert-error'
import { sendMetaplexTransaction } from '@/lib/send-metaplex-transaction'

interface SetSalePriceDialogProps {
  bookEdition: BookEdition
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const calculateSellerFee = (price: number, feePercentage: number) => {
  return price * feePercentage
}

export function SetSalePriceDialog({
  bookEdition,
  isOpen,
  onOpenChange,
}: SetSalePriceDialogProps) {
  const { metaplex } = useMetaplex()
  const { data: user } = useGetUserQuery()
  const { mutateAsync: createSale } = useCreateSaleMutation()
  const { mutateAsync: updateSale } = useUpdateSaleMutation()
  const { data: isPlatformTokenOwner, isLoading: isPlatformTokenOwnerLoading } =
    useGetIsPlatformTokenOwnerQuery({
      walletAddress: user?.wallet?.address || '',
    })

  const { rpc } = useRpc()

  const [userListPrice, setUserListPrice] = useState<number>(
    bookEdition.sale?.price ?? 0,
  )
  const { checkWalletsMissmatch } = useCheckWalletsMissmatch()
  const [isLoading, setIsLoading] = useState(false)

  const validatePrice = useCallback(() => {
    if (userListPrice <= 0 || !userListPrice) {
      return false
    }

    return true
  }, [userListPrice])

  // Need to check if the book was minted more than 3 minutes ago to be sure that helius is listening to the mint events
  const isSaveTimeOffset = useMemo(() => {
    if (!bookEdition.mintedAt) {
      return false
    }

    const mintedDate = DateTime.fromJSDate(new Date(bookEdition.mintedAt))
    const now = DateTime.now()

    return now.diff(mintedDate, 'minutes').minutes >= 3
  }, [bookEdition.mintedAt])

  const sellerFee = useMemo(() => {
    return isPlatformTokenOwner ? 0.01 : 0.025
  }, [isPlatformTokenOwner])

  const handleConfirmSale = useCallback(async () => {
    try {
      setIsLoading(true)

      if (!validatePrice()) {
        toast.error('Invalid price.')
        return
      }

      if (
        userListPrice <= 0 ||
        !metaplex ||
        !rpc ||
        !bookEdition?.address ||
        !AUCTION_HOUSE_ADDRESS ||
        !REDUCED_AUCTION_HOUSE_ADDRESS ||
        isPlatformTokenOwnerLoading
      ) {
        return
      }

      if (checkWalletsMissmatch()) {
        return
      }

      const auctionHouseAddress = bookEdition?.sale?.auctionHouseAddress
        ? bookEdition?.sale?.auctionHouseAddress
        : isPlatformTokenOwner
          ? REDUCED_AUCTION_HOUSE_ADDRESS
          : AUCTION_HOUSE_ADDRESS

      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(auctionHouseAddress),
      })

      if (!auctionHouse) {
        return
      }

      const builder = metaplex
        .auctionHouse()
        .builders()
        .list({
          auctionHouse,
          seller: metaplex.identity(),
          mintAccount: new PublicKey(bookEdition.address),
          price: sol(userListPrice),
          printReceipt: true,
        })

      const { receipt } = await sendMetaplexTransaction(metaplex, rpc, builder)

      if (bookEdition.sale) {
        await updateSale({
          saleId: bookEdition.sale.id,
          price: userListPrice,
          listingReceipt: receipt?.toString() || '',
          auctionHouseAddress: auctionHouseAddress,
        })
      } else {
        await createSale({
          bookEditionId: bookEdition.id,
          price: userListPrice,
          listingReceipt: receipt?.toString() || '',
          auctionHouseAddress: auctionHouseAddress,
        })
      }

      onOpenChange(false)
    } catch (error) {
      assertError(error, 'Failed to set sale price.')
    } finally {
      setIsLoading(false)
    }
  }, [
    validatePrice,
    userListPrice,
    metaplex,
    rpc,
    bookEdition.address,
    bookEdition.sale,
    bookEdition.id,
    isPlatformTokenOwner,
    isPlatformTokenOwnerLoading,
    checkWalletsMissmatch,
    onOpenChange,
    updateSale,
    createSale,
  ])

  const { mutateAsync: cancelSale } = useCancelSaleMutation()

  const handleCancelSale = useCallback(async () => {
    try {
      if (
        !metaplex ||
        !rpc ||
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
        address: new PublicKey(bookEdition.sale?.auctionHouseAddress || ''),
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

      const builder = metaplex.auctionHouse().builders().cancelListing({
        auctionHouse,
        listing,
      })

      await sendMetaplexTransaction(metaplex, rpc, builder)

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
    rpc,
    bookEdition.sale?.listingReceipt,
    bookEdition.sale?.id,
    bookEdition.sale?.auctionHouseAddress,
    checkWalletsMissmatch,
    cancelSale,
    onOpenChange,
  ])

  const [error, setError] = useState('')
  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    if (!isTouched) {
      return
    }

    if (!validatePrice()) {
      setError('Price is required. Please enter a valid price.')
    } else {
      setError('')
    }
  }, [validatePrice, isTouched])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(change) => {
        onOpenChange(change)
        setError('')
      }}
    >
      <DialogContent className="bg-dialog">
        <DialogHeader>
          <DialogTitle>Set Sale Price</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <NumberInput
            initialValue={bookEdition.sale?.price ?? 0}
            onChange={(value) => setUserListPrice(value)}
            allowDecimal={true}
            maxDecimals={6}
            placeholder="Enter sale price in SOL"
            disabled={isLoading}
            onClick={() => setIsTouched(true)}
          />
          {error && (
            <p
              className="text-sm text-red-500 mt-0"
              style={{
                marginTop: 3,
              }}
            >
              {error}
            </p>
          )}
          <div className="text-sm text-power-pump-text space-y-1">
            <p>
              Seller fee ({sellerFee * 100}%):{' '}
              {userListPrice && !isNaN(userListPrice)
                ? `${calculateSellerFee(userListPrice, sellerFee)
                    .toFixed(6)
                    .replace(/\.?0+$/, '')} SOL`
                : '-'}
            </p>
            <p>
              You will receive:{' '}
              {userListPrice && !isNaN(userListPrice)
                ? `${(userListPrice - calculateSellerFee(userListPrice, sellerFee)).toFixed(6).replace(/\.?0+$/, '')} SOL`
                : '-'}
            </p>
          </div>
        </div>
        {!isSaveTimeOffset && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Please wait before listing
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You need to wait at least 3 minutes after minting before you
                    can list your book for sale. This ensures all systems are
                    properly synchronized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={handleConfirmSale}
            disabled={isLoading || !isSaveTimeOffset}
            className="bg-power-pump-button text-white hover:bg-power-pump-button/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-200"
          >
            {bookEdition.sale ? 'Update Price' : 'Confirm'}
          </Button>

          {bookEdition.sale && (
            <Button
              onClick={handleCancelSale}
              disabled={isLoading || !isSaveTimeOffset}
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
