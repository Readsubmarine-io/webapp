import { getSettingsPrefetchQuery } from '@/api/setting/get-settings'
import StatefullLayout from '@/app/statefull-layout'
import { FaqContent } from '@/components/faq/faq-content'
import { getQueryClient } from '@/lib/get-query-client'

export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(getSettingsPrefetchQuery())

  return (
    <StatefullLayout queryClient={queryClient}>
      <FaqContent />
    </StatefullLayout>
  )
}
