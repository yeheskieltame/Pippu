"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function ActivityTimeline() {
  const [expandedTx, setExpandedTx] = useState<string | null>(null)

  const activities = [
    {
      id: "tx-001",
      date: "Today",
      time: "2:45 PM",
      type: "deposit",
      title: "Deposited to Creator Pool",
      amount: "+500 USDC",
      pool: "Creator Pool",
      status: "Completed",
      txHash: "0x1234...5678",
      details: {
        from: "Your Wallet",
        to: "Creator Pool Contract",
        fee: "0.50 USDC",
      },
    },
    {
      id: "tx-002",
      date: "Yesterday",
      time: "11:20 AM",
      type: "interest",
      title: "Interest Earned",
      amount: "+45.50 USDC",
      pool: "TechStartup Fund",
      status: "Completed",
      txHash: "0x9876...5432",
      details: {
        period: "Monthly",
        rate: "12.5% APY",
        source: "Borrower Payments",
      },
    },
    {
      id: "tx-003",
      date: "2 days ago",
      time: "3:15 PM",
      type: "borrow",
      title: "Borrowed from Pool",
      amount: "-1000 USDC",
      pool: "TechStartup Fund",
      status: "Active",
      txHash: "0x5555...6666",
      details: {
        collateral: "1500 USDC",
        rate: "12.5% APY",
        term: "6 Months",
      },
    },
    {
      id: "tx-004",
      date: "1 week ago",
      time: "9:30 AM",
      type: "deposit",
      title: "Deposited to TechStartup Fund",
      amount: "+1000 USDC",
      pool: "TechStartup Fund",
      status: "Completed",
      txHash: "0x3333...4444",
      details: {
        from: "Your Wallet",
        to: "TechStartup Fund Contract",
        fee: "1.00 USDC",
      },
    },
    {
      id: "tx-005",
      date: "2 weeks ago",
      time: "4:00 PM",
      type: "interest",
      title: "Interest Earned",
      amount: "+32.25 USDC",
      pool: "Creator Pool",
      status: "Completed",
      txHash: "0x7777...8888",
      details: {
        period: "Monthly",
        rate: "15.2% APY",
        source: "Borrower Payments",
      },
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "from-blue-300 to-blue-400"
      case "borrow":
        return "from-pink-300 to-pink-400"
      case "interest":
        return "from-green-300 to-green-400"
      default:
        return "from-neutral-300 to-neutral-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return "💳"
      case "borrow":
        return "📊"
      case "interest":
        return "✨"
      default:
        return "📝"
    }
  }

  return (
    <div className="animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-4">Transaction History</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="card-glass overflow-hidden">
            <button
              onClick={() => setExpandedTx(expandedTx === activity.id ? null : activity.id)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(activity.type)} rounded-full flex items-center justify-center text-xl flex-shrink-0`}
                >
                  {getTypeIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {activity.title}
                  </p>
                  <p className="text-xs text-neutral-600">{activity.pool}</p>
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    expandedTx === activity.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {activity.date}
                  </span>
                  <span
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {activity.time}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    activity.amount.startsWith("+") ? "text-green-500" : "text-pink-500"
                  }`}
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  {activity.amount}
                </span>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedTx === activity.id && (
              <div className="mt-4 pt-4 border-t border-white/30 space-y-3 animate-fade-in">
                <div className="bg-white/50 rounded-2xl p-3 space-y-2">
                  {Object.entries(activity.details).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-sm"
                      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                    >
                      <span className="text-neutral-600 capitalize">{key}:</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-blue-50 rounded-2xl p-3 border border-blue-200">
                  <div>
                    <p
                      className="text-xs text-blue-900"
                      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                    >
                      Status
                    </p>
                    <p
                      className="text-sm font-semibold text-blue-600"
                      style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                    >
                      {activity.status}
                    </p>
                  </div>
                  <button
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    View on Explorer
                  </button>
                </div>

                <div className="bg-neutral-100 rounded-2xl p-3 break-all">
                  <p
                    className="text-xs text-neutral-600 mb-1"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Transaction Hash
                  </p>
                  <p className="text-xs font-mono text-neutral-700">{activity.txHash}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
