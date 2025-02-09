"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { USDPriceDisplay } from "@/components/usd-price-display"
import { Badge } from "@/components/ui/badge"
import { md5 } from "@/utils/md5"
import { PurchaseButton } from "@/components/marketplace/purchase-button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BookCollection {
  id: string
  title: string
  author: {
    name: string
    title: string
    bio: string
    avatar: string
  }
  coverImage: string
  totalSupply: number
  copiesMinted: number
  copiesSold24h: number
  totalCopiesSold: number
  floorPrice: number
  edition: number
  description: string
  userCopies: number
  details: {
    pages: number
    categories: string[]
    publishedDate: string
    isbn: string
  }
  holders: number
}

interface MarketplaceContentProps {
  collection: BookCollection
}

export function MarketplaceContent({ collection }: MarketplaceContentProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: collection.title,
            author: {
              "@type": "Person",
              name: collection.author.name,
            },
            description: collection.description,
            image: collection.coverImage,
            offers: {
              "@type": "Offer",
              price: collection.floorPrice,
              priceCurrency: "SOL",
            },
            numberOfPages: collection.details.pages,
            isbn: collection.details.isbn,
            datePublished: collection.details.publishedDate,
          }),
        }}
      />

      <div className="container mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>
      <article className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <section className="md:w-1/3">
            <figure>
              <Image
                src={collection.coverImage || "/placeholder.svg"}
                alt={`Cover of ${collection.title}`}
                width={400}
                height={600}
                className="rounded-lg shadow-lg w-full"
              />
              <figcaption className="sr-only">Book cover for {collection.title}</figcaption>
            </figure>
          </section>

          <section className="md:w-2/3">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-power-pump-heading">{collection.title}</h1>
              <p className="text-lg mb-4 text-power-pump-text">
                by <span itemProp="author">{collection.author.name}</span>
              </p>
            </header>

            <div className="mb-6">
              <PurchaseButton />
              {collection.userCopies > 0 && (
                <p className="mt-2 text-sm text-power-pump-text">
                  You own {collection.userCopies} {collection.userCopies === 1 ? "copy" : "copies"} of this book
                </p>
              )}
            </div>

            <Card className="mb-6 border border-container-border rounded-xl shadow-content-container">
              <CardContent className="p-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-power-pump-text">Floor Price</dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">
                      <span itemProp="price">{collection.floorPrice} SOL</span>
                      <USDPriceDisplay amount={collection.floorPrice * 20} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-power-pump-text">Copies Sold (24h)</dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">
                      {collection.copiesSold24h}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-power-pump-text">Holders</dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">{collection.holders}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-power-pump-text">Copies Minted</dt>
                    <dd className="text-sm sm:text-base font-semibold text-power-pump-heading">
                      <span itemProp="copiesMinted">{collection.copiesMinted}</span> of{" "}
                      <span itemProp="totalSupply">{collection.totalSupply}</span>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card className="border border-container-border rounded-xl shadow-content-container">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-power-pump-heading">Book Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-power-pump-text">Format:</span>
                      <span className="font-medium text-power-pump-text">PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-power-pump-text">Pages:</span>
                      <span className="font-medium text-power-pump-text">{collection.details.pages}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {collection.details.categories.map((category) => {
                        const badgeColors = {
                          Science: "bg-blue-100 text-blue-800",
                          Philosophy: "bg-purple-100 text-purple-800",
                          "Quantum Physics": "bg-green-100 text-green-800",
                        }
                        return (
                          <Badge
                            key={category}
                            variant="secondary"
                            className={`${badgeColors[category] || "bg-gray-100 text-power-pump-text"} transition-none`}
                          >
                            {category}
                          </Badge>
                        )
                      })}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-power-pump-text">Published:</span>
                        <span className="font-medium text-power-pump-text">{collection.details.publishedDate}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-container-border rounded-xl shadow-content-container">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-power-pump-heading">About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={`https://www.gravatar.com/avatar/${md5(collection.author.name)}?d=identicon&s=128`}
                      alt={collection.author.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-power-pump-heading">{collection.author.name}</h3>
                      <p className="text-sm text-power-pump-text">{collection.author.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-power-pump-text leading-relaxed">{collection.author.bio}</p>
                </CardContent>
              </Card>
            </div>

            <section className="prose max-w-none mb-16">
              <h2 className="text-2xl font-semibold mb-2 text-power-pump-heading">About this book</h2>
              <p className="text-power-pump-text" itemProp="description">
                {collection.description}
              </p>
            </section>
          </section>
        </div>
      </article>
    </>
  )
}

