'use client'

import { create } from '@metaplex-foundation/mpl-candy-machine'
import {
  createNft,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  percentAmount,
  PublicKey,
  publicKey,
  some,
} from '@metaplex-foundation/umi'
import { none } from '@solana/kit'
import { createHash } from 'crypto'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useCallback, useState } from 'react'

import {
  CreateBookCallParams,
  useCreateBookMutation,
} from '@/api/book/create-book'
import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { CreateEbookFormData } from '@/components/create-ebook/create-ebook-content'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { PLATFORM_FEE_ADDRESS } from '@/constants/env'
import { useCheckWalletsMissmatch } from '@/hooks/use-check-wallets-missmatch'
import { useRpc } from '@/hooks/use-rpc'
import { useUmi } from '@/hooks/use-umi'
import { useUserData } from '@/hooks/use-user-data'
import { assertError } from '@/lib/assert-error'
import { buildGuards } from '@/lib/build-guards'
import { sendUmiTransaction } from '@/lib/send-umi-transaction'

const createNftsHash = async (amount: number, uri: string, title: string) => {
  const nfts = []
  for (let i = 0; i < amount; i++) {
    nfts.push({
      name: `${title} #${i + 1}`,
      uri,
    })
  }

  return createHash('sha256').update(JSON.stringify(nfts)).digest()
}

interface ContractsDeployProps {
  formData: Partial<CreateEbookFormData>
  updateFormData: (data: Partial<CreateEbookFormData>) => void
  onPrev: () => void
}

export function ContractsDeploy({
  formData,
  updateFormData,
  onPrev,
}: ContractsDeployProps) {
  const [currentSubstep, setCurrentSubstep] = useState(0)
  const [isInProgress, setIsInProgress] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [collectionAddress, setCollectionAddress] = useState<PublicKey | null>(
    null,
  )

  // Get the user's wallet
  const { isAuthenticated } = useUserData()
  // Get UMI with the wallet as signer
  const { umi } = useUmi()
  const { rpc } = useRpc()
  const { checkWalletsMissmatch } = useCheckWalletsMissmatch()
  const substeps = ['Create NFT Collection', 'Create Candy Machine']

  const { data: settings } = useGetSettingsQuery()
  const mintFee = settings?.[SettingKey.PlatformFee]
  const paymentAddress = settings?.[SettingKey.PaymentAddress]

  const handleCreateNFTContract = useCallback(async () => {
    // Ensure wallet is connected
    if (!isAuthenticated || !umi || !rpc) {
      assertError(new Error('Wallet not connected'), 'Wallet not connected.')
      return
    }

    if (checkWalletsMissmatch()) {
      return
    }

    setIsDeploying(true)
    setIsInProgress(true)
    try {
      console.log('Creating NFT contract...')

      // Create a new signer for the collection NFT
      const collectionSigner = generateSigner(umi)
      // Get metadata URL from formData
      const metadataUrl = formData.metadata?.metadata?.srcUrl || ''

      // Create the Collection NFT
      const transaction = createNft(umi, {
        mint: collectionSigner,
        authority: umi.identity,
        name: formData.collectionName || 'Book Collection',
        uri: metadataUrl,
        sellerFeeBasisPoints: percentAmount(5, 2), // 5%
      })

      try {
        await sendUmiTransaction(umi, rpc, transaction)

        console.log('Collection NFT transaction sent')
      } catch (err) {
        assertError(err, 'Failed to send collection transaction.')
        return
      }

      // Store the collection address
      setCollectionAddress(collectionSigner.publicKey)

      // Update the form data with the collection address
      updateFormData({
        collectionAddress: collectionSigner.publicKey,
      })

      // Move to next substep after completion
      setCurrentSubstep(1)
    } catch (error) {
      assertError(error, 'Failed to create NFT contract.')
      setIsInProgress(false)
    } finally {
      setIsDeploying(false)
    }
  }, [
    isAuthenticated,
    umi,
    rpc,
    checkWalletsMissmatch,
    formData.metadata?.metadata?.srcUrl,
    formData.collectionName,
    updateFormData,
  ])

  const handleCreateCandyMachine = useCallback(async () => {
    // Ensure wallet is connected
    if (!isAuthenticated) {
      assertError(new Error('Wallet not connected'), 'Wallet not connected.')
      return
    }

    if (!collectionAddress) {
      assertError(
        new Error('Collection mint not created yet'),
        'Collection mint not created yet.',
      )
      return
    }

    const metadataUri = formData.metadata?.metadata?.srcUrl

    if (!metadataUri) {
      assertError(new Error('Incorrect form data'), 'Incorrect form data. ')
      return
    }

    if (!mintFee || !paymentAddress) {
      assertError(new Error('Incorrect form data'), 'Incorrect form data. ')
      return
    }

    setIsDeploying(true)
    try {
      console.log('Creating candy machine contract...')

      if (!umi) {
        assertError(new Error('Wallet not connected'), 'Wallet not connected.')
        return
      }

      if (checkWalletsMissmatch()) {
        return
      }

      // Create a new signer for the candy machine
      const candyMachine = generateSigner(umi)

      const totalCopies = formData.totalCopies || 5
      const title = formData.collectionName || 'Book Collection'

      const guards = buildGuards({
        mintPrice: Number(formData.mintPrice),
        mintPriceReceiver: publicKey(paymentAddress),
        mintStartDate: formData.mintStartDate || new Date(),
        mintEndDate: formData.mintEndDate || undefined,
      })

      // Create the Candy Machine with guards
      const transaction = await create(umi, {
        candyMachine,
        collectionMint: collectionAddress,
        collectionUpdateAuthority: umi.identity,
        tokenStandard: TokenStandard.NonFungible,
        sellerFeeBasisPoints: percentAmount(5, 2), // 5%
        itemsAvailable: totalCopies,
        creators: [
          {
            address: umi.identity.publicKey,
            verified: true,
            percentageShare: 80,
          },
          {
            address: publicKey(PLATFORM_FEE_ADDRESS),
            verified: true,
            percentageShare: 20,
          },
        ],
        configLineSettings: none(),
        hiddenSettings: some({
          name: `${title} #$ID+1$`,
          uri: metadataUri,
          hash: await createNftsHash(totalCopies, metadataUri, title),
        }),
        guards,
      })

      try {
        await sendUmiTransaction(umi, rpc, transaction)

        console.log('Candy Machine transaction sent')
      } catch (err) {
        assertError(err, 'Failed to send candy machine transaction.')
        return
      }

      // Update the form data with the mint address
      updateFormData({
        mintAddress: candyMachine.publicKey,
      })

      console.log('Candy Machine created with address:', candyMachine.publicKey)

      // Set the form data as complete
      setIsComplete(true)
    } catch (error) {
      assertError(error, 'Failed to create candy machine contract.')
    } finally {
      setIsDeploying(false)
    }
  }, [
    isAuthenticated,
    collectionAddress,
    formData.metadata?.metadata?.srcUrl,
    formData.totalCopies,
    formData.collectionName,
    formData.mintPrice,
    formData.mintStartDate,
    formData.mintEndDate,
    mintFee,
    paymentAddress,
    umi,
    checkWalletsMissmatch,
    updateFormData,
    rpc,
  ])

  const [isCreatingBook, setIsCreatingBook] = useState(false)

  const { mutateAsync: createBook } = useCreateBookMutation()
  const router = useRouter()

  const completeBookCreation = useCallback(async () => {
    try {
      setIsCreatingBook(true)
      await createBook({
        ...formData,
        collectionName: undefined,
      } as CreateBookCallParams)
      router.push(`/create-ebook/confirmation`)
    } catch (error) {
      console.error(error)
      setIsCreatingBook(false)
    }
  }, [createBook, formData, router])

  if (!mintFee) {
    return <div>Loading...</div>
  }

  const renderSubstep = () => {
    if (isComplete) {
      return (
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Complete</Label>
          <p className="text-gray-600">
            Your eBook has been successfully deployed to the blockchain.
          </p>
        </div>
      )
    }
    switch (currentSubstep) {
      case 0:
        return (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Create NFT Collection
            </Label>
            <p className="text-gray-600">
              This step will create the NFT Collection for your eBook on the
              blockchain.
            </p>
            {!isAuthenticated && (
              <div className="text-yellow-600 text-sm">
                Please connect your wallet first
              </div>
            )}
            <Button
              onClick={handleCreateNFTContract}
              disabled={isDeploying || !isAuthenticated}
              className="w-full bg-power-pump-button text-white hover:bg-power-pump-button/90"
            >
              {isDeploying ? 'Sending transaction...' : 'Send transaction'}
            </Button>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Create Candy Machine
            </Label>
            <p className="text-gray-600">
              This step will create a Candy Machine to handle the minting
              process.
            </p>
            {!isAuthenticated && (
              <div className="text-yellow-600 text-sm">
                Please connect your wallet first
              </div>
            )}
            <Button
              onClick={handleCreateCandyMachine}
              disabled={isDeploying || !isAuthenticated}
              className="w-full bg-power-pump-button text-white hover:bg-power-pump-button/90"
            >
              {isDeploying ? 'Sending transaction...' : 'Send transaction'}
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Blockchain Deployment</h2>
          {isComplete && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Complete
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          {substeps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                  index < currentSubstep || isComplete
                    ? 'bg-green-500 text-white'
                    : index === currentSubstep
                      ? 'bg-power-pump-button text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentSubstep || isComplete ? '✓' : index + 1}
              </div>
              <span
                className={`${index === currentSubstep ? 'font-semibold' : ''}`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {renderSubstep()}

      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          onClick={onPrev}
          variant="outline"
          className="w-[48%]"
          disabled={isInProgress}
        >
          Previous
        </Button>
        <Button
          type="submit"
          disabled={!isComplete || isCreatingBook}
          className="w-[48%] bg-power-pump-button text-white hover:bg-power-pump-button/90"
          onClick={completeBookCreation}
        >
          {isCreatingBook ? 'Creating...' : 'Complete'}
        </Button>
      </div>
    </div>
  )
}
