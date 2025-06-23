'use client'

import {
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Book } from '@/api/book/types'
import { useCreateUnconfirmedBookEditionMutation } from '@/api/book-edition/create-unconfirmed-book-editions'
import { useGetBookEditionsQuery } from '@/api/book-edition/get-book-editions'
import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthentication } from '@/hooks/use-authentication'
import { useCheckWalletsMissmatch } from '@/hooks/use-check-wallets-missmatch'
import { useRpc } from '@/hooks/use-rpc'
import { useUmi } from '@/hooks/use-umi'
import { useUserData } from '@/hooks/use-user-data'
import { assertError } from '@/lib/assert-error'
import { buildGuards } from '@/lib/build-guards'
import { sendUmiTransaction } from '@/lib/send-umi-transaction'
import { formatSolanaPrice } from '@/utils/format-solana-price'

interface MintingSectionProps {
  book: Book
  onMintSuccess?: () => void
}

export function MintingSection({ book, onMintSuccess }: MintingSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const totalPrice = Number(book.mint?.price)
  const { umi } = useUmi()
  const { rpc } = useRpc()
  const { signIn, isSigningIn } = useAuthentication()
  const { checkWalletsMissmatch } = useCheckWalletsMissmatch()
  const { mutateAsync: createUnconfirmedBookEdition } =
    useCreateUnconfirmedBookEditionMutation()

  const { isAuthenticated, user } = useUserData()
  const { data: editions } = useGetBookEditionsQuery({
    bookId: book.id,
    ownerAddress: user?.wallet?.address,
  })

  const { data: settings } = useGetSettingsQuery()
  const paymentAddress = settings?.[SettingKey.PaymentAddress] || ''

  useEffect(() => {
    setIsMinting(false)
  }, [editions?.length])

  const handleMint = useCallback(async () => {
    if (!umi || !rpc) {
      assertError(
        new Error('Wallet connection required'),
        'Wallet connection required.',
      )
      return
    }

    if (checkWalletsMissmatch()) {
      return
    }

    if (
      !book.mint?.mintAddress ||
      !book.collectionAddress ||
      !book.creator?.wallet?.address
    ) {
      assertError(
        new Error(
          'Missing required mint address, collection address, or creator address',
        ),
        'Unknown error.',
      )
      return
    }

    if (!paymentAddress) {
      assertError(
        new Error('Payment address not found'),
        'Payment address not found.',
      )
      return
    }

    try {
      setIsLoading(true)
      const candyMachinePublicKey = publicKey(book.mint?.mintAddress)
      const creatorPublicKey = publicKey(book.creator?.wallet?.address)

      // Fetch candy machine and candy guard data to verify constraints
      const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey)

      if (!candyMachine) {
        throw new Error('Candy machine not found')
      }

      if ((book.metrics?.totalSupply || 0) <= candyMachine.itemsRedeemed) {
        toast.warning('All copies have been minted')
        return
      }

      const nftMint = generateSigner(umi)

      const balance = await umi.rpc.getBalance(umi.identity.publicKey)

      if (balance.basisPoints < Number(book.mint?.price) * LAMPORTS_PER_SOL) {
        toast.warning('Insufficient balance')
        return
      }

      const guards = buildGuards({
        mintPrice: Number(book.mint?.price),
        mintPriceReceiver: publicKey(paymentAddress),
        mintStartDate: new Date(),
        mintEndDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      })

      const transaction = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 2_000_000 }))
        .add(setComputeUnitPrice(umi, { microLamports: 500_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            nftMint: nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: creatorPublicKey,
            tokenStandard: candyMachine.tokenStandard,
            mintArgs: guards,
          }),
        )

      await sendUmiTransaction(umi, rpc, transaction, 'finalized')
      await createUnconfirmedBookEdition({
        editionAddress: nftMint.publicKey.toString(),
        bookId: book.id,
      })

      toast.success('Minted successfully!')

      setIsMinting(true)
      onMintSuccess?.()
    } catch (error: unknown) {
      assertError(error, 'Failed to mint.')
    } finally {
      setIsLoading(false)
    }
  }, [
    umi,
    rpc,
    checkWalletsMissmatch,
    book.mint?.mintAddress,
    book.mint?.price,
    book.collectionAddress,
    book.creator?.wallet?.address,
    book.metrics?.totalSupply,
    book.id,
    paymentAddress,
    createUnconfirmedBookEdition,
    onMintSuccess,
  ])

  const getMintButtonText = useCallback(() => {
    if (isLoading) {
      return <p>Mint transaction in progress...</p>
    }

    if (isMinting) {
      return <p>Your new copy is on the way!</p>
    }

    if (editions?.length && editions?.length === 1) {
      return <p>You already have 1 copy of this eBook</p>
    }

    if (editions?.length && editions?.length > 1) {
      return <p>You already have {editions?.length} copies of this eBook</p>
    }

    return <p>You don't have any copies of this eBook yet</p>
  }, [editions?.length, isLoading, isMinting])

  if (!isAuthenticated) {
    return (
      <div className=" flex items-center mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
        <div className="flex justify-start flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Tooltip>
            <TooltipTrigger>
              {' '}
              <Button
                onClick={signIn}
                disabled={isSigningIn}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 rounded-full px-6 py-2 sm:py-3 text-sm sm:text-base font-bold transition-colors w-full sm:w-auto"
              >
                {isSigningIn ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connect your wallet to mint</p>
            </TooltipContent>
          </Tooltip>

          <p>Connect your wallet to mint</p>
        </div>
      </div>
    )
  }

  const price = formatSolanaPrice(totalPrice, true)

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
      <div className="flex justify-start flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={handleMint}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 rounded-full px-6 py-2 sm:py-3 text-sm sm:text-base font-bold transition-colors w-full sm:w-auto"
        >
          {/* {isLoading ? <Loader2 /> : <></>} */}
          {isLoading ? 'Minting...' : `Mint new copy for ${price}`}
        </Button>
        {getMintButtonText()}
      </div>
    </div>
  )
}
