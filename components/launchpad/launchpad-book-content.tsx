'use client'

import { fetchCandyMachine } from '@metaplex-foundation/mpl-candy-machine'
import { publicKey } from '@metaplex-foundation/umi'
import { ArrowLeft } from 'lucide-react'
import { DateTime } from 'luxon'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGetBookByIdQuery } from '@/api/book/get-book-by-id'
import { MintingSection } from '@/components/launchpad/minting-section'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useUmi } from '@/hooks/use-umi'
import { formatSolanaPrice } from '@/utils/format-solana-price'

interface LaunchpadBookContentProps {
  bookId: string
}

export function LaunchpadBookContent({ bookId }: LaunchpadBookContentProps) {
  const { data: book } = useGetBookByIdQuery(bookId)

  if (!book) {
    notFound()
  }

  const timeLeft = book.mint?.endDate
    ? new Date(book.mint.endDate).getTime() - new Date().getTime()
    : 0
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

  const rasedAmount = useMemo(() => {
    if (!book.mint?.price) {
      return '0 SOL'
    }

    return formatSolanaPrice(
      Number(book.mint.price) * (book.metrics?.mintedSupply || 0),
      true,
    )
  }, [book.mint?.price, book.metrics?.mintedSupply])

  // Need to check if the book was created more than 3 minutes ago to be sure that helius is listening to the mint events
  const isSaveTimeOffset = useMemo(() => {
    if (!book.createdAt) {
      return false
    }

    const createdDate = DateTime.fromJSDate(new Date(book.createdAt))
    const now = DateTime.now()

    return now.diff(createdDate, 'minutes').minutes >= 3
  }, [book.createdAt])

  const { umi } = useUmi()
  const [onchainMintedCopies, setOnchainMintedCopies] = useState(
    book.metrics?.mintedSupply || 0,
  )
  const updateOnchainMintedCopies = useCallback(async () => {
    if (!umi || !book.mint?.mintAddress) {
      return
    }

    const candyMachine = await fetchCandyMachine(
      umi,
      publicKey(book.mint?.mintAddress),
    )

    if (!candyMachine) {
      return
    }

    setOnchainMintedCopies(Number(candyMachine.itemsRedeemed))
  }, [book.mint?.mintAddress, umi])

  useEffect(() => {
    updateOnchainMintedCopies()
  }, [book.mint?.mintAddress, updateOnchainMintedCopies])

  const progressPercentage = useMemo(() => {
    if (!book.metrics?.totalSupply) {
      return 0
    }

    return Math.floor((onchainMintedCopies / book.metrics.totalSupply) * 100)
  }, [book.metrics?.totalSupply, onchainMintedCopies])

  return (
    <article className="container mx-auto px-4 py-8 bg-white">
      <Link
        href="/launchpad"
        className="inline-flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Launchpad
      </Link>
      <div className="flex flex-col md:flex-row gap-8">
        <section className="md:w-1/3">
          <figure>
            <Image
              src={book.coverImage?.metadata.srcUrl || '/placeholder.svg'}
              alt={`Cover of ${book.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-lg w-full"
            />
            <figcaption className="sr-only">
              Book cover for {book.title}
            </figcaption>
          </figure>
        </section>

        <section className="md:w-2/3">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-power-pump-heading">
              {book.title}
            </h1>
            <p className="text-lg mb-4 text-power-pump-text">
              by <span itemProp="author">{book.author}</span>
            </p>
          </header>

          <Card className="mb-6 border border-container-border rounded-xl shadow-content-container">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-power-pump-text">Minted</span>
                  <span className="text-power-pump-heading font-semibold">
                    {onchainMintedCopies} / {book.metrics?.totalSupply}{' '}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-power-pump-button h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-power-pump-text">Backers</p>
                  <p className="font-semibold text-power-pump-heading">
                    {book.metrics?.totalOwners}
                  </p>
                </div>
                <div>
                  <p className="text-power-pump-text">Raised</p>
                  <p className="font-semibold text-power-pump-heading">
                    {rasedAmount}
                  </p>
                </div>
                <div>
                  <p className="text-power-pump-text">Time left</p>
                  <p className="font-semibold text-power-pump-heading">
                    {daysLeft} days
                  </p>
                </div>
                <div>
                  <p className="text-power-pump-text">Price</p>
                  <p className="font-semibold text-power-pump-heading">
                    {formatSolanaPrice(book.mint?.price || 0, true)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {book.isApproved &&
          isSaveTimeOffset &&
          onchainMintedCopies < (book.metrics?.totalSupply || 0) ? (
            <MintingSection
              book={book}
              onMintSuccess={updateOnchainMintedCopies}
            />
          ) : (
            <></>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="border border-container-border rounded-xl shadow-content-container">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-power-pump-heading mb-4">
                  Book Details
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-power-pump-text">Format:</span>
                    <span className="font-medium text-power-pump-text">
                      eBook
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-power-pump-text">Pages:</span>
                    <span className="font-medium text-power-pump-text">
                      {book.pages}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="bg-power-pump-button/10 text-power-pump-button"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-power-pump-text">Published:</span>
                      <span className="font-medium text-power-pump-text">
                        {new Date(book.createdAt).toDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-container-border rounded-xl shadow-content-container">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-power-pump-heading mb-4">
                  About the Author
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={
                      book.creator?.avatar?.metadata.srcUrl ||
                      '/placeholder.svg'
                    }
                    alt={book.creator?.displayName || 'Author avatar'}
                    width={64}
                    height={64}
                    className="rounded-full object-cover aspect-square"
                  />
                  <div>
                    <Link
                      href={`/profile/${book.creator?.userName}`}
                      className="hover:opacity-70"
                    >
                      <h3 className="font-semibold text-power-pump-heading">
                        {book.creator?.displayName}
                      </h3>
                    </Link>
                    <Link
                      href={`/profile/${book.creator?.userName}`}
                      className="hover:opacity-70"
                    >
                      <p className="text-sm text-power-pump-text">
                        @{book.creator?.userName}
                      </p>
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-power-pump-text leading-relaxed">
                  {book.creator?.bio}
                </p>
              </CardContent>
            </Card>
          </div>

          <section className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-2 text-power-pump-heading">
              About this book
            </h2>
            <p className="text-power-pump-text" itemProp="description">
              {book.longDescription}
            </p>
          </section>
        </section>
      </div>
    </article>
  )
}
