"use client"

import { useState } from "react"

export function BorrowForm() {
  const [borrowAmount, setBorrowAmount] = useState(500)
  const [selectedPool, setSelectedPool] = useState("techstartup")
  const [selectedTerm, setSelectedTerm] = useState("6months")

  const pools = [
    { id: "techstartup", name: "TechStartup Fund", rate: "12.5%" },
    { id: "creator", name: "Creator Pool", rate: "15.2%" },
    { id: "growth", name: "Growth Fund", rate: "10.8%" },
  ]

  const terms = [
    { id: "3months", label: "3 Months", rate: "+0.5%" },
    { id: "6months", label: "6 Months", rate: "+0%" },
    { id: "12months", label: "12 Months", rate: "-0.5%" },
  ]

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
          <input
            type="number"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            min="0"
            step="50"
            max="700"
          />
          <p
            className="text-xs text-neutral-600 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Max available: $700 USDC
          </p>
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
            {pools.map((pool) => (
              <button
                key={pool.id}
                onClick={() => setSelectedPool(pool.id)}
                className={`w-full p-3 rounded-2xl text-sm transition-all duration-300 ${
                  selectedPool === pool.id
                    ? "bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-lg"
                    : "bg-white/50 text-foreground hover:bg-white/70"
                }`}
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{pool.name}</span>
                  <span className="text-xs">{pool.rate} APR</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Loan Term
          </label>
          <div className="grid grid-cols-3 gap-2">
            {terms.map((term) => (
              <button
                key={term.id}
                onClick={() => setSelectedTerm(term.id)}
                className={`p-3 rounded-2xl text-xs transition-all duration-300 ${
                  selectedTerm === term.id
                    ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white shadow-lg"
                    : "bg-white/50 text-foreground hover:bg-white/70"
                }`}
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                <div className="font-semibold">{term.label}</div>
                <div className="text-xs opacity-75">{term.rate}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-pink-100/50 to-blue-100/50 rounded-2xl p-4 border border-white/50">
          <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            <div className="flex justify-between">
              <span className="text-neutral-700">Borrow Amount:</span>
              <span className="font-bold">${borrowAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-700">Interest Rate:</span>
              <span className="font-bold text-pink-500">12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-700">Total to Repay:</span>
              <span className="font-bold text-foreground">${(borrowAmount * 1.125).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="btn-primary w-full">Request Loan</button>
      </div>
    </div>
  )
}
