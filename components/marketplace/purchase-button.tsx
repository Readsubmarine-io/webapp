'use client'

import { sol } from '@metaplex-foundation/js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { CheckCircle, Loader2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { useCompleteSaleMutation } from '@/api/sale/complete-sale'
import { Sale } from '@/api/sale/types'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AUCTION_HOUSE_ADDRESS } from '@/constants/env'
import { useAuthentication } from '@/hooks/use-authentication'
import { useCheckWalletsMissmatch } from '@/hooks/use-check-wallets-missmatch'
import { useMetaplex } from '@/hooks/use-metaplex'
import { useRpc } from '@/hooks/use-rpc'
import { useUserData } from '@/hooks/use-user-data'
import { assertError } from '@/lib/assert-error'
import { sendMetaplexTransaction } from '@/lib/send-metaplex-transaction'
import { formatSolanaPrice } from '@/utils/format-solana-price'

interface PurchaseButtonProps {
  sales?: Sale[] | null
}

export function PurchaseButton({ sales }: PurchaseButtonProps) {
  const [purchaseState, setPurchaseState] = useState<
    'idle' | 'processing' | 'success'
  >('idle')
  const { metaplex } = useMetaplex()
  const { rpc } = useRpc()
  const { mutateAsync: completeSale } = useCompleteSaleMutation()
  const { signIn, isSigningIn } = useAuthentication()
  const { user, isAuthenticated } = useUserData()
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

      const balance = await rpc.getBalance(metaplex.identity().publicKey)

      if (balance < Number(sale.price) * LAMPORTS_PER_SOL) {
        toast.warning('Insufficient balance')
        return
      }

      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(sale.auctionHouseAddress),
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

      const builder = await metaplex
        .auctionHouse()
        .builders()
        .buy({
          auctionHouse,
          listing,
          buyer: metaplex.identity(),
          price: sol(sale.price),
        })

      await sendMetaplexTransaction(metaplex, rpc, builder)

      await completeSale({
        saleId: sale.id,
      })

      setPurchaseState('success')
    } catch (error) {
      assertError(error, 'Failed to purchase eBook.')
    } finally {
      setPurchaseState('idle')
    }
  }, [sale, metaplex, checkWalletsMissmatch, rpc, completeSale])

  const getButtonState = useCallback(() => {
    if (!isAuthenticated) {
      return {
        text: 'Login to purchase eBook',
        tooltip: 'Login to purchase eBook',
        disabled: true,
      }
    }

    if (!sales?.length) {
      return {
        text: 'No active sales',
        tooltip: 'No active sales',
        disabled: true,
      }
    }

    if (!sale) {
      return {
        text: 'No suitable sales',
        tooltip: 'Only your copies are available for purchase',
        disabled: true,
      }
    }

    return {
      text: `Buy eBook for ${formatSolanaPrice(sale.price, true)}`,
      tooltip: `Buy eBook for ${formatSolanaPrice(sale.price, true)}`,
      disabled: false,
    }
  }, [isAuthenticated, sale, sales?.length])

  if (!sales) {
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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center">
        <Button
          disabled={isSigningIn}
          className="w-full md:w-auto bg-power-pump-button text-white hover:bg-power-pump-button/90 flex items-center justify-center rounded-lg"
          onClick={signIn}
        >
          {isSigningIn ? 'Connecting...' : 'Connect Wallet'}
        </Button>
        <p className="text-md text-power-pump-text ml-2">
          Connect your wallet to purchase eBook
        </p>
      </div>
    )
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Button
            onClick={handlePurchase}
            disabled={getButtonState().disabled}
            className="w-full md:w-auto bg-power-pump-button text-white hover:bg-power-pump-button/90 flex items-center justify-center rounded-lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {getButtonState().text}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getButtonState().tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
