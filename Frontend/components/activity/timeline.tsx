"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"
import { mockTransactions, mockPools } from "@/lib/mock-data"
import { formatRelativeTime, formatCurrency } from "@/lib/utils/index"

export function ActivityTimeline() {
  const [expandedTx, setExpandedTx] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const filteredTransactions = filter === "all"
    ? mockTransactions
    : mockTransactions.filter(tx => tx.type === filter)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "supply":
        return "from-green-300 to-green-400"
      case "borrow":
        return "from-blue-300 to-blue-400"
      case "repay":
        return "from-purple-300 to-purple-400"
      case "withdraw":
        return "from-orange-300 to-orange-400"
      default:
        return "from-neutral-300 to-neutral-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "supply":
        return "📈"
      case "borrow":
        return "💸"
      case "repay":
        return "💰"
      case "withdraw":
        return "📉"
      default:
        return "🔄"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "failed":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPoolName = (poolId: string) => {
    const pool = mockPools.find(p => p.id === poolId)
    return pool?.tokenSymbol || "Unknown Pool"
  }

  const getPoolIcon = (poolId: string) => {
    const pool = mockPools.find(p => p.id === poolId)
    return pool?.icon || "🪙"
  }

  return (
    <div className="animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl text-heading">Transaction History</h3>
        <div className="flex gap-2">
          {["all", "supply", "borrow", "repay", "withdraw"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-white/50 text-neutral-600 hover:bg-white/70"
              }`}
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="card-glass p-8 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            No {filter === "all" ? "" : filter} transactions found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="card-glass overflow-hidden">
              <button
                onClick={() => setExpandedTx(expandedTx === transaction.id ? null : transaction.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(transaction.type)} rounded-full flex items-center justify-center text-xl shrink-0`}
                  >
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm"
                      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                    >
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPoolIcon(transaction.poolId)}</span>
                      <p className="text-xs text-neutral-600">{getPoolName(transaction.poolId)}</p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                      expandedTx === transaction.id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs text-neutral-600`}
                      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                    >
                      {formatRelativeTime(transaction.timestamp)}
                    </span>
                    {transaction.status === 'pending' && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        <span className="text-xs text-yellow-600">Pending</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        transaction.type === "supply" || transaction.type === "repay"
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                      style={{ fontFamily: "var(--font-caveat)" }}
                    >
                      {transaction.type === "supply" || transaction.type === "repay" ? "+" : "-"}
                      {transaction.tokenAmount} {transaction.tokenSymbol}
                    </span>
                    <p className="text-xs text-neutral-600">
                      {formatCurrency(transaction.usdValue)}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedTx === transaction.id && (
                <div className="mt-4 pt-4 border-t border-white/30 space-y-3 animate-fade-in">
                  <div className="bg-white/50 rounded-2xl p-3 space-y-2">
                    <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      <span className="text-neutral-600">Transaction Type:</span>
                      <span className="font-semibold capitalize">{transaction.type}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      <span className="text-neutral-600">Amount:</span>
                      <span className="font-semibold">
                        {transaction.tokenAmount} {transaction.tokenSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      <span className="text-neutral-600">USD Value:</span>
                      <span className="font-semibold">{formatCurrency(transaction.usdValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                      <span className="text-neutral-600">Pool:</span>
                      <span className="font-semibold">{getPoolName(transaction.poolId)}</span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between rounded-2xl p-3 border ${getStatusColor(transaction.status)}`}>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                        Status
                      </p>
                      <p className="text-sm font-semibold capitalize" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                        {transaction.status}
                      </p>
                    </div>
                    {transaction.hash && (
                      <button
                        className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                      >
                        <ExternalLink size={12} />
                        Explorer
                      </button>
                    )}
                  </div>

                  {transaction.hash && (
                    <div className="bg-neutral-100 rounded-2xl p-3 break-all">
                      <p className="text-xs text-neutral-600 mb-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                        Transaction Hash
                      </p>
                      <p className="text-xs font-mono text-neutral-700">{transaction.hash}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
