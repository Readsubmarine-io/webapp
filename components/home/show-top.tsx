'use client'

import Link from 'next/link'

interface ShowTopProps {
  current: number
}

export function ShowTop({ current }: ShowTopProps) {
  return (
    <div className="flex items-center space-x-3 text-base">
      <span className="text-power-pump-text">Show top</span>
      <div className="flex rounded-lg overflow-hidden border border-power-pump-button">
        {[10, 25, 50, 100].map((option) => (
          <Link
            key={option}
            href={`/?showTop=${option}`}
            className={`px-4 py-1.5 min-w-[40px] transition-colors ${
              current === option
                ? 'bg-power-pump-button text-white'
                : 'bg-transparent text-power-pump-text hover:bg-power-pump-button/10'
            }`}
          >
            {option}
          </Link>
        ))}
      </div>
    </div>
  )
}
