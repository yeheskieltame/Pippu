"use client"

import { useState } from "react"
import { mockPools, mockBorrowingPower } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/index"

export function BorrowForm() {
  const [borrowAmount, setBorrowAmount] = useState(500)
  const [selectedPoolId, setSelectedPoolId] = useState("2")

  const selectedPool = mockPools.find(pool => pool.id === selectedPoolId)
  const availableToBorrow = mockBorrowingPower.availableToBorrow

  const calculateInterest = (amount: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12
    return amount * monthlyRate * months
  }

  const monthlyInterest = calculateInterest(borrowAmount, selectedPool?.borrowAPY || 0, 1)
  const totalInterest = calculateInterest(borrowAmount, selectedPool?.borrowAPY || 0, 12)
  const totalToRepay = borrowAmount + totalInterest

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
            {mockPools.filter(pool => pool.availableLiquidity >= borrowAmount).map((pool) => (
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
                    <span className="text-lg">{pool.icon}</span>
                    <span className="font-semibold">{pool.tokenSymbol}</span>
                  </div>
                  <span className="text-xs">{pool.borrowAPY}% APR</span>
                </div>
                {pool.availableLiquidity < borrowAmount * 2 && (
                  <div className="text-xs mt-1 opacity-75">
                    Limited liquidity: {formatCurrency(pool.availableLiquidity)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Calculation */}
        <div className="bg-gradient-to-r from-pink-100/50 to-blue-100/50 rounded-2xl p-4 border border-white/50">
          <div className="space-y-3 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            <div className="flex justify-between">
              <span className="text-neutral-700">Borrow Amount:</span>
              <span className="font-bold">{formatCurrency(borrowAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-700">Interest Rate:</span>
              <span className="font-bold text-pink-500">{selectedPool?.borrowAPY}% APR</span>
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

        {/* Health Factor Warning */}
        {mockBorrowingPower.healthFactor < 1.5 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-red-700">Low Health Factor</p>
                <p className="text-xs text-red-600">
                  Your health factor is {mockBorrowingPower.healthFactor}. Consider adding more collateral.
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
