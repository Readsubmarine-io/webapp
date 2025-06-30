import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const handleClick = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('genre', category)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [categories])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex items-center gap-2">
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto scrollbar-hide py-3 flex-1"
      >
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

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
