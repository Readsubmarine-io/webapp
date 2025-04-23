'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useUserData } from '@/hooks/use-user-data'

interface LaunchpadCTAProps {
  createEbookLink: string
}

export function LaunchpadCTA({ createEbookLink }: LaunchpadCTAProps) {
  const { isAuthenticated } = useUserData()

  const handleCreateEbook = useCallback(() => {
    if (isAuthenticated) {
      window.location.href = createEbookLink
    } else {
      // handleConnect()
      toast.warning('Please connect your wallet to create your NFT ebook')
    }
  }, [isAuthenticated, createEbookLink])

  return (
    <div className="text-center py-8 sm:py-12 px-4 max-w-[90%] sm:max-w-[468px] mx-auto">
      <h2 className="text-2xl sm:text-heading-xl font-bold text-power-pump-heading mb-3 sm:mb-4">
        NFT Launchpad for Writers
      </h2>
      <p className="text-base sm:text-lg text-power-pump-subtext mx-auto mb-6 sm:mb-8">
        Turn your ebooks into unique digital assets. Mint, sell, and manage your
        literary NFTs with ease.
      </p>
      <Button
        className="inline-block font-semibold text-outline-button-text bg-transparent border border-outline-button-border rounded-full py-4 sm:py-6 px-4 sm:px-6 text-sm sm:text-base transition-all duration-150 ease-in-out hover:text-outline-button-hover-text hover:bg-outline-button-hover-bg w-full sm:w-[80%] flex items-center justify-center mx-auto"
        onClick={handleCreateEbook}
      >
        Create Your NFT Ebook
      </Button>
      <p className="text-xs sm:text-sm text-power-pump-subtext mt-3 sm:mt-4">
        Get started in minutes. No coding required.
      </p>
    </div>
  )
}
