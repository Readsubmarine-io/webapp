import { DateTime } from 'luxon'

import { Book } from '@/api/book/types'

export const isBookOnMint = (book: Book | undefined) => {
  const isMintDataAvailable =
    book?.metrics?.mintedSupply &&
    book?.metrics.totalSupply &&
    book?.mint?.endDate

  if (!isMintDataAvailable) return true

  const isMintEnded =
    (book.mint?.endDate &&
      DateTime.fromJSDate(new Date(book.mint?.endDate)).toUTC() <=
        DateTime.now().toUTC()) ||
    book.metrics?.mintedSupply === book.metrics?.totalSupply

  return !isMintEnded
}
