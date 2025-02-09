import { ProfileContent } from "@/components/profile/profile-content"
import { fetchUserData } from "@/app/api/mockApi"

export default async function ProfilePage() {
  const userData = await fetchUserData()

  return <ProfileContent user={userData} />
}

