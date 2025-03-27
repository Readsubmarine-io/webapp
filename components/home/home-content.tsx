'use client'

import { CategoryFilter } from '@/components/home/category-filter'
import { FeaturedCollections } from '@/components/home/featured-collections'
import { LaunchpadCTA } from '@/components/home/launchpad-cta'
import { NFTListings } from '@/components/home/nft-listings'
import { ShowTop } from '@/components/home/show-top'

interface HomeContentProps {
  data: {
    featuredCollections: any[]
    categories: string[]
    nftListings: any[]
    topShows: number[]
  }
}

export function HomeContent({ data }: HomeContentProps) {
  const { featuredCollections, categories, nftListings, topShows } = data

  return (
    <div className="min-h-screen font-sans">
      <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-0">
        <FeaturedCollections collections={featuredCollections} />
        <CategoryFilter categories={categories} />
        <NFTListings listings={nftListings} />
        <div className="mb-4 sm:mb-6 md:mb-8 max-w-full overflow-x-auto">
          <ShowTop options={topShows} />
        </div>
        <LaunchpadCTA createEbookLink="/create-ebook" />
      </div>
    </div>
  )
}
