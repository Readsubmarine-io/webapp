import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface NFTListing {
  id: number
  name: string
  image: string
  floorPrice: string
  currency: string
  totalCopies: string
  dailyCopies: string
}

interface NFTListingsProps {
  listings: NFTListing[]
}

export function NFTListings({ listings }: NFTListingsProps) {
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
          {listings.map((listing) => (
            <TableRow key={listing.id} className="cursor-pointer hover:bg-table-row-hover">
              <TableCell className="hidden sm:table-cell">{listing.id}</TableCell>
              <TableCell>
                <Link href={`/marketplace/${listing.id}`} className="flex items-center space-x-3 hover:underline">
                  <Image
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.name}
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <span className="font-medium">{listing.name}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/marketplace/${listing.id}`} className="hover:underline">
                  {listing.floorPrice} <span className="text-currency-code text-xs">{listing.currency}</span>
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Link href={`/marketplace/${listing.id}`} className="hover:underline">
                  {listing.totalCopies}
                </Link>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Link href={`/marketplace/${listing.id}`} className="hover:underline">
                  {listing.dailyCopies}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

