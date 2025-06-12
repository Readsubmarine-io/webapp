import { getBooksPrefetchQuery } from '@/api/book/get-books'
import StatefullLayout from '@/app/statefull-layout'
import { LaunchpadContent } from '@/components/launchpad/launchpad-content'
import { getQueryClient } from '@/lib/get-query-client'

export const dynamic = 'force-dynamic'

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
