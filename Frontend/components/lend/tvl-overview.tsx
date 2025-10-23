"use client"

import { mockMarketStats } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/index"

export function TVLOverview() {
  const utilizationRate = mockMarketStats.utilizationRate

  return (
    <div className="card-gradient mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-2xl text-heading mb-4">Protocol Overview</h3>

      <div className="space-y-4">
        {/* Main TVL Display */}
        <div className="bg-white/50 rounded-2xl p-4 text-center">
          <p
            className="text-sm text-neutral-600 mb-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Total Value Locked
          </p>
          <h2 className="text-4xl text-heading">{formatCurrency(mockMarketStats.totalValueLocked)}</h2>
          <p
            className="text-xs text-green-600 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            {mockMarketStats.activeUsers.toLocaleString()} active users
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-pink-100/50 to-pink-50 rounded-2xl p-4 border border-pink-200/50">
            <p
              className="text-xs text-neutral-600 mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Total Borrowed
            </p>
            <p className="text-2xl font-bold text-pink-600" style={{ fontFamily: "var(--font-caveat)" }}>
              {formatCurrency(mockMarketStats.totalBorrows)}
            </p>
            <p
              className="text-xs text-neutral-600 mt-1"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >Avg. {mockMarketStats.averageBorrowAPY}% APY
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100/50 to-blue-50 rounded-2xl p-4 border border-blue-200/50">
            <p
              className="text-xs text-neutral-600 mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              24h Volume
            </p>
            <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: "var(--font-caveat)" }}>
              {formatCurrency(mockMarketStats.volume24h)}
            </p>
            <p
              className="text-xs text-neutral-600 mt-1"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {mockMarketStats.totalTransactions.toLocaleString()} txns
            </p>
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Protocol Utilization
            </p>
            <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-caveat)" }}>
              {utilizationRate.toFixed(1)}%
            </p>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${utilizationRate}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p
              className="text-xs text-neutral-600"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Avg. Supply APY: <span className="text-green-600 font-bold">{mockMarketStats.averageSupplyAPY}%</span>
            </p>
            <p
              className="text-xs text-neutral-600"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Avg. Borrow APY: <span className="text-orange-600 font-bold">{mockMarketStats.averageBorrowAPY}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
