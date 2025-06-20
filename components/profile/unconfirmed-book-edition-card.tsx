import Image from 'next/image'

import {
  UnconfirmedBookEdition,
  UnconfirmedBookEditionType,
} from '@/api/book-edition/types'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'

export type UnconfirmedBookEditionCardProps = {
  unconfirmedBookEdition: UnconfirmedBookEdition
}

export function UnconfirmedBookEditionCard({
  unconfirmedBookEdition,
}: UnconfirmedBookEditionCardProps) {
  const { book, type } = unconfirmedBookEdition
  const coverImageUrl = book?.coverImage?.metadata.srcUrl

  const isMint = type === UnconfirmedBookEditionType.Mint
  const title = isMint ? 'New Edition' : 'Incoming book'
  const status = isMint ? 'Syncing' : 'Transferring'

  return (
    <Card
      key={unconfirmedBookEdition.editionAddress}
      className="overflow-hidden h-full relative flex flex-row opacity-60 blur-[0.5px]"
    >
      <div className="w-1/3 aspect-[3/4] relative">
        <Image
          src={coverImageUrl || '/placeholder.svg'}
          alt={book?.title || ''}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardContent className="p-4 flex flex-col w-2/3 relative">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-power-pump-button font-semibold">
            {title}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-1 text-power-pump-heading line-clamp-2">
          {book?.title}
        </h3>
        <p className="text-sm text-power-pump-text mb-2">{book?.author}</p>
        <div className="flex flex-col space-y-1 mt-auto">
          <span className="text-sm text-power-pump-text">
            Status:{' '}
            <span className="font-semibold text-yellow-500">{status}</span>
          </span>
          <span className="text-sm text-power-pump-text">
            Created:{' '}
            <span className="font-semibold">
              {new Date(unconfirmedBookEdition.createdAt).toLocaleDateString()}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
