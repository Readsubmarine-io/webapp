import { getUserPrefetchQuery } from '@/api/user/get-user'
import StatefullLayout from '@/app/statefull-layout'
import { ProfileRedirect } from '@/components/profile/profile-redirrect'
import { getQueryClient } from '@/lib/get-query-client'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}) {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(getUserPrefetchQuery())

  return (
    <StatefullLayout queryClient={queryClient}>
      <ProfileRedirect />
    </StatefullLayout>
  )
}
