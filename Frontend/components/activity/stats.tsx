"use client"

import { mockUserStats, mockTransactions } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils/index"

export function ActivityStats() {
  // Calculate current month stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthTransactions = mockTransactions.filter(tx => {
    const txDate = new Date(tx.timestamp)
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
  })

  const monthlySupplyVolume = currentMonthTransactions
    .filter(tx => tx.type === 'supply')
    .reduce((sum, tx) => sum + tx.usdValue, 0)

  const monthlyBorrowVolume = currentMonthTransactions
    .filter(tx => tx.type === 'borrow')
    .reduce((sum, tx) => sum + tx.usdValue, 0)

  const stats = [
    {
      label: "Total Transactions",
      value: mockUserStats.totalDeposits + mockUserStats.totalWithdrawals + mockUserStats.totalBorrows + mockUserStats.totalRepays,
      subtext: "All time",
      color: "from-pink-300 to-pink-400",
    },
    {
      label: "Monthly Volume",
      value: formatCurrency(monthlySupplyVolume + monthlyBorrowVolume),
      subtext: `${currentMonthTransactions.length} txns`,
      color: "from-blue-300 to-blue-400",
    },
    {
      label: "Total Interest",
      value: formatCurrency(mockUserStats.totalInterestEarned),
      subtext: "Earned",
      color: "from-green-300 to-green-400",
    },
    {
      label: "Account Age",
      value: `${mockUserStats.accountAge} days`,
      subtext: "Active user",
      color: "from-purple-300 to-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      {stats.map((stat, idx) => (
        <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}>
          <p className="text-xs opacity-90 mb-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            {stat.label}
          </p>
          <p className="text-lg font-bold" style={{ fontFamily: "var(--font-caveat)" }}>
            {stat.value}
          </p>
          <p className="text-xs opacity-75 mt-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            {stat.subtext}
          </p>
        </div>
      ))}
    </div>
  )
}
