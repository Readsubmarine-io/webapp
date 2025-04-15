import Image from 'next/image'
import Link from 'next/link'

import { Book } from '@/api/book/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table'

interface BooksListingsProps {
  books: Book[]
}

export function BooksListings({ books }: BooksListingsProps) {
  return (
    <div className="relative flex flex-col min-w-0 break-words rounded-xl border border-container-border mb-7 bg-content-gradient from-gradient-start to-gradient-end shadow-content-container overflow-x-auto -mx-4 sm:mx-0">
      <Table className="text-sm sm:text-base w-full">
        <thead>
          <tr>
            <TableHead className="p-4 text-left text-table-header font-semibold border-b border-table-border uppercase tracking-wider text-base hidden sm:table-cell">
              #
            </TableHead>
            <TableHead className="p-4 text-left text-table-header font-semibold border-b border-table-border uppercase tracking-wider text-base">
              Book Name
            </TableHead>
            <TableHead className="p-4 text-left text-table-header font-semibold border-b border-table-border uppercase tracking-wider text-base">
              Floor Price
            </TableHead>
            <TableHead className="p-4 text-left text-table-header font-semibold border-b border-table-border uppercase tracking-wider text-base hidden md:table-cell">
              Total Copies Sold
            </TableHead>
            <TableHead className="p-4 text-left text-table-header font-semibold border-b border-table-border uppercase tracking-wider text-base hidden lg:table-cell">
              24H Copies Sold
            </TableHead>
          </tr>
        </thead>
        <TableBody>
          {books.map((book, index) => (
            <TableRow
              key={book.id}
              className="cursor-pointer hover:bg-table-row-hover"
            >
              <TableCell className="hidden sm:table-cell">
                {index + 1}
              </TableCell>
              <TableCell>
                <Link
                  href={`/marketplace/${book.id}`}
                  className="flex items-center space-x-3 hover:underline"
                >
                  <Image
                    src={book.coverImage.metadata.srcUrl || '/placeholder.svg'}
                    alt={book.title}
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <span className="font-medium">{book.title}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/marketplace/${book.id}`}
                  className="hover:underline"
                >
                  {book.metrics?.floorPrice
                    ? `${book.metrics?.floorPrice} SOL`
                    : '-'}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Link
                  href={`/marketplace/${book.id}`}
                  className="hover:underline"
                >
                  {book.metrics?.totalSold}
                </Link>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Link
                  href={`/marketplace/${book.id}`}
                  className="hover:underline"
                >
                  {book.metrics?.sold24h}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
