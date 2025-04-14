import { LaunchpadCollections } from '@/components/launchpad/launchpad-collections'

export function LaunchpadContent() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-power-pump-heading mb-4">
          Discover and Support Innovative E-books
        </h2>
        <p className="text-lg text-power-pump-text max-w-2xl mx-auto">
          Invest in the future of literature. Back groundbreaking e-book
          projects and be part of the next bestseller.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <LaunchpadCollections />
      </div>
    </div>
  )
}
