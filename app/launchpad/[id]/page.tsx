import { cookies } from 'next/headers'
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

  const token = cookies().get('authToken')?.value

  try {
    await queryClient.fetchQuery(getBookByIdPrefetchQuery(id, token))
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
