import { DropdownMenuPortal } from '@radix-ui/react-dropdown-menu'
import {
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  MoreVertical,
  Shield,
  ShieldOff,
} from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { useChangeBookApprovalMutation } from '@/api/book/change-book-approval'
import { useChangeBookVisibilityMutation } from '@/api/book/change-book-visibility'
import { useGetBooksQuery } from '@/api/book/get-books'
import { Book } from '@/api/book/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUserData } from '@/hooks/use-user-data'
import { formatSolanaPrice } from '@/utils/format-solana-price'

export type CreatedBooksProps = {
  userId: string
}

export function CreatedBooks({ userId }: CreatedBooksProps) {
  const [showApprovalWarningDialog, setShowApprovalWarningDialog] =
    useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isApproving, setIsApproving] = useState(false)

  const { data: books, refetch: refetchBooks } = useGetBooksQuery({
    creatorId: userId,
    showHidden: true,
  })
  const { user } = useUserData()

  useEffect(() => {
    refetchBooks()
  }, [user, refetchBooks])

  const { mutate: changeBookVisibility } = useChangeBookVisibilityMutation()
  const handleToggleVisibility = useCallback(
    (bookId: string, currentShown: boolean) => {
      changeBookVisibility({
        bookId,
        isShown: !currentShown,
      })
    },
    [changeBookVisibility],
  )

  const { mutate: changeBookApproval } = useChangeBookApprovalMutation()

  const checkIfLessThan5Minutes = (book: Book) => {
    const createdAt = new Date(book.createdAt)
    const now = new Date()
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60)
    return diffInMinutes < 5
  }

  const handleToggleApproval = useCallback(
    (book: Book, currentApproved: boolean) => {
      if (!currentApproved && checkIfLessThan5Minutes(book)) {
        setSelectedBook(book)
        setShowApprovalWarningDialog(true)
        return
      }

      changeBookApproval({
        bookId: book.id,
        isApproved: !currentApproved,
      })
    },
    [changeBookApproval],
  )

  const handleConfirmApproval = () => {
    if (!selectedBook) return

    setShowApprovalWarningDialog(false)
    setIsApproving(true)
    changeBookApproval(
      {
        bookId: selectedBook.id,
        isApproved: !selectedBook.isApproved,
      },
      {
        onSuccess: () => {
          setIsApproving(false)
          setSelectedBook(null)
        },
        onError: () => {
          setIsApproving(false)
          setSelectedBook(null)
        },
      },
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
      {books?.map((book) => {
        const totalSupply = book.metrics?.totalSupply || 1
        const mintedSupply = book.metrics?.mintedSupply || 0
        const progress = (mintedSupply / totalSupply) * 100
        const mintPrice = book.mint?.price || 0
        const isCreator = user?.id === book.creator?.id
        const isAdmin = user?.isAdmin

        return (
          <Card
            key={book.id}
            className="overflow-hidden flex flex-col w-full h-full"
          >
            <div className="aspect-square relative flex-shrink-0">
              <Image
                src={book.coverImage?.metadata.srcUrl || '/placeholder.svg'}
                alt={book.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardContent className="p-3 sm:p-4 flex flex-col flex-grow relative">
              <div className="flex flex-col mb-2">
                <div className="flex items-center justify-between mb-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-semibold text-base sm:text-lg text-power-pump-heading truncate max-w-[70%] cursor-help">
                        {book.title}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>{book.title}</TooltipContent>
                  </Tooltip>

                  {(isCreator || isAdmin) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="bg-white flex-shrink-0">
                        <MoreVertical className="h-5 w-5 text-power-pump-text" />
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent className="bg-white" align="end">
                          {isCreator && (
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center bg-white DropdownMenuItem"
                              onSelect={() =>
                                handleToggleVisibility(book.id, book.isShown)
                              }
                            >
                              {book.isShown ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Hide Book
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Show Book
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <DropdownMenuItem
                              className="DropdownMenuItem cursor-pointer flex items-center bg-white"
                              onSelect={() =>
                                handleToggleApproval(book, book.isApproved)
                              }
                            >
                              {book.isApproved ? (
                                <>
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Unapprove Book
                                </>
                              ) : (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Approve Book
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger>
                      {book.isApproved ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center whitespace-nowrap">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="bg-power-pump-button/10 text-power-pump-button text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                          In Review
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      Is book approved by the admin
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      {book.isShown ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center whitespace-nowrap">
                          <Eye className="w-3 h-3 mr-1" />
                          Visible
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center whitespace-nowrap">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </span>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      Is book visible in the launchpad and marketpalce
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-power-pump-text mb-2">
                  Mint Price: {formatSolanaPrice(book.mint?.price || 0, true)}
                </p>
                {
                  <div className="mb-2">
                    <Progress
                      value={progress}
                      className="h-2 bg-gray-200 [&>div]:bg-power-pump-button"
                    />
                  </div>
                }
                <div className="flex flex-col text-sm text-power-pump-subtext">
                  <span>
                    {mintedSupply} / {totalSupply} minted
                  </span>
                  {
                    <span>
                      {formatSolanaPrice(mintedSupply * mintPrice, true)}{' '}
                      collected
                    </span>
                  }
                </div>
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://solscan.io/account/${book.collectionAddress}`,
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
        )
      })}

      <AlertDialog
        open={showApprovalWarningDialog}
        onOpenChange={setShowApprovalWarningDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Early Approval Warning</AlertDialogTitle>
            <AlertDialogDescription>
              This project was created less than 5 minutes ago. If you approve
              it now, the Mint button will be hidden until 5 minutes have passed
              since the project creation. This is required for proper
              synchronization. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApproval}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isApproving ? 'Approving...' : 'Approve Anyway'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
