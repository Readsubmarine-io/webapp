'use client'

import { useState } from 'react'

interface ShowTopProps {
  options: number[]
}

export function ShowTop({ options }: ShowTopProps) {
  const [selected, setSelected] = useState(25)

  return (
    <div className="flex items-center space-x-3 text-base">
      <span className="text-power-pump-text">Show top</span>
      <div className="flex rounded-lg overflow-hidden border border-power-pump-button">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`px-4 py-1.5 min-w-[40px] transition-colors ${
              selected === option
                ? 'bg-power-pump-button text-white'
                : 'bg-transparent text-power-pump-text hover:bg-power-pump-button/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
