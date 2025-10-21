"use client"

import { useState } from "react"

export function LendForm() {
  const [depositAmount, setDepositAmount] = useState(1000)
  const [selectedPool, setSelectedPool] = useState("techstartup")

  const estimatedMonthlyEarnings = (depositAmount * 0.125) / 12

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
            value={selectedPool}
            onChange={(e) => setSelectedPool(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            <option value="techstartup">TechStartup Fund - 12.5% APY</option>
            <option value="creator">Creator Pool - 15.2% APY</option>
            <option value="growth">Growth Fund - 10.8% APY</option>
          </select>
        </div>

        {/* Earnings Projection */}
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
              <span className="font-bold text-green-600">+${estimatedMonthlyEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">Yearly Earnings:</span>
              <span className="font-bold text-green-600">+${(estimatedMonthlyEarnings * 12).toFixed(2)}</span>
            </div>
          </div>
        </div>

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
        <button className="btn-secondary w-full">Deposit Now</button>
      </div>
    </div>
  )
}
