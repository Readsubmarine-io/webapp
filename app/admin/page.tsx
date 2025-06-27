import StatefullLayout from '@/app/statefull-layout'
import { AdminContent } from '@/components/admin/admin-content'

export default function AdminPage() {
  return (
    <StatefullLayout homeRedirect={true}>
      <AdminContent />
    </StatefullLayout>
  )
}
