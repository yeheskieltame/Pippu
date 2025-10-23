"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { mockPools } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/index"

export function PoolsList() {
  const [expandedPool, setExpandedPool] = useState<string | null>(null)

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-2xl text-heading mb-4">Available Pools</h3>
      <div className="space-y-3">
        {mockPools.map((pool) => (
          <div key={pool.id} className="card-glass overflow-hidden">
            <button
              onClick={() => setExpandedPool(expandedPool === pool.id ? null : pool.id)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex-shrink-0 flex items-center justify-center text-2xl">
                  {pool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.tokenSymbol}
                  </p>
                  <p className="text-xs text-neutral-600 truncate">{pool.tokenName}</p>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    expandedPool === pool.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/50 rounded-lg p-2">
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    TVL
                  </p>
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-caveat)" }}>
                    {(pool.totalLiquidity / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Supply APY
                  </p>
                  <p className="text-sm font-bold text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
                    {pool.supplyAPY}%
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Utilization
                  </p>
                  <p
                    className="text-xs font-semibold text-blue-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.utilizationRate}%
                  </p>
                </div>
              </div>

              {/* User position indicator */}
              {(pool.userSupplied > 0 || pool.userBorrowed > 0) && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  {pool.userSupplied > 0 && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Supplying {formatCurrency(pool.userSupplied)}
                    </span>
                  )}
                  {pool.userBorrowed > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Borrowing {formatCurrency(pool.userBorrowed)}
                    </span>
                  )}
                </div>
              )}
            </button>

            {/* Expanded Details */}
            {expandedPool === pool.id && (
              <div className="mt-4 pt-4 border-t border-white/30 space-y-3 animate-fade-in">
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Total Borrowed:</span>
                  <span className="font-bold">{formatCurrency(pool.totalBorrowed)}</span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Available Liquidity:</span>
                  <span className="font-bold">{formatCurrency(pool.availableLiquidity)}</span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Borrow APY:</span>
                  <span className="font-bold text-orange-500">{pool.borrowAPY}%</span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Collateral Factor:</span>
                  <span className="font-bold">{(pool.collateralFactor * 100).toFixed(0)}%</span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Price:</span>
                  <span className="font-bold">
                    ${pool.price.toLocaleString()}
                    <span className={`ml-1 text-xs ${pool.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ({pool.priceChange24h >= 0 ? '+' : ''}{pool.priceChange24h}%)
                    </span>
                  </span>
                </div>

                {pool.userSupplied > 0 && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Your Position</p>
                    <div className="text-xs text-green-600">
                      <p>Supplied: {formatCurrency(pool.userSupplied)}</p>
                      <p>Est. Daily Earnings: {(pool.userSupplied * pool.supplyAPY / 100 / 365).toFixed(2)} {pool.tokenSymbol}</p>
                    </div>
                  </div>
                )}

                <button className="btn-primary w-full mt-4">
                  {pool.userSupplied > 0 ? 'Manage Position' : 'Supply to Pool'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
