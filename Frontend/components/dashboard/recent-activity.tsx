"use client"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "deposit",
      description: "Deposited 500 USDC",
      pool: "TechStartup Fund",
      time: "2 hours ago",
      amount: "+500",
    },
    {
      id: 2,
      type: "borrow",
      description: "Borrowed 1000 USDC",
      pool: "Creator Pool",
      time: "1 day ago",
      amount: "-1000",
    },
    {
      id: 3,
      type: "interest",
      description: "Interest earned",
      pool: "TechStartup Fund",
      time: "3 days ago",
      amount: "+45.50",
    },
  ]

  return (
    <div className="animate-bounce-in" style={{ animationDelay: "0.5s" }}>
      <h3 className="text-2xl text-heading mb-4">Recent Activity</h3>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div key={activity.id} className="card-glass py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {activity.description}
                </p>
                <p className="text-xs text-neutral-600">{activity.pool}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    activity.amount.startsWith("+") ? "text-green-500" : "text-pink-500"
                  }`}
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  {activity.amount}
                </p>
                <p className="text-xs text-neutral-600">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
