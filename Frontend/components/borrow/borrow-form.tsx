"use client"

import { useState } from "react"
import { usePools, useBorrowingPower } from "@/hooks/use-data"
import { formatCurrency, formatPercent } from "@/lib/utils/index"

export function BorrowForm() {
  const [borrowAmount, setBorrowAmount] = useState(500)
  const [selectedPoolId, setSelectedPoolId] = useState("")

  // Get pools and borrowing power data
  const { data: pools = [], isLoading } = usePools()
  const { data: borrowingPower } = useBorrowingPower("0x0000000000000000000000000000000000000000" as `0x${string}`)

  // Set default selected pool
  if (!selectedPoolId && pools.length > 0) {
    setSelectedPoolId(pools[0].id)
  }

  const selectedPool = pools.find(pool => pool.id === selectedPoolId)
  const availableToBorrow = borrowingPower?.availableToBorrow || 0

  // Borrow interest calculation (simple interest for demo)
  const calculateInterest = (amount: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12
    return amount * monthlyRate * months
  }

  // For lending protocol, borrower rate would be higher than lender rate
  const borrowerAPY = selectedPool ? selectedPool.metrics.supplyAPY + 5 : 15 // Add 5% spread
  const monthlyInterest = calculateInterest(borrowAmount, borrowerAPY, 1)
  const totalInterest = calculateInterest(borrowAmount, borrowerAPY, 12)
  const totalToRepay = borrowAmount + totalInterest

  if (isLoading) {
    return (
      <div className="card-glass mb-6 animate-bounce-in p-6" style={{ animationDelay: "0.2s" }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (pools.length === 0) {
    return (
      <div className="card-glass mb-6 animate-bounce-in p-6" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-2xl text-heading mb-4">Borrow Details</h3>
        <p className="text-center text-neutral-600">No pools available for borrowing at the moment.</p>
      </div>
    )
  }

  return (
    <div className="card-glass mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-2xl text-heading mb-4">Borrow Details</h3>

      <div className="space-y-4">
        {/* Borrow Amount */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            How much do you want to borrow?
          </label>
          <div className="relative">
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              min="0"
              step="50"
              max={availableToBorrow}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-neutral-600">
              USDC
            </span>
          </div>
          <div className="flex justify-between mt-2">
            <p
              className="text-xs text-neutral-600"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Max available: <span className="font-bold text-blue-500">{formatCurrency(availableToBorrow)}</span>
            </p>
            {borrowAmount > availableToBorrow && (
              <p className="text-xs text-red-500 font-semibold">
                Exceeds limit!
              </p>
            )}
          </div>
        </div>

        {/* Pool Selection */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Select a Pool
          </label>
          <div className="space-y-2">
            {pools.filter(pool => parseFloat(pool.metrics.tvl) / Math.pow(10, pool.loanAsset.decimals) >= borrowAmount).map((pool) => (
              <button
                key={pool.id}
                onClick={() => setSelectedPoolId(pool.id)}
                className={`w-full p-3 rounded-2xl text-sm transition-all duration-300 ${
                  selectedPoolId === pool.id
                    ? "bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-lg"
                    : "bg-white/50 text-foreground hover:bg-white/70"
                }`}
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pool.loanAsset.icon}</span>
                    <div className="text-left">
                      <span className="font-semibold truncate">{pool.name}</span>
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          pool.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                          pool.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pool.riskLevel}
                        </span>
                        <span className="text-xs text-neutral-600">{pool.category}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium">{borrowerAPY.toFixed(1)}% APR</span>
                </div>
                {parseFloat(pool.metrics.tvl) / Math.pow(10, pool.loanAsset.decimals) < borrowAmount * 2 && (
                  <div className="text-xs mt-1 opacity-75">
                    Limited liquidity: {formatCurrency(parseFloat(pool.metrics.tvl) / Math.pow(10, pool.loanAsset.decimals))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Calculation */}
        {selectedPool && (
          <div className="bg-gradient-to-r from-pink-100/50 to-blue-100/50 rounded-2xl p-4 border border-white/50">
            <div className="space-y-3 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <div className="flex justify-between">
                <span className="text-neutral-700">Borrow Amount:</span>
                <span className="font-bold">{formatCurrency(borrowAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Interest Rate:</span>
                <span className="font-bold text-pink-500">{borrowerAPY.toFixed(1)}% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Monthly Interest:</span>
                <span className="font-bold text-orange-500">{formatCurrency(monthlyInterest)}</span>
              </div>
              <div className="border-t border-white/30 pt-2">
                <div className="flex justify-between">
                  <span className="text-neutral-700 font-semibold">Total to Repay (12mo):</span>
                  <span className="font-bold text-foreground">{formatCurrency(totalToRepay)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Factor Warning */}
        {borrowingPower && borrowingPower.healthFactor < 1.5 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-red-700">Low Health Factor</p>
                <p className="text-xs text-red-600">
                  Your health factor is {borrowingPower.healthFactor}. Consider adding more collateral.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          className={`btn-primary w-full ${
            borrowAmount > availableToBorrow || borrowAmount === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={borrowAmount > availableToBorrow || borrowAmount === 0}
        >
          {borrowAmount > availableToBorrow
            ? 'Exceeds Borrow Limit'
            : borrowAmount === 0
              ? 'Enter Amount'
              : `Borrow ${formatCurrency(borrowAmount)}`
          }
        </button>

        <p className="text-xs text-neutral-600 text-center" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          By borrowing, you agree to the loan terms and your collateral may be liquidated if health factor drops below 1.0
        </p>
      </div>
    </div>
  )
}
