"use client"

import { useState } from "react"
import { ChevronDown, TrendingUp, Clock, Users } from "lucide-react"
import { usePools } from "@/hooks/use-data"
import { formatCurrency, formatPercent } from "@/lib/utils/index"
import { Pool } from "@/lib/types"

export function PoolsList() {
  const [expandedPool, setExpandedPool] = useState<string | null>(null)

  // Use the professional data hook
  const { data: pools = [], isLoading, error } = usePools()

  if (isLoading) {
    return (
      <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-2xl text-heading mb-4">Investment Opportunities</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-2xl text-heading mb-4">Investment Opportunities</h3>
        <div className="card-glass p-6 text-center">
          <p className="text-red-600">Failed to load pools. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-2xl text-heading mb-4">Investment Opportunities</h3>
      <div className="space-y-3">
        {pools.map((pool) => (
          <div key={pool.id} className="card-glass overflow-hidden">
            <button
              onClick={() => setExpandedPool(expandedPool === pool.id ? null : pool.id)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex-shrink-0 flex items-center justify-center text-2xl">
                  {pool.loanAsset.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {pool.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      pool.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      pool.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {pool.riskLevel} Risk
                    </span>
                  </div>
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
                    Available
                  </p>
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-caveat)" }}>
                    {formatCurrency(parseFloat(pool.metrics.tvl) / Math.pow(10, pool.loanAsset.decimals))}
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Fixed APY
                  </p>
                  <p className="text-sm font-bold text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
                    {formatPercent(pool.metrics.supplyAPY)}
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Lenders
                  </p>
                  <p
                    className="text-xs font-semibold text-blue-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.metrics.activeLenders}
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
                {/* Pool Description */}
                <div className="bg-white/50 rounded-2xl p-3">
                  <p className="text-sm text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    {pool.description}
                  </p>
                </div>

                {/* Pool Terms */}
                <div className="bg-white/50 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      Loan Terms
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Duration:</span>
                    <span className="font-semibold">{Math.floor(pool.terms.loanDuration / (24 * 60 * 60))} days</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Fixed Rate:</span>
                    <span className="font-semibold">{(pool.terms.interestRate / 100).toFixed(1)}% APR</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">LTV Ratio:</span>
                    <span className="font-semibold">{pool.terms.ltvRatio}% max</span>
                  </div>
                </div>

                {/* Pool Metrics */}
                <div className="bg-white/50 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      Pool Metrics
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Total Liquidity:</span>
                    <span className="font-semibold">
                      {formatCurrency(parseFloat(pool.metrics.totalLiquidity) / Math.pow(10, pool.loanAsset.decimals))}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Total Borrowed:</span>
                    <span className="font-semibold">
                      {formatCurrency(parseFloat(pool.metrics.totalLoaned) / Math.pow(10, pool.loanAsset.decimals))}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Utilization:</span>
                    <span className="font-semibold">{formatPercent(pool.metrics.utilizationRate)}</span>
                  </div>
                </div>

                {/* Asset Information */}
                <div className="bg-white/50 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-purple-500" />
                    <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      Assets
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Collateral:</span>
                    <span className="font-semibold">
                      {pool.collateralAsset.symbol} ({formatCurrency(pool.collateralAsset.usdValue)})
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Loan Asset:</span>
                    <span className="font-semibold">{pool.loanAsset.symbol}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-white/50 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      Status
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Pool Status:</span>
                    <span className={`font-semibold ${
                      pool.status.active ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pool.status.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Funding:</span>
                    <span className={`font-semibold ${
                      pool.status.fundingComplete ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {pool.status.fundingComplete ? 'Complete' : 'Open'}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    <span className="text-neutral-600">Loan Status:</span>
                    <span className={`font-semibold ${
                      pool.status.loanDisbursed ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {pool.status.loanDisbursed ? 'Disbursed' : 'Pending'}
                    </span>
                  </div>
                </div>

                {pool.userSupplied > 0 && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Your Position</p>
                    <div className="text-xs text-green-600">
                      <p>Supplied: {formatCurrency(pool.userSupplied)}</p>
                      <p>Est. Daily Earnings: {(pool.userSupplied * pool.metrics.supplyAPY / 100 / 365).toFixed(2)} {pool.loanAsset.symbol}</p>
                    </div>
                  </div>
                )}

                <button className="btn-primary w-full mt-4">
                  {pool.userSupplied > 0 ? 'Manage Position' : pool.canSupply ? 'Supply to Pool' : 'Pool Full'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
