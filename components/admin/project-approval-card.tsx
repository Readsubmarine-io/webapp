'use client'

import { Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { useChangeBookApprovalMutation } from '@/api/book/change-book-approval'
import { Book } from '@/api/book/types'
import { Card, CardContent } from '@/components/ui/card'

interface ProjectApprovalCardProps {
  book: Book
  onApprove?: () => void
}

export function ProjectApprovalCard({
  book,
  onApprove,
}: ProjectApprovalCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const { mutate: changeBookApproval } = useChangeBookApprovalMutation()

  const handleChangeApprove = () => {
    setIsApproving(true)
    changeBookApproval(
      {
        bookId: book.id,
        isApproved: !book.isApproved,
      },
      {
        onSuccess: () => {
          setIsApproving(false)
          if (onApprove) {
            onApprove()
          }
        },
        onError: () => {
          setIsApproving(false)
        },
      },
    )
  }

  const handleDownloadPdf = () => {
    if (!book.pdf?.metadata?.srcUrl) {
      toast.error('No PDF available')
      return
    }
    window.open(book.pdf.metadata.srcUrl, '_blank')
  }

  return (
    <Card className="block max-w-sm mx-auto w-full overflow-hidden border border-container-border shadow-content-container relative flex flex-col">
      <div
        className="relative pb-[150%] group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {book.isApproved ? (
          <div className="absolute top-2 left-2 z-10 bg-green-100 bg-opacity-90 rounded-full px-3 py-1.5 text-xs font-medium flex items-center space-x-2 shadow-md">
            <div className="relative w-2 h-2">
              <div className="absolute w-full h-full bg-green-500 rounded-full opacity-75"></div>
              <div className="absolute w-full h-full bg-green-500 rounded-full"></div>
            </div>
            <span className="text-green-800 font-semibold">Approved</span>
          </div>
        ) : (
          <div className="absolute top-2 left-2 z-10 bg-yellow-100 bg-opacity-90 rounded-full px-3 py-1.5 text-xs font-medium flex items-center space-x-2 shadow-md">
            <div className="relative w-2 h-2">
              <div className="absolute w-full h-full bg-yellow-500 rounded-full opacity-75 animate-ping"></div>
              <div className="absolute w-full h-full bg-yellow-500 rounded-full"></div>
            </div>
            <span className="text-yellow-800 font-semibold">
              Pending Approval
            </span>
          </div>
        )}
        <Image
          src={book.coverImage.metadata.srcUrl || '/placeholder.svg'}
          alt={book.title}
          layout="fill"
          objectFit="cover"
        />
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link
            href={`/launchpad/${book.id}`}
            className="bg-white text-power-pump-button px-4 py-2 rounded-full font-bold hover:bg-power-pump-button hover:text-white transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
      <CardContent className="flex flex-col p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-power-pump-heading truncate">
            {book.title}
          </h2>
          <p className="text-sm text-power-pump-text">
            {book.author.slice(0, 20)}
            {book.author.length > 20 && '...'}
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <div>
            <div className="font-medium text-power-pump-heading text-base">
              Creator
            </div>
            <div className="text-sm">
              <Link
                className="text-power-pump-button hover:opacity-80"
                href={`/profile/${book.creator?.userName}`}
              >
                {book.creator?.userName
                  ? `@${book.creator?.userName}`
                  : 'Unknown'}
              </Link>
              <p>{book.contactEmail}</p>
            </div>
          </div>
          <div>
            <div className="font-medium text-power-pump-heading text-base">
              Date Submitted
            </div>
            <div className="text-power-pump-text text-sm">
              {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadPdf}
            className="bg-blue-600 text-white py-2 px-4 rounded-[100px] font-bold transition-colors hover:bg-blue-700 flex-1 flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
        <div className="flex gap-2">
          {book.isApproved ? (
            <button
              onClick={handleChangeApprove}
              disabled={isApproving}
              className="bg-red-600 text-white py-2 px-4 rounded-[100px] font-bold transition-colors hover:bg-red-700 flex-1 text-center block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? 'Updating...' : 'Unapprove Project'}
            </button>
          ) : (
            <button
              onClick={handleChangeApprove}
              disabled={isApproving}
              className="bg-green-600 text-white py-2 px-4 rounded-[100px] font-bold transition-colors hover:bg-green-700 flex-1 text-center block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? 'Approving...' : 'Approve Project'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
