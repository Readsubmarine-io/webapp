import { notFound } from 'next/navigation'

import { MarketplaceContent } from '@/components/marketplace/marketplace-content'

interface BookCollection {
  id: string
  title: string
  author: {
    name: string
    title: string
    bio: string
    avatar: string
  }
  coverImage: string
  totalSupply: number
  copiesMinted: number
  copiesSold24h: number
  totalCopiesSold: number
  floorPrice: number
  edition: number
  description: string
  userCopies: number
  details: {
    pages: number
    categories: string[]
    publishedDate: string
    isbn: string
  }
  holders: number
}

async function getBookCollection(id: string): Promise<BookCollection | null> {
  // In a real application, you would fetch this data from an API
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API delay

  // Simulate a not found scenario for certain IDs
  if (id === '999') {
    return null
  }

  return {
    id,
    title: 'The Great Gatsby',
    author: {
      name: 'Dr. Amelia Quantum',
      title: 'Physicist and Philosopher',
      bio: 'Dr. Amelia Quantum is a world-renowned physicist and philosopher, known for her groundbreaking work in quantum mechanics and its philosophical implications. She has authored numerous books and papers, bridging the gap between science and philosophy.',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-05%20at%2011.54.00-ldyrQQ6A01I6F2SR8pefmlVoaoSFpm.png',
    },
    coverImage:
      'https://img-cdn.magiceden.dev/autoquality:size:1024000:20:80/f:webp/rs:fill:640:640:0:0/plain/https%3A%2F%2Fmedia.cdn.magiceden.dev%2Flaunchpad%2Fupload%2F5f983c07-23c8-48d8-a33b-9eac42bd1d9e',
    totalSupply: 1000,
    copiesMinted: 750,
    copiesSold24h: 25,
    holders: 311,
    floorPrice: 1.5,
    edition: 1,
    description:
      "This is a unique NFT collection of 'The Great Gatsby' by F. Scott Fitzgerald. Each NFT represents a digital copy of this classic novel, with only 1000 copies ever to be minted. Owning this NFT grants you access to exclusive content and community events.",
    userCopies: 2,
    details: {
      pages: 342,
      categories: ['Science', 'Philosophy', 'Quantum Physics'],
      publishedDate: 'May 15, 2023',
      isbn: '978-1234567890',
    },
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const collection = await getBookCollection(params.id)
  if (!collection) {
    return {
      title: 'Book Not Found',
      description: 'The requested book collection could not be found.',
    }
  }
  return {
    title: `${collection.title} | Power Pump NFT Books`,
    description: collection.description,
  }
}

export default async function MarketplacePage({
  params,
}: {
  params: { id: string }
}) {
  const collection = await getBookCollection(params.id)

  if (!collection) {
    notFound()
  }

  return <MarketplaceContent collection={collection} />
}
