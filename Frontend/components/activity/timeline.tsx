"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"
import { useTransactions } from "@/hooks/use-data"
import { formatRelativeTime, formatCurrency } from "@/lib/utils/index"

export function ActivityTimeline() {
  const [expandedTx, setExpandedTx] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  // Use the professional data hook
  const { data: transactions = [], isLoading } = useTransactions()

  const filteredTransactions = filter === "all"
    ? transactions
    : transactions.filter(tx => tx.type === filter)

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

  const getPoolIcon = (poolName: string) => {
    // Extract icon from pool name or use default
    if (poolName.includes('TechNova')) return '🚀'
    if (poolName.includes('GlobalFashion')) return '👗'
    if (poolName.includes('DeFi')) return '💎'
    return '🪙'
  }

  const getPoolInfo = (poolName: string) => {
    // Mock pool info based on name
    if (poolName.includes('TechNova')) {
      return {
        category: 'Technology',
        riskLevel: 'Medium',
        terms: { interestRate: 1500 }
      }
    }
    if (poolName.includes('GlobalFashion')) {
      return {
        category: 'E-commerce',
        riskLevel: 'Low',
        terms: { interestRate: 1000 }
      }
    }
    if (poolName.includes('DeFi')) {
      return {
        category: 'DeFi/Web3',
        riskLevel: 'High',
        terms: { interestRate: 2000 }
      }
    }
    return {
      category: 'Other',
      riskLevel: 'Medium',
      terms: { interestRate: 1200 }
    }
  }

  if (isLoading) {
    return (
      <div className="animate-bounce-in" style={{ animationDelay: "0.3s" }}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl text-heading" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              transaction history
            </h3>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {["all", "supply", "borrow", "repay", "withdraw"].map((type) => (
              <button
                key={type}
                className="px-2 py-1 rounded-full text-[10px] font-medium bg-gray-200 text-gray-600 whitespace-nowrap"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass p-4">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-2xl text-heading" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            transaction history
          </h3>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {["all", "supply", "borrow", "repay", "withdraw"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all whitespace-nowrap ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-white/50 text-neutral-600 hover:bg-white/70"
              }`}
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {type === "all" ? "all" : type}
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
                      <span className="text-lg">{getPoolIcon(transaction.poolName)}</span>
                      <p className="text-xs text-neutral-600 truncate">
                        {transaction.poolName}
                      </p>
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
                    <div className="border-t border-white/30 pt-2 mt-2">
                      <div className="text-xs text-neutral-600 mb-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                        Pool Information
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                        {transaction.poolName}
                      </div>
                      {(() => {
                        const poolInfo = getPoolInfo(transaction.poolName)
                        return poolInfo ? (
                          <div className="text-xs text-neutral-600 space-y-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                            <div>Category: {poolInfo.category}</div>
                            <div>Risk Level: {poolInfo.riskLevel}</div>
                            <div>Interest Rate: {(poolInfo.terms.interestRate / 100).toFixed(1)}% Fixed</div>
                          </div>
                        ) : null
                      })()}
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
