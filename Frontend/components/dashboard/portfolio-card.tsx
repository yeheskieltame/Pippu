"use client"

import { useState } from "react"
import { mockPortfolio } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/index"

export function PortfolioCard() {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="card-gradient mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p
            className="text-sm text-neutral-600 mb-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Total Portfolio
          </p>
          <h2 className="text-3xl text-heading">
            {showBalance ? formatCurrency(mockPortfolio.totalValue) : "••••••"}
          </h2>
        </div>
        <button onClick={() => setShowBalance(!showBalance)} className="text-2xl hover:scale-110 transition-transform">
          {showBalance ? "👁️" : "🙈"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/50 rounded-2xl p-4">
          <p
            className="text-xs text-neutral-600 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Borrowed
          </p>
          <p className="text-xl text-heading">{formatCurrency(mockPortfolio.totalBorrowed)}</p>
        </div>
        <div className="bg-white/50 rounded-2xl p-4">
          <p
            className="text-xs text-neutral-600 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Supplying
          </p>
          <p className="text-xl text-heading">{formatCurrency(mockPortfolio.totalSupplied)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/30">
        <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Net APY: <span className="text-green-500 font-bold">{mockPortfolio.netAPY}%</span>
          <span className="mx-2">•</span>
          Interest earned: <span className="text-pink-500 font-bold">+{formatCurrency(mockPortfolio.interestEarned)}</span>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Health Factor: <span className={`font-bold ${mockPortfolio.healthFactor < 1.5 ? 'text-red-500' : 'text-green-500'}`}>
            {mockPortfolio.healthFactor}
          </span>
        </p>
        <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Available to Borrow: <span className="font-bold text-blue-500">
            {formatCurrency(mockPortfolio.availableToBorrow)}
          </span>
        </p>
      </div>
    </div>
  )
}
