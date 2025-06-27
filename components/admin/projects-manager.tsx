'use client'

import { useEffect } from 'react'

import { useGetBooksQuery } from '@/api/book/get-books'
import { ProjectApprovalCard } from '@/components/admin/project-approval-card'

export function ProjectsManager() {
  const { data: unapprovedBooks, refetch: refetchUnapprovedBooks } =
    useGetBooksQuery({
      isApproved: false,
    })

  const { data: approvedBooks, refetch: refetchApprovedBooks } =
    useGetBooksQuery({
      isApproved: true,
    })

  useEffect(() => {
    refetchUnapprovedBooks()
    refetchApprovedBooks()
  }, [refetchUnapprovedBooks, refetchApprovedBooks])

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
              onApprove={() => refetchUnapprovedBooks()}
            />
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold text-power-pump-heading my-6">
        Approved Projects
      </h1>

      {!approvedBooks || approvedBooks.length === 0 ? (
        <div className="text-center py-12 text-power-pump-text">
          No approved projects at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {approvedBooks.map((book) => (
            <ProjectApprovalCard
              key={book.id}
              book={book}
              onApprove={() => refetchApprovedBooks()}
            />
          ))}
        </div>
      )}
    </div>
  )
}
