"use client"

import { usePools } from "@/hooks/use-data"
import { formatCurrency, formatPercent } from "@/lib/utils/index"
import Link from "next/link"

export function PoolsOverview() {
  // Use the professional data hook
  const { data: pools = [], isLoading } = usePools()

  // Show only top 3 pools with highest TVL
  const topPools = pools
    .sort((a, b) => parseFloat(b.metrics.tvl) - parseFloat(a.metrics.tvl))
    .slice(0, 3)

  if (isLoading) {
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass p-4">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-5 bg-gray-200 rounded w-8 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

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
                  {pool.loanAsset.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.name}
                  </p>
                  <p className="text-xs text-neutral-600">
                    Available: {formatCurrency(parseFloat(pool.metrics.tvl) / Math.pow(10, pool.loanAsset.decimals))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
                    {formatPercent(pool.metrics.supplyAPY)}
                  </p>
                  <p
                    className="text-xs text-green-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Fixed APY
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600">
                  Utilization: {formatPercent(pool.metrics.utilizationRate)}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    pool.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                    pool.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {pool.riskLevel}
                  </span>
                  <span className="text-neutral-600">
                    {pool.metrics.activeLenders} lenders
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
