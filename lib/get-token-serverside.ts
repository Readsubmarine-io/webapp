export const getTokenServerside = async () => {
  const cookies = await import('next/headers').then((module) =>
    module.cookies(),
  )
  return cookies.get('accessToken')?.value
}
