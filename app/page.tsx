import { HomeContent } from '@/components/home/home-content'
import { getQueryClient } from '@/lib/get-query-client'

import StatefullLayout from './statefull-layout'

async function getHomePageData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    featuredCollections: [
      {
        id: 1,
        title: 'Digital Art Collection',
        badge: 'FEATURED',
        description:
          'Explore our curated collection of unique digital artworks from renowned artists around the globe.',
        image:
          'https://img-cdn.magiceden.dev/autoquality:size:1024000:20:80/f:webp/rs:fill:640:640:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fupload%2F5f983c07-23c8-48d8-a33b-9eac42bd1d9e',
      },
      {
        id: 2,
        title: 'Crypto Collectibles',
        badge: 'TRENDING',
        description:
          'Limited edition digital collectibles secured on the blockchain. Own a piece of digital history.',
        image:
          'https://img-cdn.magiceden.dev/autoquality:size:1024000:20:80/f:webp/rs:fill:640:640:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fupload%2Fa1e10bd5-5b38-4615-a110-e9f6f144a9b3',
      },
      {
        id: 3,
        title: 'NFT Showcase',
        badge: 'NEW',
        description:
          'Discover the latest NFT drops and exclusive digital assets from top creators.',
        image:
          'https://img-cdn.magiceden.dev/autoquality:size:1024000:20:80/f:webp/rs:fill:640:640:0:0/plain/https%3A%2F%2Fbafkreidhabhwtixywp5rsqzt5gi6jhbiso2muem5o2f4fu4dk4aseipnhe.ipfs.nftstorage.link%2F',
      },
      {
        id: 4,
        title: 'Bored Ape Yacht Club',
        badge: 'POPULAR',
        description:
          'Join the exclusive club of Bored Ape owners and access unique perks and events.',
        image:
          'https://img-cdn.magiceden.dev/autoquality:size:1024000:20:80/f:webp/rs:fill:640:640:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fupload%2F5b9d6973-33c0-40c0-bf02-b75b82068d65',
      },
      {
        id: 5,
        title: 'ApeCoin',
        badge: 'HOT',
        description:
          'The official currency of the Bored Ape ecosystem. Stake, govern, and earn with ApeCoin.',
        image:
          'https://img-cdn.magiceden.dev/autoquality:size:1024000:20:80/f:webp/rs:fill:640:640:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fupload%2F6c7a8514-3a40-4b6e-9049-b0b80dcce4c3',
      },
    ],
    categories: [
      'All',
      'Non-fiction',
      'Fiction',
      'Science Fiction',
      'Fantasy',
      'Crime',
      'Romance',
      'Mystery',
      'Other',
    ],
    nftListings: [
      {
        id: 1,
        name: 'Frogana',
        image: '/placeholder.svg',
        floorPrice: '1.002',
        currency: 'SOL',
        totalCopies: '6770',
        dailyCopies: '6770',
      },
      {
        id: 2,
        name: 'Milady Maker',
        image: '/placeholder.svg',
        floorPrice: '4.782',
        currency: 'ETH',
        totalCopies: '40',
        dailyCopies: '40',
      },
      {
        id: 3,
        name: 'Jimmy',
        image: '/placeholder.svg',
        floorPrice: '92',
        currency: 'APE',
        totalCopies: '2569',
        dailyCopies: '2569',
      },
      {
        id: 4,
        name: 'Bored Ape Yacht Club',
        image: '/placeholder.svg',
        floorPrice: '11.66',
        currency: 'ETH',
        totalCopies: '7',
        dailyCopies: '7',
      },
      {
        id: 5,
        name: 'Insurgence by Debauchery',
        image: '/placeholder.svg',
        floorPrice: '0.002',
        currency: 'BTC',
        totalCopies: '1095',
        dailyCopies: '1095',
      },
      {
        id: 6,
        name: 'Courtyard.io',
        image: '/placeholder.svg',
        floorPrice: '18',
        currency: 'POL',
        totalCopies: '4032',
        dailyCopies: '4032',
      },
    ],
    topShows: [10, 25, 50, 100],
  }
}

export default async function Home() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['homePageData'],
    queryFn: getHomePageData,
  })

  return (
    <StatefullLayout queryClient={queryClient}>
      <HomeContent />
    </StatefullLayout>
  )
}
