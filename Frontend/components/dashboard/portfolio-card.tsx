"use client"

import { useState } from "react"

export function PortfolioCard() {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="card-gradient mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p
            className="text-sm text-neutral-600 mb-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Total Portfolio
          </p>
          <h2 className="text-3xl text-heading">{showBalance ? "$12,450.50" : "••••••"}</h2>
        </div>
        <button onClick={() => setShowBalance(!showBalance)} className="text-2xl hover:scale-110 transition-transform">
          {showBalance ? "👁️" : "🙈"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/50 rounded-2xl p-4">
          <p
            className="text-xs text-neutral-600 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Borrowed
          </p>
          <p className="text-xl text-heading">$3,200</p>
        </div>
        <div className="bg-white/50 rounded-2xl p-4">
          <p
            className="text-xs text-neutral-600 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Lending
          </p>
          <p className="text-xl text-heading">$9,250</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/30">
        <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Interest earned this month: <span className="text-pink-500 font-bold">+$125.50</span>
        </p>
      </div>
    </div>
  )
}
