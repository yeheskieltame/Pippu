"use client"

import { mockTransactions } from "@/lib/mock-data"
import { formatRelativeTime } from "@/lib/utils/index"
import Link from "next/link"

export function RecentActivity() {
  // Show only the latest 4 transactions
  const recentTransactions = mockTransactions.slice(0, 4)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'supply': return '📈'
      case 'borrow': return '💸'
      case 'repay': return '💰'
      case 'withdraw': return '📉'
      default: return '🔄'
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'supply': return 'text-green-500'
      case 'borrow': return 'text-blue-500'
      case 'repay': return 'text-purple-500'
      case 'withdraw': return 'text-orange-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="animate-bounce-in" style={{ animationDelay: "0.5s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl text-heading">Recent Activity</h3>
        <Link
          href="/activity"
          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          View All →
        </Link>
      </div>
      <div className="space-y-2">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="card-glass py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {transaction.description}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {formatRelativeTime(transaction.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${getTransactionColor(transaction.type)}`}
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  {transaction.type === 'supply' || transaction.type === 'repay' ? '+' : '-'}
                  {transaction.tokenAmount} {transaction.tokenSymbol}
                </p>
                <p className="text-xs text-neutral-600">
                  ${transaction.usdValue.toLocaleString()}
                </p>
              </div>
            </div>
            {transaction.status === 'pending' && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <p className="text-xs text-yellow-600">Pending confirmation</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
