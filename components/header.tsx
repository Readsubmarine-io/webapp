'use client'

import { styled } from '@stitches/react'
import { Loader2, LogOut, Menu, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuthentication } from '@/hooks/use-authentication'
const StyledContent = styled(DropdownMenuContent, {
  zIndex: 1000,
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '1rem',
  color: '#62759d',
  backgroundColor: 'hsl(var(--background))',
})

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isConnected,
    isConnecting,
    user,
    balance,
    handleDisconnect,
    handleConnect,
  } = useAuthentication()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-white py-3 sm:py-5 shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-none">
      <div className="mx-auto w-full max-w-[1128px] px-4 lg:px-6 xl:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-2 mr-2 md:hidden actionable"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetDescription>Power Pump</SheetDescription>
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavLink href="/" onClick={() => setIsOpen(false)}>
                    Marketplace
                  </NavLink>
                  <NavLink href="/launchpad" onClick={() => setIsOpen(false)}>
                    Launchpad
                  </NavLink>
                  <NavLink href="/about" onClick={() => setIsOpen(false)}>
                    About Us
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/White-LfKJts5ccB4pTHzzEmromHH7ET4F6x.svg"
                alt="Power Pump Logo"
                width={40}
                height={40}
                className="h-8 w-8 sm:h-12 sm:w-12"
              />
              <span className="ml-2 text-lg sm:text-xl font-bold text-power-pump-button">
                Power Pump
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="hidden md:flex items-center space-x-2 mr-2 sm:mr-4">
              <NavLink href="/">Marketplace</NavLink>
              <NavLink href="/launchpad">Launchpad</NavLink>
              <NavLink href="/about">About Us</NavLink>
            </nav>

            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-power-pump-text">
                  {balance} SOL
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="actionable">
                      <Image
                        src={
                          user?.avatar?.metadata.srcUrl ??
                          'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                        }
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <div className="relative">
                    <StyledContent
                      className="absolute right-0 mt-2 w-48 actionable"
                      align="end"
                    >
                      <DropdownMenuItem className="text-power-pump-text hover:bg-gray-100 flex items-center actionable">
                        <User className="w-4 h-4 mr-2" />
                        <Link
                          href={`/profile/${user?.userName}`}
                          className="w-full"
                        >
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDisconnect}
                        className="text-power-pump-text hover:bg-gray-100 flex items-center actionable"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    </StyledContent>
                  </div>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                className="bg-power-pump-button text-white hover:bg-power-pump-button/90 rounded-full px-3 sm:px-5 py-1 sm:py-[5px] text-sm sm:text-base font-bold transition-colors min-w-[100px] actionable"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <div className="flex justify-center items-center w-full">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  'Connect'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      className="text-base sm:text-lg font-semibold text-power-pump-text px-3 py-2 flex items-center justify-center actionable bg-headerMenu"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
