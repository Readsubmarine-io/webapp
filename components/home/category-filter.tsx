import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
}

export function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleClick = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('genre', category)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div className="flex overflow-x-auto scrollbar-hide py-3 -mx-4 sm:mx-0 px-4 sm:px-0">
      {['All', ...categories].map((category) => (
        <div key={category} className="flex-shrink-0 mr-2 sm:mr-3">
          <Button
            onClick={() => handleClick(category)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium cursor-pointer transition-all duration-200 whitespace-nowrap text-sm sm:text-base border ${
              selectedCategory === category
                ? 'bg-category-button-bg text-white hover:bg-category-button-bg'
                : 'bg-transparent text-category-button-text hover:bg-gray-100 border-category-button-border'
            }`}
          >
            {category}
          </Button>
        </div>
      ))}
    </div>
  )
}
