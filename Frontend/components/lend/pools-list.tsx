"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function PoolsList() {
  const [expandedPool, setExpandedPool] = useState<string | null>(null)

  const pools = [
    {
      id: "techstartup",
      name: "TechStartup Fund",
      description: "Funding for innovative tech companies",
      tvl: 45230,
      apy: 12.5,
      borrowed: 28500,
      lenders: 234,
      riskLevel: "Low",
      color: "from-pink-300 to-pink-400",
    },
    {
      id: "creator",
      name: "Creator Pool",
      description: "Supporting content creators and influencers",
      tvl: 67890,
      apy: 15.2,
      borrowed: 42300,
      lenders: 456,
      riskLevel: "Medium",
      color: "from-blue-300 to-blue-400",
    },
    {
      id: "growth",
      name: "Growth Fund",
      description: "Early-stage startup acceleration",
      tvl: 43110,
      apy: 10.8,
      borrowed: 18650,
      lenders: 189,
      riskLevel: "Medium",
      color: "from-purple-300 to-purple-400",
    },
  ]

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-2xl text-heading mb-4">Available Pools</h3>
      <div className="space-y-3">
        {pools.map((pool) => (
          <div key={pool.id} className="card-glass overflow-hidden">
            <button
              onClick={() => setExpandedPool(expandedPool === pool.id ? null : pool.id)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${pool.color} rounded-full flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.name}
                  </p>
                  <p className="text-xs text-neutral-600 truncate">{pool.description}</p>
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
                    TVL
                  </p>
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-caveat)" }}>
                    ${(pool.tvl / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    APY
                  </p>
                  <p className="text-sm font-bold text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
                    {pool.apy}%
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Risk
                  </p>
                  <p
                    className="text-xs font-semibold text-blue-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {pool.riskLevel}
                  </p>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedPool === pool.id && (
              <div className="mt-4 pt-4 border-t border-white/30 space-y-3 animate-fade-in">
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Total Borrowed:</span>
                  <span className="font-bold">${pool.borrowed.toLocaleString()}</span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Active Lenders:</span>
                  <span className="font-bold">{pool.lenders}</span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  <span className="text-neutral-600">Utilization:</span>
                  <span className="font-bold">{((pool.borrowed / pool.tvl) * 100).toFixed(1)}%</span>
                </div>

                <button className="btn-primary w-full mt-4">Deposit to Pool</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
