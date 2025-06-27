import { getSettingsPrefetchQuery } from '@/api/setting/get-settings'
import StatefullLayout from '@/app/statefull-layout'
import { PrivacyPolicyContent } from '@/components/terms/privacy-policy-content'
import { getQueryClient } from '@/lib/get-query-client'

export const dynamic = 'force-dynamic'

export default async function PrivacyPolicyPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(getSettingsPrefetchQuery())

  return (
    <StatefullLayout queryClient={queryClient}>
      <PrivacyPolicyContent />
    </StatefullLayout>
  )
}
