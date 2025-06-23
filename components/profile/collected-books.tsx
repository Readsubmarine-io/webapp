'use client'

import { useCallback, useEffect, useState } from 'react'

import { useGetBookEditionsQuery } from '@/api/book-edition/get-book-editions'
import { useGetUnconfirmedBookEditionsQuery } from '@/api/book-edition/get-unconfirmed-book-editions'
import { BookEdition } from '@/api/book-edition/types'
import { BookDetailsDrawer } from '@/components/profile/book-details-drawer'
import { SetSalePriceDialog } from '@/components/profile/set-sale-price-dialog'
import { useUserData } from '@/hooks/use-user-data'

import { BookEditionCard } from './book-edition-card'
import { UnconfirmedBookEditionCard } from './unconfirmed-book-edition-card'

type CollectedBooksProps = {
  userAddress: string
  isOnSale?: boolean
}

export function CollectedBooks({ userAddress, isOnSale }: CollectedBooksProps) {
  const { data: bookEditions, refetch: refetchBookEditions } =
    useGetBookEditionsQuery({
      ownerAddress: userAddress,
      isOnSale: isOnSale || undefined,
    })

  const {
    data: unconfirmedBookEditions,
    refetch: refetchUnconfirmedBookEditions,
  } = useGetUnconfirmedBookEditionsQuery({
    userId: userAddress,
  })

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [isSetPriceDialogOpen, setIsSetPriceDialogOpen] = useState(false)
  const [selectedBookForSale, setSelectedBookForSale] =
    useState<BookEdition | null>(null)

  const renderDetailsDrawer = useCallback(() => {
    if (!selectedBookId) {
      return null
    }

    const bookEdition = bookEditions?.find(
      (bookEdition) => bookEdition.id === selectedBookId,
    )

    if (!bookEdition) {
      return null
    }

    return (
      <BookDetailsDrawer
        bookEdition={bookEdition}
        isOpen={!!bookEdition}
        setIsOpen={(isOpen) => !isOpen && setSelectedBookId(null)}
      />
    )
  }, [bookEditions, selectedBookId])

  const handleViewBook = (bookEdition: BookEdition) => {
    setSelectedBookId(bookEdition.id)
  }

  const { user } = useUserData()
  const isOwner = user?.wallet?.address === userAddress

  useEffect(() => {
    refetchBookEditions()
    refetchUnconfirmedBookEditions()
  }, [user, refetchBookEditions, refetchUnconfirmedBookEditions])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {bookEditions?.length
        ? bookEditions?.map((bookEdition) => (
            <BookEditionCard
              key={bookEdition.id}
              bookEdition={bookEdition}
              isOwner={isOwner}
              handleViewBook={handleViewBook}
              setSelectedBookForSale={setSelectedBookForSale}
              setIsSetPriceDialogOpen={setIsSetPriceDialogOpen}
            />
          ))
        : unconfirmedBookEditions?.length
          ? null
          : 'No books'}
      {unconfirmedBookEditions?.length && userAddress === user?.wallet?.address
        ? unconfirmedBookEditions?.map((unconfirmedBookEdition) => (
            <UnconfirmedBookEditionCard
              key={unconfirmedBookEdition.editionAddress}
              unconfirmedBookEdition={unconfirmedBookEdition}
            />
          ))
        : null}
      {renderDetailsDrawer()}
      {selectedBookForSale && (
        <SetSalePriceDialog
          bookEdition={selectedBookForSale}
          isOpen={isSetPriceDialogOpen}
          onOpenChange={setIsSetPriceDialogOpen}
        />
      )}
    </div>
  )
}
