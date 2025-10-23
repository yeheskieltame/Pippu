"use client"

import { useState } from "react"
import { usePools } from "@/hooks/use-data"
import { formatCurrency } from "@/lib/utils/index"

export function LendForm() {
  const [depositAmount, setDepositAmount] = useState(1000)
  const [selectedPoolId, setSelectedPoolId] = useState("")

  // Get pools data
  const { data: pools = [], isLoading } = usePools()

  // Set default selected pool
  if (!selectedPoolId && pools.length > 0) {
    setSelectedPoolId(pools[0].id)
  }

  const selectedPool = pools.find(p => p.id === selectedPoolId)
  const estimatedMonthlyEarnings = selectedPool
    ? (depositAmount * selectedPool.metrics.supplyAPY / 100) / 12
    : 0

  if (isLoading) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (pools.length === 0) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Start Lending</h3>
        <p className="text-center text-neutral-600">No pools available for lending at the moment.</p>
      </div>
    )
  }

  return (
    <div className="card-glass animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-4">Start Lending</h3>

      <div className="space-y-4">
        {/* Deposit Amount */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Deposit Amount (USDC)
          </label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            min="100"
            step="100"
          />
          <p
            className="text-xs text-neutral-600 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Minimum deposit: 100 USDC
          </p>
        </div>

        {/* Pool Selection */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Select Pool
          </label>
          <select
            value={selectedPoolId}
            onChange={(e) => setSelectedPoolId(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            {pools.map((pool) => (
              <option key={pool.id} value={pool.id}>
                {pool.name} - {pool.metrics.supplyAPY.toFixed(1)}% Fixed APY
              </option>
            ))}
          </select>
          {selectedPool && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                Category: {pool.category} • Risk: {pool.riskLevel}
              </p>
              <p className="text-xs text-blue-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                Available: {formatCurrency(parseFloat(pool.metrics.tvl) / Math.pow(10, pool.loanAsset.decimals))}
              </p>
            </div>
          )}
        </div>

        {/* Earnings Projection */}
        {selectedPool && (
          <div className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-2xl p-4 border border-green-200/50">
            <p
              className="text-sm font-semibold text-green-900 mb-3"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Earnings Projection
            </p>
            <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <div className="flex justify-between">
                <span className="text-green-800">Monthly Earnings:</span>
                <span className="font-bold text-green-600">
                  +{formatCurrency(estimatedMonthlyEarnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Yearly Earnings:</span>
                <span className="font-bold text-green-600">
                  +{formatCurrency(estimatedMonthlyEarnings * 12)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Fixed Rate:</span>
                <span className="font-bold text-green-600">
                  {selectedPool.metrics.supplyAPY.toFixed(1)}% APY
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <p
            className="text-xs font-semibold text-blue-900 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Important Terms
          </p>
          <ul
            className="text-xs text-blue-800 space-y-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            <li>• You can withdraw anytime (subject to pool liquidity)</li>
            <li>• Interest compounds daily</li>
            <li>• Your funds are protected by collateral</li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          className="btn-secondary w-full"
          disabled={!selectedPool || !selectedPool.canSupply}
        >
          {!selectedPool ? 'Loading...' :
           !selectedPool.canSupply ? 'Pool Not Available' :
           `Deposit to ${selectedPool.name}`}
        </button>
      </div>
    </div>
  )
}
