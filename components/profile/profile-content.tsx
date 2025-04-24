'use client'

import { Copy, Facebook, Globe, Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useGetUserQuery } from '@/api/user/get-user'
import { useGetUserByUsernameQuery } from '@/api/user/get-user-by-user-name'
import { useGetUserCountersByUserIdQuery } from '@/api/user/get-user-counters-by-user-name'
import { CollectedBooks } from '@/components/profile/collected-books'
import { CreatedBooks } from '@/components/profile/created-books'
import { EditProfileDialog } from '@/components/profile/edit-profile-dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ProfileContentProps {
  userName: string
}

export function ProfileContent({ userName }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState('collected')
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: user, refetch: refetchProfile } =
    useGetUserByUsernameQuery(userName)
  const { data: currentUser } = useGetUserQuery()
  const { data: userCounters, refetch: refetchUserCounters } =
    useGetUserCountersByUserIdQuery(user?.id || '')

  useEffect(() => {
    setActiveTab('collected')
    refetchProfile()
    refetchUserCounters()
  }, [currentUser, user?.id, refetchProfile, refetchUserCounters])

  console.log(userCounters)

  return (
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
            {user && user?.wallet?.address === currentUser?.wallet?.address && (
              <EditProfileDialog
                user={user}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              />
            )}
            <div className="flex flex-col items-center text-center mb-4 mt-6">
              <Image
                src={user?.avatar?.metadata.srcUrl || '/placeholder.svg'}
                alt={user?.displayName || ''}
                width={120}
                height={120}
                className="rounded-full mb-4 object-cover aspect-square"
              />
              <h2 className="text-xl font-bold text-power-pump-heading">
                {user?.displayName}
              </h2>
              <p className="text-power-pump-text mb-2 text-sm">
                {user?.userName}
              </p>
              <div className="flex items-center justify-center mb-4">
                <p className="text-power-pump-text mr-2 text-sm">
                  {`${user?.wallet?.address.slice(0, 4)}...${user?.wallet?.address.slice(-4)}`}
                </p>
                <TooltipProvider>
                  <Tooltip open={showTooltip}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            user?.wallet?.address || '',
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
                {user?.bio}
              </p>
              {user?.website && (
                <Link
                  href={user?.website}
                  target="_blank"
                  className="flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-4 actionable text-sm"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {user?.website}
                </Link>
              )}
              <div className="flex space-x-4 mb-6">
                {user?.facebook && (
                  <Link
                    href={user.facebook}
                    target="_blank"
                    className="text-power-pump-text hover:text-power-pump-button actionable"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                )}
                {user?.instagram && (
                  <Link
                    href={user.instagram}
                    target="_blank"
                    className="text-power-pump-text hover:text-power-pump-button actionable"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                )}
                {user?.twitter && (
                  <Link
                    href={user.twitter}
                    target="_blank"
                    className="text-power-pump-text hover:text-power-pump-button actionable"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full md:w-[65%] lg:w-[70%]">
          <Tabs
            defaultValue="collected"
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="w-full justify-start bg-transparent border-b h-auto p-0 space-x-4 sm:space-x-8 overflow-x-auto font-bold">
              {userCounters?.createdBooks ? (
                <TabsTrigger
                  value="created"
                  className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
                >
                  Created
                  {userCounters?.createdBooks &&
                  userCounters?.createdBooks > 0 ? (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                    >
                      {userCounters?.createdBooks}
                    </Badge>
                  ) : (
                    <></>
                  )}
                </TabsTrigger>
              ) : (
                <></>
              )}
              <TabsTrigger
                value="collected"
                className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
              >
                Collected
                {userCounters?.ownedEditions &&
                userCounters?.ownedEditions > 0 ? (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                  >
                    {userCounters?.ownedEditions}
                  </Badge>
                ) : (
                  <></>
                )}
              </TabsTrigger>
              {userCounters?.activeSales ? (
                <TabsTrigger
                  value="sale"
                  className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
                >
                  Sale
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                  >
                    {userCounters?.activeSales}
                  </Badge>
                </TabsTrigger>
              ) : (
                <></>
              )}
            </TabsList>

            {user && user?.wallet?.address && activeTab && (
              <>
                <TabsContent value="created" className="pt-6">
                  <CreatedBooks userId={user?.id} />
                </TabsContent>

                <TabsContent value="collected" className="pt-6">
                  <CollectedBooks userAddress={user?.wallet?.address} />
                </TabsContent>

                <TabsContent value="sale" className="pt-6">
                  <CollectedBooks
                    userAddress={user?.wallet?.address}
                    isOnSale={true}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
