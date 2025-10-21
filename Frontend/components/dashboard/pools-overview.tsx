"use client"

export function PoolsOverview() {
  const pools = [
    {
      id: 1,
      name: "TechStartup Fund",
      tvl: "$45,230",
      apy: "12.5%",
      status: "Active",
      color: "from-pink-300 to-pink-400",
    },
    {
      id: 2,
      name: "Creator Pool",
      tvl: "$28,900",
      apy: "15.2%",
      status: "Active",
      color: "from-blue-300 to-blue-400",
    },
  ]

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.4s" }}>
      <h3 className="text-2xl text-heading mb-4">Popular Pools</h3>
      <div className="space-y-3">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className="card-glass hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${pool.color} rounded-full`} />
              <div className="flex-1">
                <p
                  className="font-semibold text-sm"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {pool.name}
                </p>
                <p className="text-xs text-neutral-600">TVL: {pool.tvl}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-pink-500" style={{ fontFamily: "var(--font-caveat)" }}>
                  {pool.apy}
                </p>
                <p
                  className="text-xs text-green-600"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  APY
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
