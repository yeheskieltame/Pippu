"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, PiggyBank, History, User } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/borrow", label: "Borrow", icon: TrendingUp },
  { href: "/lend", label: "Lend", icon: PiggyBank },
  { href: "/activity", label: "Activity", icon: History },
  { href: "/profile", label: "Profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-neutral-200 px-4 py-3 flex justify-around items-center md:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? "text-pink-500 scale-110" : "text-neutral-600 hover:text-blue-400"
            }`}
          >
            <Icon size={24} />
            <span
              className="text-xs font-semibold"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
