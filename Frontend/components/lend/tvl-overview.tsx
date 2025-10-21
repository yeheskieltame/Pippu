"use client"

import { useState } from "react"

export function TVLOverview() {
  const [totalTVL] = useState(156230)
  const [totalBorrowed] = useState(89450)
  const [availableLiquidity] = useState(66780)

  const utilizationRate = (totalBorrowed / totalTVL) * 100

  return (
    <div className="card-gradient mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-2xl text-heading mb-4">Pool Overview</h3>

      <div className="space-y-4">
        {/* Main TVL Display */}
        <div className="bg-white/50 rounded-2xl p-4 text-center">
          <p
            className="text-sm text-neutral-600 mb-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Total Value Locked
          </p>
          <h2 className="text-4xl text-heading">${totalTVL.toLocaleString()}</h2>
          <p
            className="text-xs text-green-600 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Across all pools
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-pink-100/50 to-pink-50 rounded-2xl p-4 border border-pink-200/50">
            <p
              className="text-xs text-neutral-600 mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Total Borrowed
            </p>
            <p className="text-2xl font-bold text-pink-600" style={{ fontFamily: "var(--font-caveat)" }}>
              ${totalBorrowed.toLocaleString()}
            </p>
            <p
              className="text-xs text-neutral-600 mt-1"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Active loans
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100/50 to-blue-50 rounded-2xl p-4 border border-blue-200/50">
            <p
              className="text-xs text-neutral-600 mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Available
            </p>
            <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: "var(--font-caveat)" }}>
              ${availableLiquidity.toLocaleString()}
            </p>
            <p
              className="text-xs text-neutral-600 mt-1"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Ready to lend
            </p>
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Pool Utilization
            </p>
            <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-caveat)" }}>
              {utilizationRate.toFixed(1)}%
            </p>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${utilizationRate}%` }}
            />
          </div>
          <p
            className="text-xs text-neutral-600 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            {utilizationRate > 80
              ? "High demand - Great rates!"
              : utilizationRate > 50
                ? "Moderate demand"
                : "Low demand - Good for borrowers"}
          </p>
        </div>
      </div>
    </div>
  )
}
