"use client"

import type React from "react"

import { useState } from "react"

export function CollateralCalculator() {
  const [collateralAmount, setCollateralAmount] = useState(1000)
  const maxLoanAmount = collateralAmount * 0.7

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollateralAmount(Number(e.target.value))
  }

  return (
    <div className="card-gradient mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-2xl text-heading mb-4">Collateral Calculator</h3>

      <div className="space-y-4">
        {/* Collateral Input */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Collateral Amount (USDC)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(Number(e.target.value))}
              className="flex-1 px-4 py-3 bg-white/50 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              min="0"
              step="100"
            />
            <button
              className="px-4 py-3 bg-gradient-to-r from-pink-300 to-pink-400 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              MAX
            </button>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max="10000"
            value={collateralAmount}
            onChange={handleSliderChange}
            className="w-full h-3 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full appearance-none cursor-pointer accent-pink-400"
          />
          <div
            className="flex justify-between text-xs text-neutral-600 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            <span>$0</span>
            <span>$10,000</span>
          </div>
        </div>

        {/* Calculation Display */}
        <div className="bg-white/50 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span
              className="text-sm text-neutral-700"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Collateral Value:
            </span>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-caveat)" }}>
              ${collateralAmount.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-white/30 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-sm text-neutral-700"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                Max Loan (70%):
              </span>
              <span className="text-lg font-bold text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
                ${maxLoanAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
            </div>
            <p
              className="text-xs text-neutral-600"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              You can borrow up to 70% of your collateral value
            </p>
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <p
            className="text-xs font-semibold text-blue-900 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Liquidation Risk
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: "35%" }}
            />
          </div>
          <p
            className="text-xs text-blue-800 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Low risk - Your collateral is well-protected
          </p>
        </div>
      </div>
    </div>
  )
}
