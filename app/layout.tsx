import './globals.css'

import type { Metadata } from 'next'
import type React from 'react'

import { dmSans } from './fonts'

export const metadata: Metadata = {
  title: 'Read Submarine',
  description: 'Read Submarine',
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
