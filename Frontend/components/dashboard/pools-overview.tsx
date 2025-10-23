"use client"

import { mockPools } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/index"
import Link from "next/link"

export function PoolsOverview() {
  // Show only top 3 pools with highest TVL
  const topPools = mockPools
    .sort((a, b) => b.totalLiquidity - a.totalLiquidity)
    .slice(0, 3)

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl text-heading">Popular Pools</h3>
        <Link
          href="/lend"
          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          View All →
        </Link>
      </div>
      <div className="space-y-3">
        {topPools.map((pool) => (
          <Link href={`/lend?pool=${pool.id}`} key={pool.id}>
            <div className="card-glass hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center text-lg">
                  {pool.icon}
                </div>
                <div className="flex-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.tokenSymbol}
                  </p>
                  <p className="text-xs text-neutral-600">
                    TVL: {formatCurrency(pool.totalLiquidity)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
                    {pool.supplyAPY}%
                  </p>
                  <p
                    className="text-xs text-green-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Supply APY
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600">
                  Utilization: {pool.utilizationRate}%
                </span>
                <span className={`font-medium ${
                  pool.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {pool.priceChange24h >= 0 ? '+' : ''}{pool.priceChange24h}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
