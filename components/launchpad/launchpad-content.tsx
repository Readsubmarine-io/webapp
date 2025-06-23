'use client'

import { useGetBooksQuery } from '@/api/book/get-books'
import { LaunchpadCollections } from '@/components/launchpad/launchpad-collections'

export function LaunchpadContent() {
  const { data: books } = useGetBooksQuery({
    isOnMint: true,
    sortBy: 'createdAt',
  })

  return (
    <div className="min-h-screen bg-white">
      {!books?.length ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Projects Available
              </h3>
              <p className="text-gray-600 mb-6">
                There are currently no books in the launchpad. Check back soon
                for exciting new opportunities!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-power-pump-heading mb-4">
              Discover and Support Innovative E-books
            </h2>
            <p className="text-lg text-power-pump-text max-w-2xl mx-auto">
              Invest in the future of literature. Back groundbreaking e-book
              projects and be part of the next bestseller.
            </p>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 pb-8">
            <LaunchpadCollections books={books} />
          </div>
        </>
      )}
    </div>
  )
}
