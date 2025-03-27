import { LaunchpadContent } from '@/components/launchpad/launchpad-content'

export const metadata = {
  title: 'NFT Drops Calendar | Power Pump',
  description: "Discover upcoming NFT book drops on Power Pump's Launchpad",
}

async function getLaunchpadData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    collections: [
      {
        id: '1',
        title: 'The Quantum Enigma',
        author: 'Dr. Amelia Quantum',
        coverImage:
          'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: {
          amount: 0.15,
          currency: 'SOL',
        },
        items: '1000',
        mintedPercentage: 11,
        mintStart: '2025-02-10T15:00:00Z',
        mintEnd: '2025-02-17T15:00:00Z',
      },
      {
        id: '2',
        title: 'Echoes of Eternity',
        author: 'Lila Nightshade',
        coverImage:
          'https://m.media-amazon.com/images/I/51InjRPaF7L._SX377_BO1,204,203,200_.jpg',
        price: {
          amount: 1.3,
          currency: 'SOL',
        },
        items: '5000',
        mintedPercentage: 82,
        mintStart: '2025-02-12T10:00:00Z',
        mintEnd: '2025-02-19T10:00:00Z',
      },
      {
        id: '3',
        title: 'Crypto Chronicles',
        author: 'Satoshi Nakamoto',
        coverImage:
          'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: {
          amount: 0.1,
          currency: 'SOL',
        },
        items: '500',
        mintedPercentage: 54,
        mintStart: '2025-02-15T18:00:00Z',
        mintEnd: '2025-02-22T18:00:00Z',
      },
      {
        id: '4',
        title: 'Infinite Imagination',
        author: 'Aurora Dreamweaver',
        coverImage:
          'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: {
          amount: 1.2,
          currency: 'SOL',
        },
        items: '1000',
        mintedPercentage: 68,
        mintStart: '2025-02-18T12:00:00Z',
        mintEnd: '2025-03-18T12:00:00Z',
        isOpenEdition: true,
      },
    ],
  }
}

export default async function LaunchpadPage() {
  const { collections } = await getLaunchpadData()

  return <LaunchpadContent collections={collections} />
}
