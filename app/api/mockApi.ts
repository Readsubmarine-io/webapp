import type { Book, Project, User } from '@/types/profile'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function fetchUserData(): Promise<User> {
  await delay(1000)
  return {
    id: 1,
    username: '@breasons',
    name: 'John Breasons',
    walletAddress: '7V4PagGquj6PBx1nqn1jaPjJYYHXucZi8YiuoTRWNa9M',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, recusandae.',
    website: 'https://ndlabs.dev',
    avatar: 'https://i.pravatar.cc/300?img=69',
    email: 'john.breasons@example.com',
  }
}

export async function fetchUserBooks(
  category: 'collected' | 'sale',
): Promise<Book[]> {
  await delay(1000)
  const books: Book[] = [
    {
      id: 1,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, recusandae.',
      coverImage:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
      price: 1.5,
      totalSupply: 1000,
      mintedSupply: 750,
      purchasePrice: 1.2,
      floorPrice: 1.5,
      isOnSale: false,
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, recusandae.',
      coverImage:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
      price: 2.0,
      totalSupply: 500,
      mintedSupply: 250,
      purchasePrice: 1.8,
      floorPrice: 2.0,
      isOnSale: true,
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, recusandae.',
      coverImage:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
      price: 1.8,
      totalSupply: 750,
      mintedSupply: 500,
      purchasePrice: 2.0,
      floorPrice: 1.8,
      isOnSale: false,
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, recusandae.',
      author: 'Jane Austen',
      coverImage:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg',
      price: 1.2,
      totalSupply: 1500,
      mintedSupply: 1000,
      purchasePrice: 1.0,
      floorPrice: 1.2,
      isOnSale: true,
    },
  ]

  if (category === 'collected') {
    return books.filter((book) => !book.isOnSale)
  } else {
    return books.filter((book) => book.isOnSale)
  }
}

export async function fetchUserProjects(): Promise<Project[]> {
  await delay(1000)
  return [
    {
      id: 1,
      title: 'The Quantum Enigma',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, recusandae.',
      coverImage:
        'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTNEp4GFdd1xVjo7l8-3oYrUIWfo6YQRxvMP98-XapRjGE-nhV2',
      price: 1.5,
      totalSupply: 1000,
      mintedSupply: 750,
      status: 'In Review',
      createdAt: '2024-10-20T15:00:00Z',
      updatedAt: '2024-10-20T15:00:00Z',
    },
    {
      id: 2,
      title: 'Echoes of Eternity',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo, recusandae.',
      coverImage:
        'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781804073605/echoes-of-eternity-9781804073605_hr.jpg',
      price: 2.0,
      totalSupply: 500,
      mintedSupply: 500,
      createdAt: '2024-10-20T15:00:00Z',
      updatedAt: '2024-10-20T15:00:00Z',
      status: 'Verified',
    },
  ]
}
