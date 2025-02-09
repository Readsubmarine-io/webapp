"use client"

import { useState, useEffect } from "react"
import { ProjectCard } from "./project-card"

interface EBookCollection {
  id: string
  title: string
  author: string
  coverImage: string
  price: {
    amount: number | "FREE"
    currency: string
  }
  items: string
  mintedPercentage: number
  mintStart: string
  mintEnd: string
  isOpenEdition?: boolean
}

interface LaunchpadCollectionsProps {
  collections: EBookCollection[]
}

export function LaunchpadCollections({ collections }: LaunchpadCollectionsProps) {
  const [sortedCollections, setSortedCollections] = useState<EBookCollection[]>([])

  useEffect(() => {
    const sorted = [...collections].sort((a, b) => {
      const aEnd = new Date(a.mintEnd).getTime()
      const bEnd = new Date(b.mintEnd).getTime()
      const now = new Date().getTime()
      return aEnd - now - (bEnd - now)
    })
    setSortedCollections(sorted)
  }, [collections])

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCollections.map((collection) => (
          <ProjectCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  )
}

