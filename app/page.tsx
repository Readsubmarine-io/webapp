import { redirect } from 'next/navigation'

import { getBooksPrefetchQuery } from '@/api/book/get-books'
import { getSettingsPrefetchQuery } from '@/api/setting/get-settings'
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
  const genre = getGenre(searchParams)

  await Promise.all([
    queryClient.prefetchQuery(
      getBooksPrefetchQuery({
        isFeatured: true,
        sortBy: 'featured',
        limit: 100,
      }),
    ),
    queryClient.prefetchQuery(getSettingsPrefetchQuery()),
    queryClient.prefetchQuery(
      getBooksPrefetchQuery({
        isOnSale: true,
        sortBy: 'sold24h',
        order: 'DESC',
        limit: showTop,
        genre: genre === 'All' ? undefined : genre,
      }),
    ),
  ])

  return (
    <StatefullLayout queryClient={queryClient}>
      <HomeContent showTop={showTop} genre={genre} />
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

const getGenre = (searchParams: {
  [key: string]: string | string[] | undefined
}) => {
  const genre = searchParams.genre

  if (!genre) {
    return 'All'
  }

  if (Array.isArray(genre)) {
    return genre[0]
  }

  return genre || 'All'
}
