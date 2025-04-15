'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Book } from '@/api/book/types'

interface FeaturedBooksProps {
  books: Book[]
}

function SliderButton({
  direction,
  onClick,
  className = '',
}: {
  direction: 'left' | 'right'
  onClick: () => void
  className?: string
}) {
  return (
    <button
      className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-none bg-slider-button text-white flex items-center justify-center cursor-pointer transition-all duration-200 z-[5] shadow-md text-sm sm:text-base font-bold hover:bg-slider-button-hover ${
        direction === 'left' ? 'left-2' : 'right-2'
      } ${className}`}
      onClick={onClick}
    >
      {direction === 'left' ? '<' : '>'}
    </button>
  )
}

export function FeaturedBooks({ books }: FeaturedBooksProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
      }
    }

    const currentRef = scrollRef.current
    currentRef?.addEventListener('scroll', handleScroll)
    return () => currentRef?.removeEventListener('scroll', handleScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative w-full pt-4 sm:pt-6 pb-6 sm:pb-8">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="snap-start shrink-0 pr-4 sm:pr-6 w-[280px]"
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>
      {showLeftArrow && (
        <SliderButton direction="left" onClick={() => scroll('left')} />
      )}
      {showRightArrow && (
        <SliderButton direction="right" onClick={() => scroll('right')} />
      )}
    </div>
  )
}

function BookCard({ book }: { book: Book }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/marketplace/${book.id}`}>
      <div
        className="relative w-full aspect-square rounded-card cursor-pointer overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={book.coverImage.metadata.srcUrl || '/placeholder.svg'}
          alt={book.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div
            className={`absolute left-0 right-0 p-4 transition-all duration-300 ease-in-out
            ${isHovered ? 'bottom-0 -translate-y-[10%]' : 'bottom-0 translate-y-0'}`}
          >
            <h3 className="text-lg font-bold text-white line-clamp-1">
              {book.title}
            </h3>
            <span className="inline-block bg-white/20 px-2 py-1 text-xs text-white rounded mt-1">
              Featured
            </span>
            <p
              className={`text-xs text-white mt-2 transition-all duration-300 ease-in-out
              ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'} overflow-hidden line-clamp-3`}
            >
              {book.shortDescription}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
