"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <div className="flex overflow-x-auto scrollbar-hide py-3 -mx-4 sm:mx-0 px-4 sm:px-0">
      {categories.map((category) => (
        <div key={category} className="flex-shrink-0 mr-2 sm:mr-3">
          <Button
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium cursor-pointer transition-all duration-200 whitespace-nowrap text-sm sm:text-base border ${
              selectedCategory === category
                ? "bg-category-button-bg text-white hover:bg-category-button-bg"
                : "bg-transparent text-category-button-text hover:bg-gray-100 border-category-button-border"
            }`}
          >
            {category}
          </Button>
        </div>
      ))}
    </div>
  )
}

