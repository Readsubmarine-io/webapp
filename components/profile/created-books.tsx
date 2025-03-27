import { Check, ExternalLink } from 'lucide-react'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Project } from '@/types/profile'

interface CreatedBooksProps {
  projects: Project[]
}

export function CreatedBooks({ projects }: CreatedBooksProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="overflow-hidden flex flex-col w-full h-full"
        >
          <div className="aspect-square relative flex-shrink-0">
            <Image
              src={project.coverImage || '/placeholder.svg'}
              alt={project.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardContent className="p-3 sm:p-4 flex flex-col flex-grow relative">
            <div className="flex flex-wrap items-center mb-2">
              <h3 className="font-semibold text-base sm:text-lg text-power-pump-heading mr-2 mb-1">
                {project.title}
              </h3>
              {project.status === 'In Review' ? (
                <span className="bg-power-pump-button/10 text-power-pump-button text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  In Review
                </span>
              ) : (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center whitespace-nowrap">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
            </div>
            <div className="mt-auto">
              <p className="text-power-pump-text mb-2">
                Price: {project.price} SOL
              </p>
              <div className="mb-2">
                <Progress
                  value={(project.mintedSupply / project.totalSupply) * 100}
                  className="h-2 bg-gray-200 [&>div]:bg-power-pump-button"
                />
              </div>
              <div className="flex flex-col text-sm text-power-pump-subtext">
                <span>
                  {project.mintedSupply} / {project.totalSupply} minted
                </span>
                <span>
                  {(project.mintedSupply * project.price).toFixed(2)} SOL
                  collected
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                window.open(
                  `https://explorer.solana.com/address/${project.id}`,
                  '_blank',
                )
              }
              className="absolute bottom-4 right-4 text-power-pump-button hover:text-power-pump-button/80 transition-colors"
              aria-label="View on Solana Explorer"
            >
              <ExternalLink size={20} />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
