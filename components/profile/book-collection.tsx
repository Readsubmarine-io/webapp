import { Check, ExternalLink } from 'lucide-react'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Book } from '@/types/profile'
import { formatSolanaPrice } from '@/utils/format-solana-price'

interface BookCollectionProps {
  books: Book[]
}

export function BookCollection({ books }: BookCollectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
      {books.map((book) => (
        <Card
          key={book.id}
          className="overflow-hidden flex flex-col w-full h-full"
        >
          <div className="aspect-square relative flex-shrink-0">
            <Image
              src={book.coverImage || '/placeholder.svg'}
              alt={book.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardContent className="p-3 sm:p-4 flex flex-col flex-grow relative">
            <div className="flex flex-wrap items-center mb-2">
              <h3 className="font-semibold text-base sm:text-lg text-power-pump-heading mr-2 mb-1">
                {book.title}
              </h3>
              {book.id === 1 ? (
                <span className="bg-power-pump-button/10 text-power-pump-button text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  In Review
                </span>
              ) : (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center whitespace-nowrap">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
            </div>
            <div className="mt-auto">
              <p className="text-power-pump-text mb-2">
                Price: {formatSolanaPrice(book.price, true)}
              </p>
              <div className="mb-2">
                <Progress
                  value={(book.mintedSupply / book.totalSupply) * 100}
                  className="h-2 bg-gray-200 [&>div]:bg-power-pump-button"
                />
              </div>
              <div className="flex flex-col text-sm text-power-pump-subtext">
                <span>
                  {book.mintedSupply} / {book.totalSupply} minted
                </span>
                <span>
                  {formatSolanaPrice(book.mintedSupply * book.price, true)}{' '}
                  collected
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                window.open(
                  `https://explorer.solana.com/address/${book.id}`,
                  '_blank',
                )
              }
              className="absolute bottom-4 right-4 text-power-pump-button hover:text-power-pump-button/80 transition-colors"
              aria-label="View on Solana Explorer"
            >
              <ExternalLink size={20} />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
