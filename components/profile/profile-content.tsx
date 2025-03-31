'use client'

import { Copy, Facebook, Globe, Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useGetUserQuery } from '@/api/user/get-user'
import { useGetUserByUsernameQuery } from '@/api/user/get-user-by-user-name'
import { useGetUserCountersByUserNameQuery } from '@/api/user/get-user-counters-by-user-name'
import { fetchUserBooks, fetchUserProjects } from '@/app/api/mockApi'
import { CollectedBooks } from '@/components/profile/collected-books'
import { CreatedBooks } from '@/components/profile/created-books'
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog'
import { ListedForSaleBooks } from '@/components/profile/listed-for-sale-books'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Book, Project } from '@/types/profile'

interface ProfileContentProps {
  userName: string
}

export function ProfileContent({ userName }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState('created')
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collectedBooks, setCollectedBooks] = useState<Book[]>([])
  const [listedForSaleBooks, setListedForSaleBooks] = useState<Book[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const { data: user, isSuccess: isUserLoaded } =
    useGetUserByUsernameQuery(userName)
  const { data: currentUser } = useGetUserQuery()
  const { data: userCounters } = useGetUserCountersByUserNameQuery(userName)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (activeTab === 'created') {
          const fetchedProjects = await fetchUserProjects()
          setProjects(fetchedProjects)
        } else if (activeTab === 'collected') {
          const fetchedBooks = await fetchUserBooks('collected')
          setCollectedBooks(fetchedBooks)
        } else if (activeTab === 'sale') {
          const fetchedBooks = await fetchUserBooks('sale')
          setListedForSaleBooks(fetchedBooks)
        }
      } catch (err) {
        setError(`Failed to fetch data. Please try again. ${err}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeTab])

  return (
    isUserLoaded && (
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-0">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
          {/* Left Sidebar */}
          <div className="w-full md:w-[35%] lg:w-[30%] flex-shrink-0 max-w-full md:max-w-[250px] mb-6 md:mb-0">
            <div className="card sticky">
              {user?.id === currentUser?.id && (
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="absolute top-4 right-4 text-power-pump-button hover:text-power-pump-button/80 actionable"
                >
                  Edit
                </button>
              )}
              <EditProfileDialog
                user={user}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              />
              <div className="flex flex-col items-center text-center mb-4 mt-6">
                <Image
                  src={user?.avatar?.metadata.srcUrl || '/placeholder.svg'}
                  alt={user?.displayName || ''}
                  width={120}
                  height={120}
                  className="rounded-full mb-4"
                />
                <h2 className="text-xl font-bold text-power-pump-heading">
                  {user.displayName}
                </h2>
                <p className="text-power-pump-text mb-2 text-sm">
                  {user.userName}
                </p>
                <div className="flex items-center justify-center mb-4">
                  <p className="text-power-pump-text mr-2 text-sm">
                    {`${user.wallet?.address.slice(0, 4)}...${user.wallet?.address.slice(-4)}`}
                  </p>
                  <TooltipProvider>
                    <Tooltip open={showTooltip}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              user.wallet?.address || '',
                            )
                            setShowTooltip(true)
                            setTimeout(() => setShowTooltip(false), 2000)
                          }}
                          className="text-power-pump-text hover:text-power-pump-button actionable"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copied!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-power-pump-text mb-4 text-sm px-2">
                  {user.bio}
                </p>
                {user?.website && (
                  <Link
                    href={user.website}
                    target="_blank"
                    className="flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-4 actionable text-sm"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {user.website}
                  </Link>
                )}
                <div className="flex space-x-4 mb-6">
                  <Link
                    href="#"
                    target="_blank"
                    className="text-power-pump-text hover:text-power-pump-button actionable"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    target="_blank"
                    className="text-power-pump-text hover:text-power-pump-button actionable"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    target="_blank"
                    className="text-power-pump-text hover:text-power-pump-button actionable"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full md:w-[65%] lg:w-[70%]">
            <Tabs
              defaultValue="created"
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="w-full justify-start bg-transparent border-b h-auto p-0 space-x-4 sm:space-x-8 overflow-x-auto font-bold">
                <TabsTrigger
                  value="created"
                  className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
                >
                  Created
                  {userCounters?.createdBooks &&
                    userCounters?.createdBooks > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                      >
                        {userCounters?.createdBooks}
                      </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger
                  value="collected"
                  className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
                >
                  Collected
                  {userCounters?.ownedEditions &&
                    userCounters?.ownedEditions > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                      >
                        {userCounters?.ownedEditions}
                      </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger
                  value="sale"
                  className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
                >
                  Sale
                  {userCounters?.activeSales &&
                    userCounters?.activeSales > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                      >
                        {userCounters?.activeSales}
                      </Badge>
                    )}
                </TabsTrigger>
              </TabsList>

              {isLoading && <div className="pt-6">Loading...</div>}
              {error && <div className="pt-6 text-red-500">{error}</div>}

              {!isLoading && !error && (
                <>
                  <TabsContent value="created" className="pt-6">
                    <CreatedBooks projects={projects} />
                  </TabsContent>

                  <TabsContent value="collected" className="pt-6">
                    <CollectedBooks books={collectedBooks} />
                  </TabsContent>

                  <TabsContent value="sale" className="pt-6">
                    <ListedForSaleBooks books={listedForSaleBooks} />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    )
  )
}
