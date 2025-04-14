import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import Providers from './providers'

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
      <HydrationBoundary state={state}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-[1128px] pt-[6rem]">
          {children}
        </main>
        <Footer />
      </HydrationBoundary>
    </Providers>
  )
}
