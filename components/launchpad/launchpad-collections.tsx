'use client'

import { useGetBooksQuery } from '@/api/book/get-books'
import { ProjectCard } from '@/components/launchpad/project-card'

export function LaunchpadCollections() {
  const { data: books } = useGetBooksQuery({
    isOnMint: true,
    sortBy: 'createdAt',
  })

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book) => <ProjectCard key={book.id} book={book} />)}
      </div>
    </div>
  )
}
