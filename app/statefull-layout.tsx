import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/toaster'

import Providers from './providers'
import { PublicKeyProvider } from '@/components/public-key-provider'

export type StatefullLayoutProps = {
  children: ReactNode
  queryClient?: QueryClient
}

export default function StatefullLayout({
  children,
  queryClient,
}: StatefullLayoutProps) {
  const state = queryClient ? dehydrate(queryClient) : undefined

  return (
    <Providers>
      <Toaster />
      <PublicKeyProvider>
        <HydrationBoundary state={state}>
          <Header />
          <main className="flex-1 mx-auto w-full max-w-[1128px] pt-[6rem]">
            {children}
          </main>
          <Footer />
        </HydrationBoundary>
      </PublicKeyProvider>
    </Providers>
  )
}
