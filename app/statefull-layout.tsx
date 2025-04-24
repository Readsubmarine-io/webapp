import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PublicKeyProvider } from '@/components/public-key-provider'
import { Toaster } from '@/components/ui/toaster'

import Providers from './providers'

export type StatefullLayoutProps = {
  children: ReactNode
  queryClient?: QueryClient
  homeRedirect?: boolean
}

export default function StatefullLayout({
  children,
  queryClient,
  homeRedirect = false,
}: StatefullLayoutProps) {
  const state = queryClient ? dehydrate(queryClient) : undefined

  return (
    <Providers>
      <Toaster />
      <PublicKeyProvider homeRedirect={homeRedirect}>
        <HydrationBoundary state={state}>
          <Header homeRedirect={homeRedirect} />
          <main className="flex-1 mx-auto w-full max-w-[1128px] pt-[6rem]">
            {children}
          </main>
          <Footer />
        </HydrationBoundary>
      </PublicKeyProvider>
    </Providers>
  )
}
