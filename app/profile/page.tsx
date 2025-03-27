import { fetchUserData } from '@/app/api/mockApi'
import { ProfileContent } from '@/components/profile/profile-content'

export default async function ProfilePage() {
  const userData = await fetchUserData()

  return <ProfileContent user={userData} />
}
