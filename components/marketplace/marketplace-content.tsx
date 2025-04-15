'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useGetBookByIdQuery } from '@/api/book/get-book-by-id'
import { PurchaseButton } from '@/components/marketplace/purchase-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MarketplaceContentProps {
  bookId: string
}

export function MarketplaceContent({ bookId }: MarketplaceContentProps) {
  const { data: book } = useGetBookByIdQuery(bookId)

  if (!book) {
    return <div>Book not found</div>
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: book.title,
            author: {
              '@type': 'Person',
              name: book.author,
            },
            description: book.shortDescription,
            image: book.coverImage,
            offers: {
              '@type': 'Offer',
              price: book.metrics?.floorPrice,
              priceCurrency: 'SOL',
            },
            numberOfPages: book.pages,
            datePublished: book.createdAt,
          }),
        }}
      />

      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>
      <article className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <section className="md:w-1/3">
            <figure>
              <Image
                src={book.coverImage.metadata.srcUrl || '/placeholder.svg'}
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

            <div className="mb-6">
              <PurchaseButton
                bookId={bookId}
                isDisabled={!book.metrics?.floorPrice}
              />
              {/* {collection.userCopies > 0 && (
                <p className="mt-2 text-sm text-power-pump-text">
                  You own {collection.userCopies}{' '}
                  {collection.userCopies === 1 ? 'copy' : 'copies'} of this book
                </p>
              )} */}
            </div>

            <Card className="mb-6 border border-container-border rounded-xl shadow-content-container">
              <CardContent className="p-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-power-pump-text">
                      Floor Price
                    </dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">
                      <span itemProp="price">
                        {book.metrics?.floorPrice
                          ? `${book.metrics?.floorPrice} SOL`
                          : '-'}
                      </span>
                      {/* <USDPriceDisplay amount={book.metrics?.floorPrice} /> */}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-power-pump-text">
                      Copies Sold (24h)
                    </dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">
                      {book.metrics?.sold24h}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-power-pump-text">Holders</dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">
                      {book.metrics?.totalOwners}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-power-pump-text">
                      Copies Minted
                    </dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">
                      <span itemProp="copiesMinted">
                        {book.metrics?.mintedSupply}
                      </span>{' '}
                      of{' '}
                      <span itemProp="totalSupply">
                        {book.metrics?.totalSupply}
                      </span>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card className="border border-container-border rounded-xl shadow-content-container">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-power-pump-heading">
                    Book Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-power-pump-text">Format:</span>
                      <span className="font-medium text-power-pump-text">
                        PDF
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-power-pump-text">Pages:</span>
                      <span className="font-medium text-power-pump-text">
                        {book.pages}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {book.genres.map((genre) => {
                        return (
                          <Badge
                            key={genre}
                            variant="secondary"
                            className={`bg-gray-100 text-power-pump-text transition-none`}
                          >
                            {genre}
                          </Badge>
                        )
                      })}
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
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-power-pump-heading">
                    About the Author
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={
                        book.creator?.avatar?.metadata.srcUrl ||
                        '/placeholder.svg'
                      }
                      alt={book.author}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-power-pump-heading">
                        {book.creator?.displayName}
                      </h3>
                      <p className="text-sm text-power-pump-text">
                        {book.creator?.userName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-power-pump-text leading-relaxed">
                    {book.creator?.bio}
                  </p>
                </CardContent>
              </Card>
            </div>

            <section className="prose max-w-none mb-16">
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
    </>
  )
}
