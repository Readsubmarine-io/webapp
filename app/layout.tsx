import { dmSans } from "./fonts"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Power Pump",
  description: "Power Pump Prototype",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} flex min-h-screen flex-col`}>
        <Header />
        <main className="flex-1 mx-auto w-full max-w-[1128px] pt-16 sm:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

