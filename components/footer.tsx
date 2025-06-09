'use client'

import { Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useUserData } from '@/hooks/use-user-data'
import logo from '@/public/logo-wide.png'

export function Footer() {
  const { isAuthenticated } = useUserData()

  const router = useRouter()
  const handleCreateClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (isAuthenticated) {
      router.push('/create-ebook')
    } else {
      toast.warning('Please connect your wallet to create an eBook.')
    }
  }

  return (
    <footer className="bg-[#1E1B4B] text-white/80 font-sans">
      <div className="max-w-container mx-auto py-8 sm:py-10 px-4 lg:px-6 xl:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="sm:col-span-2 md:col-span-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={logo} height={60} alt="Read Submarine Logo" />
            </Link>
            <p className="mt-4 text-sm sm:text-base text-power-pump-text leading-relaxed sm:leading-[30px] font-normal max-w-md font-sans">
              Read Submarine is an innovative NFT marketplace and launchpad for
              writers. We empower authors to transform their ebooks into unique
              digital assets, providing a platform to mint, sell, and manage
              literary NFTs with ease.
            </p>
          </div>

          {/* Launchpad, Marketplace, About */}
          <div className="sm:col-span-2 md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Launchpad */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
                Launchpad
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    onClick={handleCreateClick}
                    href="#"
                    className="text-sm sm:text-base text-power-pump-text leading-relaxed sm:leading-[30px] font-normal hover:text-white transition-colors font-sans"
                  >
                    Create
                  </Link>
                </li>
                <li>
                  <Link
                    href="/launchpad"
                    className="text-sm sm:text-base text-power-pump-text leading-relaxed sm:leading-[30px] font-normal hover:text-white transition-colors font-sans"
                  >
                    Mint
                  </Link>
                </li>
              </ul>
            </div>

            {/* Marketplace */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
                Marketplace
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm sm:text-base text-power-pump-text leading-relaxed sm:leading-[30px] font-normal hover:text-white transition-colors font-sans"
                  >
                    Explore
                  </Link>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
                About
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-sm sm:text-base text-power-pump-text leading-relaxed sm:leading-[30px] font-normal hover:text-white transition-colors font-sans"
                  >
                    How it works?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm sm:text-base text-power-pump-text leading-relaxed sm:leading-[30px] font-normal hover:text-white transition-colors font-sans"
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-xs sm:text-sm font-sans text-center sm:text-left">
            © Copyright 2025{'. '}
            <Link
              href="/"
              className="text-white hover:text-white/90 transition-colors font-sans"
            >
              Read Submarine
            </Link>
            {'. '}
            All Rights Reserved
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://x.com/wearsubmarine"
              target="_blank"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
