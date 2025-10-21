"use client"

import Link from "next/link"
import { TrendingUp, PiggyBank } from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Link
        href="/borrow"
        className="card-glass group hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <TrendingUp size={24} className="text-white" />
          </div>
          <p
            className="text-sm font-semibold text-center"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Borrow Assets
          </p>
        </div>
      </Link>

      <Link
        href="/lend"
        className="card-glass group hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <PiggyBank size={24} className="text-white" />
          </div>
          <p
            className="text-sm font-semibold text-center"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Lend & Earn
          </p>
        </div>
      </Link>
    </div>
  )
}
