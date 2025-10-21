"use client"

import { useState } from "react"

export function ActivityFilters() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filters = [
    { id: "all", label: "All", icon: "📋" },
    { id: "borrow", label: "Borrow", icon: "📈" },
    { id: "lend", label: "Lend", icon: "💰" },
    { id: "interest", label: "Interest", icon: "✨" },
  ]

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full font-fredoka text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg"
                : "bg-white/50 text-foreground hover:bg-white/70"
            }`}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
