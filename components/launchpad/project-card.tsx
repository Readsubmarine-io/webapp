"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

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

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const distance = end - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft("Ended")
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else {
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`,
        )
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return timeLeft
}

export function ProjectCard({ collection }: { collection: EBookCollection }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card className="block max-w-sm mx-auto w-full overflow-hidden border border-container-border shadow-content-container relative flex flex-col">
      <div
        className="relative pb-[150%] group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-2 left-2 z-10 bg-white bg-opacity-90 rounded-full px-3 py-1.5 text-xs font-medium flex items-center space-x-2 shadow-md">
          <div className="relative w-2 h-2">
            <div className="absolute w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></div>
            <div className="absolute w-full h-full bg-green-500 rounded-full"></div>
          </div>
          <span className="text-green-600 font-semibold">Live</span>
          <span className="text-power-pump-heading">
            ends:{" "}
            <span className="font-bold text-power-pump-button">
              <CountdownTimer endTime={collection.mintEnd} />
            </span>
          </span>
        </div>
        <Image
          src={collection.coverImage || "/placeholder.svg"}
          alt={collection.title}
          layout="fill"
          objectFit="cover"
        />
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href={`/launchpad/${collection.id}`}
            className="bg-white text-power-pump-button px-4 py-2 rounded-full font-bold hover:bg-power-pump-button hover:text-white transition-colors duration-300"
          >
            Click to know more
          </Link>
        </div>
      </div>
      <CardContent className="flex flex-col p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-power-pump-heading truncate">{collection.title}</h2>
          <p className="text-sm text-power-pump-text">{collection.author}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-left">
            <div className="text-power-pump-text uppercase text-xs">Price</div>
            <div className="font-medium text-power-pump-heading text-base tabular-nums">
              {typeof collection.price.amount === "number"
                ? `${collection.price.amount} ${collection.price.currency}`
                : collection.price.amount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-power-pump-text uppercase text-xs">Copies</div>
            <div className="font-medium text-power-pump-heading text-base tabular-nums">{collection.items}</div>
          </div>
          <div className="text-right">
            <div className="text-power-pump-text uppercase text-xs">Minted</div>
            <div className="font-medium text-power-pump-heading text-base tabular-nums">
              {collection.mintedPercentage}%
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between text-sm w-full">
          <Link
            href={`/launchpad/${collection.id}`}
            className="bg-power-pump-button text-white py-2 px-6 rounded-[100px] font-bold transition-colors hover:bg-power-pump-button/90 w-full text-center block"
          >
            Mint
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

