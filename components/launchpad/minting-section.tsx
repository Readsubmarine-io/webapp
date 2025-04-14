'use client'

import {
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { useCallback, useState } from 'react'

import { Book } from '@/api/book/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUmi } from '@/hooks/use-umi'
import { useUserData } from '@/hooks/use-user-data'
import { buildGuards } from '@/lib/build-guards'

interface MintingSectionProps {
  book: Book
}

export function MintingSection({ book }: MintingSectionProps) {
  const [tokenCount, setTokenCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalPrice = Number(book.mint?.price) * tokenCount
  const umi = useUmi()

  const { isAuthenticated } = useUserData()

  const increaseTokenCount = useCallback(() => {
    if (!book.metrics?.totalSupply) {
      return
    }

    if (tokenCount < book.metrics?.totalSupply) {
      setTokenCount(tokenCount + 1)
    }
  }, [tokenCount, book.metrics?.totalSupply])

  const decreaseTokenCount = useCallback(() => {
    if (tokenCount > 1) {
      setTokenCount(Math.max(1, tokenCount - 1))
    }
  }, [tokenCount])

  const handleTokenCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!book.metrics?.totalSupply) {
        return
      }

      const value = +e.target.value.replace(/[^0-9]/g, '')

      if (value > book.metrics?.totalSupply) {
        setTokenCount(book.metrics?.totalSupply)
      } else if (value < 1) {
        setTokenCount(1)
      } else {
        setTokenCount(value)
      }
    },
    [book.metrics?.totalSupply],
  )

  const handleMint = useCallback(async () => {
    if (!umi) {
      console.error('Wallet connection required')
      return
    }

    if (
      !book.mint?.mintAddress ||
      !book.collectionAddress ||
      !book.creator?.wallet?.address
    ) {
      console.error(
        'Missing required mint address, collection address, or creator address',
        book.mint?.mintAddress,
        book.collectionAddress,
        book.creator?.wallet?.address,
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

      console.log('guards', guards)

      const transaction = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 2_800_000 }))
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
      console.log('Signature:', signature.signature)
      console.log(
        `Successfully minted ${tokenCount} token ${tokenCount > 1 ? 's' : ''}!`,
      )

      return signature.signature
    } catch (error: unknown) {
      console.error(
        `Failed to mint: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    } finally {
      setIsLoading(false)
    }
  }, [
    umi,
    book.mint?.mintAddress,
    book.mint?.price,
    book.collectionAddress,
    book.creator?.wallet?.address,
    tokenCount,
  ])

  if (!isAuthenticated) {
    return (
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
        <p>Connect your wallet to mint</p>
      </div>
    )
  }

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
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
        </div>
        <Button
          onClick={handleMint}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 rounded-full px-6 py-2 sm:py-3 text-sm sm:text-base font-bold transition-colors w-full sm:w-auto"
        >
          {isLoading
            ? 'Minting...'
            : `Mint ${tokenCount} token${tokenCount > 1 ? 's' : ''} for ${totalPrice.toFixed(2)} SOL`}
        </Button>
      </div>
    </div>
  )
}
