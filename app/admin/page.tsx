import StatefullLayout from '@/app/statefull-layout'
import { UnapprovedProjects } from '@/components/admin/unapproved-projects'

export default function AdminPage() {
  return (
    <StatefullLayout homeRedirect={true}>
      <UnapprovedProjects />
    </StatefullLayout>
  )
}
