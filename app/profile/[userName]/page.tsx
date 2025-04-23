import { getUserByUsernamePrefetchQuery } from '@/api/user/get-user-by-user-name'
import StatefullLayout from '@/app/statefull-layout'
import { ProfileContent } from '@/components/profile/profile-content'
import { getQueryClient } from '@/lib/get-query-client'

type ProfilePageParams = {
  userName: string
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<ProfilePageParams>
}) {
  const queryClient = getQueryClient()

  const { userName } = await params

  await queryClient.prefetchQuery(getUserByUsernamePrefetchQuery(userName))

  return (
    <StatefullLayout queryClient={queryClient}>
      <ProfileContent userName={userName} />
    </StatefullLayout>
  )
}
