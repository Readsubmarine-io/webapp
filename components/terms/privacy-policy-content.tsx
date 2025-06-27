'use client'

import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey } from '@/api/setting/types'

export function PrivacyPolicyContent() {
  const { data: settings, isLoading } = useGetSettingsQuery()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-power-pump-heading mb-6">
        Privacy Policy
      </h1>

      <div className="max-w-none text-power-pump-text leading-relaxed">
        <div
          dangerouslySetInnerHTML={{
            __html:
              settings?.[SettingKey.PrivacyPolicy] ||
              '<p>Privacy Policy content not available.</p>',
          }}
          className="[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-power-pump-heading [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:text-power-pump-heading [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:text-power-pump-heading [&>p]:mb-4 [&>ul]:mb-4 [&>ul]:pl-6 [&>ol]:mb-4 [&>ol]:pl-6 [&>li]:mb-1"
        />
      </div>
    </div>
  )
}
