import { getSettingsPrefetchQuery } from '@/api/setting/get-settings'
import StatefullLayout from '@/app/statefull-layout'
import { TermsOfServiceContent } from '@/components/terms/terms-of-service-content'
import { getQueryClient } from '@/lib/get-query-client'

export const dynamic = 'force-dynamic'

export default async function TermsOfServicePage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(getSettingsPrefetchQuery())

  return (
    <StatefullLayout queryClient={queryClient}>
      <TermsOfServiceContent />
    </StatefullLayout>
  )
}
