'use client'

export function ContactContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-power-pump-heading mb-6 text-center">
        Contact Us
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <p className="text-power-pump-text leading-relaxed text-center">
            You can contact us on X.com at{' '}
            <a
              href="https://x.com/wearsubmarine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              https://x.com/wearsubmarine
            </a>{' '}
            or{' '}
            <a
              href="https://x.com/theaquaapes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              https://x.com/theaquaapes
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
