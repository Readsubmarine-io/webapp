"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Facebook, Instagram, Twitter, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { Badge } from "@/components/ui/badge"
import type { User, Book, Project } from "@/types/profile"
import { CreatedBooks } from "@/components/profile/created-books"
import { CollectedBooks } from "@/components/profile/collected-books"
import { ListedForSaleBooks } from "@/components/profile/listed-for-sale-books"
import { fetchUserBooks, fetchUserProjects } from "@/app/api/mockApi"

interface ProfileContentProps {
  user: User
}

export function ProfileContent({ user }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("created")
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collectedBooks, setCollectedBooks] = useState<Book[]>([])
  const [listedForSaleBooks, setListedForSaleBooks] = useState<Book[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (activeTab === "created") {
          const fetchedProjects = await fetchUserProjects()
          setProjects(fetchedProjects)
        } else if (activeTab === "collected") {
          const fetchedBooks = await fetchUserBooks("collected")
          setCollectedBooks(fetchedBooks)
        } else if (activeTab === "sale") {
          const fetchedBooks = await fetchUserBooks("sale")
          setListedForSaleBooks(fetchedBooks)
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeTab])

  const stats = {
    createdCount: projects.length,
    collectedCount: collectedBooks.length,
    saleCount: listedForSaleBooks.length,
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
        {/* Left Sidebar */}
        <div className="w-full md:w-[35%] lg:w-[30%] flex-shrink-0 max-w-full md:max-w-[250px] mb-6 md:mb-0">
          <div className="card sticky">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="absolute top-4 right-4 text-power-pump-button hover:text-power-pump-button/80 actionable"
            >
              Edit
            </button>
            <EditProfileDialog user={user} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="flex flex-col items-center text-center mb-4 mt-6">
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                width={120}
                height={120}
                className="rounded-full mb-4"
              />
              <h2 className="text-xl font-bold text-power-pump-heading">{user.name}</h2>
              <p className="text-power-pump-text mb-2 text-sm">{user.username}</p>
              <div className="flex items-center justify-center mb-4">
                <p className="text-power-pump-text mr-2 text-sm">
                  {`${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`}
                </p>
                <TooltipProvider>
                  <Tooltip open={showTooltip}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.walletAddress)
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
              <p className="text-power-pump-text mb-4 text-sm px-2">{user.bio}</p>
              <Link
                href={user.website}
                className="flex items-center text-power-pump-button hover:text-power-pump-button/80 mb-4 actionable text-sm"
              >
                <Globe className="w-4 h-4 mr-2" />
                {user.website}
              </Link>
              <div className="flex space-x-4 mb-6">
                <Link href="#" className="text-power-pump-text hover:text-power-pump-button actionable">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-power-pump-text hover:text-power-pump-button actionable">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-power-pump-text hover:text-power-pump-button actionable">
                  <Twitter className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full md:w-[65%] lg:w-[70%]">
          <Tabs defaultValue="created" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="w-full justify-start bg-transparent border-b h-auto p-0 space-x-4 sm:space-x-8 overflow-x-auto font-bold">
              <TabsTrigger
                value="created"
                className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
              >
                Created
                {stats.createdCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                  >
                    {stats.createdCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="collected"
                className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
              >
                Collected
                {stats.collectedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                  >
                    {stats.collectedCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="sale"
                className="text-sm sm:text-base data-[state=active]:text-power-pump-button data-[state=active]:border-b-2 data-[state=active]:border-power-pump-button pb-2 sm:pb-4 rounded-none border-b-2 border-transparent whitespace-nowrap flex items-center"
              >
                Sale
                {stats.saleCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-power-pump-button text-white hover:bg-power-pump-button hover:text-white"
                  >
                    {stats.saleCount}
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
}

