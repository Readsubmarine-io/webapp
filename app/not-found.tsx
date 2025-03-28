import Link from 'next/link'

import { Button } from '@/components/ui/button'

import StatefullLayout from './statefull-layout'

export default function NotFound() {
  return (
    <StatefullLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 text-center">
        <h1 className="text-6xl font-bold text-power-pump-heading mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-power-pump-heading mb-4">
          Page Not Found
        </h2>
        <p className="text-power-pump-text mb-8 max-w-md">
          Oops! The page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </p>
        <Button
          asChild
          className="bg-power-pump-button text-white hover:bg-power-pump-button/90 rounded-full px-6 py-3 text-base font-semibold transition-colors"
        >
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </StatefullLayout>
  )
}
