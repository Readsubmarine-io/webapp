'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      richColors
      position="bottom-right"
      visibleToasts={1}
      closeButton={true}
      duration={3000}
      style={{
        top: '100px',
      }}
    />
  )
}
