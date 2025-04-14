import { notFound } from 'next/navigation'

import { getBookByIdPrefetchQuery } from '@/api/book/get-book-by-id'
import StatefullLayout from '@/app/statefull-layout'
import { LaunchpadBookContent } from '@/components/launchpad/launchpad-book-content'
import { getQueryClient } from '@/lib/get-query-client'
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const queryClient = getQueryClient()

  const { id } = await params

  try {
    await queryClient.fetchQuery(getBookByIdPrefetchQuery(id))
  } catch (error) {
    console.error(error)
    notFound()
  }

  return (
    <StatefullLayout queryClient={queryClient}>
      <LaunchpadBookContent bookId={id} />
    </StatefullLayout>
  )
}
