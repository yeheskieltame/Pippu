"use client"

import type React from "react"
import { useState } from "react"
import { mockBorrowingPower, mockPools } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/index"

export function CollateralCalculator() {
  const [collateralAmount, setCollateralAmount] = useState(mockBorrowingPower.totalCollateral)

  const selectedPool = mockPools[1] // USDC pool as default
  const collateralFactor = selectedPool.collateralFactor
  const maxLoanAmount = collateralAmount * collateralFactor
  const currentBorrowAmount = mockBorrowingPower.totalBorrows
  const remainingCapacity = maxLoanAmount - currentBorrowAmount

  const healthFactor = collateralAmount > 0 ? (collateralAmount * collateralFactor) / currentBorrowAmount : 0
  const borrowLimitUsed = maxLoanAmount > 0 ? (currentBorrowAmount / maxLoanAmount) * 100 : 0

  const getRiskLevel = (factor: number) => {
    if (factor >= 2) return { level: 'Very Safe', color: 'green', width: '20%' }
    if (factor >= 1.5) return { level: 'Safe', color: 'yellow', width: '40%' }
    if (factor >= 1.2) return { level: 'Moderate', color: 'orange', width: '60%' }
    return { level: 'High Risk', color: 'red', width: '80%' }
  }

  const riskLevel = getRiskLevel(healthFactor)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollateralAmount(Number(e.target.value))
  }

  return (
    <div className="card-gradient mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-2xl text-heading mb-4">Your Borrowing Power</h3>

      <div className="space-y-4">
        {/* Current Status */}
        <div className="bg-white/50 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span
              className="text-sm text-neutral-700"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Total Collateral:
            </span>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-caveat)" }}>
              {formatCurrency(collateralAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className="text-sm text-neutral-700"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Currently Borrowing:
            </span>
            <span className="text-lg font-bold text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
              {formatCurrency(currentBorrowAmount)}
            </span>
          </div>

          <div className="border-t border-white/30 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-sm text-neutral-700"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                Borrow Limit ({(collateralFactor * 100).toFixed(0)}%):
              </span>
              <span className="text-lg font-bold text-blue-500" style={{ fontFamily: "var(--font-caveat)" }}>
                {formatCurrency(maxLoanAmount)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(borrowLimitUsed, 100)}%` }}
              />
            </div>
            <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              {borrowLimitUsed.toFixed(1)}% of limit used
            </p>
          </div>
        </div>

        {/* Available to Borrow */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <p
                className="text-sm font-semibold text-green-800"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                Available to Borrow:
              </p>
              <p className="text-xs text-green-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                Remaining capacity
              </p>
            </div>
            <span className="text-xl font-bold text-green-600" style={{ fontFamily: "var(--font-caveat)" }}>
              {formatCurrency(remainingCapacity)}
            </span>
          </div>
        </div>

        {/* Health Factor */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span
              className="text-sm font-semibold text-neutral-700"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Health Factor:
            </span>
            <span className={`text-lg font-bold ${
              healthFactor < 1.2 ? 'text-red-500' :
              healthFactor < 1.5 ? 'text-yellow-500' :
              'text-green-500'
            }`} style={{ fontFamily: "var(--font-caveat)" }}>
              {healthFactor.toFixed(2)}
            </span>
          </div>

          {/* Risk Indicator */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r from-${riskLevel.color}-400 to-${riskLevel.color}-500 h-2 rounded-full transition-all duration-300`}
                style={{ width: riskLevel.width }}
              />
            </div>
            <div className="flex justify-between items-center">
              <p
                className="text-xs text-neutral-600"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                Risk Level: <span className={`font-bold text-${riskLevel.color}-600`}>{riskLevel.level}</span>
              </p>
              <p className="text-xs text-neutral-500">
                Liquidation at 1.0
              </p>
            </div>
          </div>
        </div>

        {/* Collateral Assets */}
        <div className="space-y-2">
          <p
            className="text-sm font-semibold text-neutral-700"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Your Collateral Assets:
          </p>
          {mockPools.filter(pool => pool.userSupplied > 0).map((pool) => (
            <div key={pool.id} className="flex justify-between items-center bg-white/30 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{pool.icon}</span>
                <span className="text-sm font-medium">{pool.tokenSymbol}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(pool.userSupplied)}</p>
                <p className="text-xs text-neutral-600">{pool.supplyAPY}% APY</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
