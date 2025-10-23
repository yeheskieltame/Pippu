"use client"

import { useAccount } from "wagmi"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletConnect, Home, Plus, TrendingUp, PiggyBank, Activity, User, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const { isConnected, address } = useAccount()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create", label: "Create", icon: Plus },
    { href: "/borrow", label: "Borrow", icon: TrendingUp },
    { href: "/lend", label: "Lend", icon: PiggyBank },
    { href: "/activity", label: "Activity", icon: Activity },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span
              className="text-xl font-bold text-heading"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Pippu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-neutral-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <Icon size={18} />
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span
                  className="text-sm font-medium text-neutral-700"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            ) : (
              <w3m-button />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-neutral-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}

            {/* Wallet Connection - Mobile */}
            <div className="pt-4 border-t border-neutral-200">
              {isConnected ? (
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span
                    className="text-sm font-medium text-neutral-700"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              ) : (
                <div className="px-3">
                  <w3m-button />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}