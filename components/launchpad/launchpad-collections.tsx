import { Book } from '@/api/book/types'
import { ProjectCard } from '@/components/launchpad/project-card'

type LaunchpadCollectionsProps = {
  books?: Book[]
}

export function LaunchpadCollections({ books }: LaunchpadCollectionsProps) {
  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book) => <ProjectCard key={book.id} book={book} />)}
      </div>
    </div>
  )
}
