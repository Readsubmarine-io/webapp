import { getSettingsPrefetchQuery } from '@/api/setting/get-settings'
import StatefullLayout from '@/app/statefull-layout'
import { ContactContent } from '@/components/contact/contact-content'
import { getQueryClient } from '@/lib/get-query-client'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(getSettingsPrefetchQuery())

  return (
    <StatefullLayout queryClient={queryClient}>
      <ContactContent />
    </StatefullLayout>
  )
}
