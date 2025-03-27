'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { MintingSection } from '@/components/launchpad/minting-section'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Project {
  id: string
  title: string
  author: {
    name: string
    title: string
    bio: string
    avatar: string
  }
  coverImage: string
  description: string
  price: {
    amount: number
    currency: string
  }
  totalSupply: number
  mintedSupply: number
  backers: number
  raisedAmount: number
  mintStart: string
  mintEnd: string
  details: {
    pages: number
    categories: string[]
    publishedDate: string
  }
}

interface LaunchpadProjectContentProps {
  project: Project
}

export function LaunchpadProjectContent({
  project,
}: LaunchpadProjectContentProps) {
  const progressPercentage = (project.mintedSupply / project.totalSupply) * 100
  const timeLeft = new Date(project.mintEnd).getTime() - new Date().getTime()
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

  return (
    <article className="container mx-auto px-4 py-8 bg-white">
      <Link
        href="/launchpad"
        className="inline-flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Launchpad
      </Link>
      <div className="flex flex-col md:flex-row gap-8">
        <section className="md:w-1/3">
          <figure>
            <Image
              src={project.coverImage || '/placeholder.svg'}
              alt={`Cover of ${project.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-lg w-full"
            />
            <figcaption className="sr-only">
              Book cover for {project.title}
            </figcaption>
          </figure>
        </section>

        <section className="md:w-2/3">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-power-pump-heading">
              {project.title}
            </h1>
            <p className="text-lg mb-4 text-power-pump-text">
              by <span itemProp="author">{project.author.name}</span>
            </p>
          </header>

          <Card className="mb-6 border border-container-border rounded-xl shadow-content-container">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-power-pump-text">Minted</span>
                  <span className="text-power-pump-heading font-semibold">
                    {project.mintedSupply} / {project.totalSupply} [
                    {progressPercentage.toFixed(0)}%]
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-power-pump-button h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-power-pump-text">Backers</p>
                  <p className="font-semibold text-power-pump-heading">
                    {project.backers}
                  </p>
                </div>
                <div>
                  <p className="text-power-pump-text">Raised</p>
                  <p className="font-semibold text-power-pump-heading">
                    {project.raisedAmount} {project.price.currency}
                  </p>
                </div>
                <div>
                  <p className="text-power-pump-text">Time left</p>
                  <p className="font-semibold text-power-pump-heading">
                    {daysLeft} days
                  </p>
                </div>
                <div>
                  <p className="text-power-pump-text">Price</p>
                  <p className="font-semibold text-power-pump-heading">
                    {project.price.amount} {project.price.currency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MintingSection
            price={project.price.amount}
            currency={project.price.currency}
          />

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="border border-container-border rounded-xl shadow-content-container">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-power-pump-heading mb-4">
                  Book Details
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-power-pump-text">Format:</span>
                    <span className="font-medium text-power-pump-text">
                      eBook
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-power-pump-text">Pages:</span>
                    <span className="font-medium text-power-pump-text">
                      {project.details.pages}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.details.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="bg-power-pump-button/10 text-power-pump-button"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-power-pump-text">Published:</span>
                      <span className="font-medium text-power-pump-text">
                        {project.details.publishedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-container-border rounded-xl shadow-content-container">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-power-pump-heading mb-4">
                  About the Author
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={project.author.avatar || '/placeholder.svg'}
                    alt={project.author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-power-pump-heading">
                      {project.author.name}
                    </h3>
                    <p className="text-sm text-power-pump-text">
                      {project.author.title}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-power-pump-text leading-relaxed">
                  {project.author.bio}
                </p>
              </CardContent>
            </Card>
          </div>

          <section className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-2 text-power-pump-heading">
              About this book
            </h2>
            <p className="text-power-pump-text" itemProp="description">
              {project.description}
            </p>
          </section>
        </section>
      </div>
    </article>
  )
}
