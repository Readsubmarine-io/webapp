import { useQuery } from '@tanstack/react-query'

import { SettingsResponseDto } from '@/api/setting/types'
import http, { getServerHttp } from '@/lib/http'

export const getSettingsCall = async () => {
  const response = await http.get<SettingsResponseDto>('/v1/setting')

  if (response.status !== 200) {
    throw new Error('Failed to get settings.')
  }

  return response.data
}

export const getSettingsPrefetchCall = async () => {
  const http = getServerHttp()
  const response = await http.get<SettingsResponseDto>('/v1/setting')

  if (response.status !== 200) {
    throw new Error('Failed to get settings.')
  }

  return response.data
}

export const GET_SETTINGS_QUERY_KEY = 'settings'

export const getSettingsPrefetchQuery = () => {
  return {
    queryKey: [GET_SETTINGS_QUERY_KEY],
    queryFn: () => getSettingsPrefetchCall(),
  }
}

export const useGetSettingsQuery = () => {
  return useQuery<SettingsResponseDto, Error>({
    queryKey: [GET_SETTINGS_QUERY_KEY],
    queryFn: () => getSettingsCall(),
  })
}
