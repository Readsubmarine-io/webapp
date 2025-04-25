'use client'

import { useGetBooksQuery } from '@/api/book/get-books'
import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'
import { BooksListings } from '@/components/home/books-listings'
import { CategoryFilter } from '@/components/home/category-filter'
import { FeaturedBooks } from '@/components/home/featured-books'
import { LaunchpadCTA } from '@/components/home/launchpad-cta'
import { ShowTop } from '@/components/home/show-top'

type HomeContentProps = {
  showTop: number
  genre: string
}

export function HomeContent({ showTop, genre }: HomeContentProps) {
  const { data: listedBooks } = useGetBooksQuery({
    isOnSale: true,
    sortBy: 'sold24h',
    order: 'DESC',
    limit: showTop,
    genre: genre === 'All' ? undefined : genre,
  })
  const { data: featuredBooks } = useGetBooksQuery({
    isFeatured: true,
    sortBy: 'featured',
    limit: 100,
  })
  const { data: settings } = useGetSettingsQuery()

  return (
    <div className="min-h-screen font-sans">
      <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-0">
        <FeaturedBooks books={featuredBooks || []} />
        <CategoryFilter
          categories={settings?.[SettingKey.Genres] || []}
          selectedCategory={genre}
        />
        <BooksListings books={listedBooks || []} />
        <div className="mb-4 sm:mb-6 md:mb-8 max-w-full overflow-x-auto">
          <ShowTop current={showTop} />
        </div>
        <LaunchpadCTA createEbookLink="/create-ebook" />
      </div>
    </div>
  )
}
