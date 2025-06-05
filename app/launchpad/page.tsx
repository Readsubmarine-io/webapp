import { getBooksPrefetchQuery } from '@/api/book/get-books'
import { LaunchpadContent } from '@/components/launchpad/launchpad-content'
import { getQueryClient } from '@/lib/get-query-client'

import StatefullLayout from '../statefull-layout'

export const metadata = {
  title: 'NFT Drops Calendar | Read Submarine',
  description: "Discover upcoming NFT book drops on Read Submarine's Launchpad",
}

export default async function LaunchpadPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    getBooksPrefetchQuery({
      isOnMint: true,
      sortBy: 'createdAt',
    }),
  )

  return (
    <StatefullLayout queryClient={queryClient}>
      <LaunchpadContent />
    </StatefullLayout>
  )
}
