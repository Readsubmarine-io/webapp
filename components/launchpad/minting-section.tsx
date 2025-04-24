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
import { useCallback, useEffect, useState } from 'react'

import { Book } from '@/api/book/types'
import { useGetBookEditionsQuery } from '@/api/book-edition/get-book-editions'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCheckWalletsMissmatch } from '@/hooks/use-check-wallets-missmatch'
import { useUmi } from '@/hooks/use-umi'
import { useUserData } from '@/hooks/use-user-data'
import { assertError } from '@/lib/assert-error'
import { buildGuards } from '@/lib/build-guards'

interface MintingSectionProps {
  book: Book
}

export function MintingSection({ book }: MintingSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const totalPrice = Number(book.mint?.price)
  const { umi } = useUmi()
  const { checkWalletsMissmatch } = useCheckWalletsMissmatch()

  const { isAuthenticated, user } = useUserData()
  const { data: editions } = useGetBookEditionsQuery({
    bookId: book.id,
    ownerAddress: user?.wallet?.address,
  })

  // const increaseTokenCount = useCallback(() => {
  //   if (!book.metrics?.totalSupply) {
  //     return
  //   }

  //   if (tokenCount < book.metrics?.totalSupply) {
  //     setTokenCount(tokenCount + 1)
  //   }
  // }, [tokenCount, book.metrics?.totalSupply])

  // const decreaseTokenCount = useCallback(() => {
  //   if (tokenCount > 1) {
  //     setTokenCount(Math.max(1, tokenCount - 1))
  //   }
  // }, [tokenCount])

  // const handleTokenCountChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (!book.metrics?.totalSupply) {
  //       return
  //     }

  //     const value = +e.target.value.replace(/[^0-9]/g, '')

  //     if (value > book.metrics?.totalSupply) {
  //       setTokenCount(book.metrics?.totalSupply)
  //     } else if (value < 1) {
  //       setTokenCount(1)
  //     } else {
  //       setTokenCount(value)
  //     }
  //   },
  //   [book.metrics?.totalSupply],
  // )

  useEffect(() => {
    setIsMinting(false)
  }, [editions?.length])

  const handleMint = useCallback(async () => {
    if (!umi) {
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

    try {
      setIsLoading(true)
      const candyMachinePublicKey = publicKey(book.mint?.mintAddress)
      const creatorPublicKey = publicKey(book.creator?.wallet?.address)

      // Fetch candy machine and candy guard data to verify constraints
      const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey)

      const nftMint = generateSigner(umi)

      const guards = buildGuards({
        mintPrice: Number(book.mint?.price),
        mintPriceReceiver: creatorPublicKey,
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

      const signature = await transaction.sendAndConfirm(umi)

      console.log(`Successfully minted!`, signature)
      setIsMinting(true)
    } catch (error: unknown) {
      assertError(error, 'Failed to mint.')
    } finally {
      setIsLoading(false)
    }
  }, [
    umi,
    book.mint?.mintAddress,
    book.mint?.price,
    book.collectionAddress,
    book.creator?.wallet?.address,
    checkWalletsMissmatch,
  ])

  const getMintButtonText = useCallback(() => {
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
  }, [editions, isMinting])

  if (!isAuthenticated) {
    return (
      <div className=" flex items-center mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
        <div className="flex justify-start flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Tooltip>
            <TooltipTrigger>
              {' '}
              <Button
                disabled={true}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 rounded-full px-6 py-2 sm:py-3 text-sm sm:text-base font-bold transition-colors w-full sm:w-auto"
              >
                Mint
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

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
      <div className="flex justify-start flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* <div className="flex items-center space-x-2">
          <Button
            onClick={decreaseTokenCount}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center"
            disabled={isLoading}
          >
            -
          </Button>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={tokenCount}
            onChange={handleTokenCountChange}
            className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={isLoading}
          />
          <Button
            onClick={increaseTokenCount}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center"
            disabled={isLoading}
          >
            +
          </Button>
        </div> */}
        <Button
          onClick={handleMint}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 rounded-full px-6 py-2 sm:py-3 text-sm sm:text-base font-bold transition-colors w-full sm:w-auto"
        >
          {isLoading
            ? 'Minting...'
            : `Mint new copy for ${totalPrice.toFixed(2)} SOL`}
        </Button>
        {getMintButtonText()}
      </div>
    </div>
  )
}
