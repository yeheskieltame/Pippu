"use client"

export function ActivityStats() {
  const stats = [
    {
      label: "Total Transactions",
      value: "24",
      color: "from-pink-300 to-pink-400",
    },
    {
      label: "This Month",
      value: "8",
      color: "from-blue-300 to-blue-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      {stats.map((stat, idx) => (
        <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}>
          <p className="text-xs opacity-90 mb-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            {stat.label}
          </p>
          <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-caveat)" }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
