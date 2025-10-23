"use client"

import Link from "next/link"
import { Plus, TrendingUp, PiggyBank } from "lucide-react"

export function QuickActions() {
  return (
    <div className="space-y-4 mb-6">
      {/* Primary Action - Create Pool */}
      <Link
        href="/create"
        className="card-glass group hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in bg-linear-to-r from-purple-50 to-pink-50 border-purple-200"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Plus size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <p
              className="text-base font-bold text-purple-900"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Create Pool
            </p>
            <p
              className="text-sm text-purple-700"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Lock ETH & Get Funded
            </p>
          </div>
          <div className="text-purple-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </Link>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-4">
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
    </div>
  )
}
