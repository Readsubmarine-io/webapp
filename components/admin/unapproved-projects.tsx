'use client'

import { useEffect, useState } from 'react'

import { useGetBooksQuery } from '@/api/book/get-books'
import { Book } from '@/api/book/types'
import { ProjectApprovalCard } from '@/components/admin/project-approval-card'

export function UnapprovedProjects() {
  const { data: books, refetch: refetchBooks } = useGetBooksQuery({
    isApproved: false,
  })

  const [unapprovedBooks, setUnapprovedBooks] = useState<Book[]>([])

  useEffect(() => {
    refetchBooks()
  }, [refetchBooks])

  useEffect(() => {
    if (books) {
      // Filter unapproved books on the client side since API doesn't support isApproved filter
      const filtered = books.filter((book) => !book.isApproved)
      setUnapprovedBooks(filtered)
    }
  }, [books])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-power-pump-heading mb-6">
        Projects Pending Approval
      </h1>

      {!unapprovedBooks || unapprovedBooks.length === 0 ? (
        <div className="text-center py-12 text-power-pump-text">
          No projects pending approval at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {unapprovedBooks.map((book) => (
            <ProjectApprovalCard
              key={book.id}
              book={book}
              onApprove={() => refetchBooks()}
            />
          ))}
        </div>
      )}
    </div>
  )
}
