'use client'

import { useEffect, useState } from 'react'

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

  const [selectedBook, setSelectedBook] = useState<BookEdition | null>(null)
  const [isSetPriceDialogOpen, setIsSetPriceDialogOpen] = useState(false)
  const [selectedBookForSale, setSelectedBookForSale] =
    useState<BookEdition | null>(null)

  const handleViewBook = (book: BookEdition) => {
    setSelectedBook(book)
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
        : 'No books'}
      {unconfirmedBookEditions?.length
        ? unconfirmedBookEditions?.map((unconfirmedBookEdition) => (
            <UnconfirmedBookEditionCard
              key={unconfirmedBookEdition.editionAddress}
              unconfirmedBookEdition={unconfirmedBookEdition}
            />
          ))
        : null}
      {selectedBook && (
        <BookDetailsDrawer
          bookEdition={selectedBook}
          isOpen={!!selectedBook}
          setIsOpen={(isOpen) => !isOpen && setSelectedBook(null)}
        />
      )}
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
