import './globals.css'

import type { Metadata } from 'next'
import type React from 'react'

import { dmSans } from './fonts'

export const metadata: Metadata = {
  title: 'Power Pump',
  description: 'Power Pump Prototype',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} flex min-h-screen flex-col`}>
        {children}
      </body>
    </html>
  )
}
