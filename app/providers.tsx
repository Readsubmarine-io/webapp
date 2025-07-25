'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrimeReactProvider } from 'primereact/api'
import type * as React from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { getQueryClient } from '@/lib/get-query-client'

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </PrimeReactProvider>
  )
}
