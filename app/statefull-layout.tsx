import {
  HydrationBoundary,
  HydrationBoundaryProps,
} from '@tanstack/react-query'
import { ReactNode } from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

import Providers from './providers'

export type StatefullLayoutProps = {
  children: ReactNode
  state?: HydrationBoundaryProps['state']
}

export default function StatefullLayout({
  children,
  state,
}: StatefullLayoutProps) {
  return (
    <Providers>
      <HydrationBoundary state={state}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-[1128px] pt-16 sm:pt-20">
          {children}
        </main>
        <Footer />
      </HydrationBoundary>
    </Providers>
  )
}
