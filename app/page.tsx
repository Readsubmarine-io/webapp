import { redirect } from 'next/navigation'

import { getBooksPrefetchQuery } from '@/api/book/get-books'
import StatefullLayout from '@/app/statefull-layout'
import { HomeContent } from '@/components/home/home-content'
import { getQueryClient } from '@/lib/get-query-client'

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const queryClient = getQueryClient()

  const showTop = getShowTop(searchParams)

  await Promise.all([
    queryClient.prefetchQuery(
      getBooksPrefetchQuery({
        isOnSale: true,
        sortBy: 'sold24h',
        limit: showTop,
      }),
    ),
    queryClient.prefetchQuery(
      getBooksPrefetchQuery({
        isFeatured: true,
        sortBy: 'featured',
        limit: 100,
      }),
    ),
  ])

  return (
    <StatefullLayout queryClient={queryClient}>
      <HomeContent showTop={showTop} />
    </StatefullLayout>
  )
}

const getShowTop = (searchParams: {
  [key: string]: string | string[] | undefined
}) => {
  if (!searchParams.showTop) {
    redirect('/?showTop=10')
  }

  const showTop = Number(searchParams.showTop)

  if (![10, 25, 50, 100].includes(showTop)) {
    redirect('/?showTop=10')
  }

  return showTop
}
