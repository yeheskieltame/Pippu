"use client"

import { useState } from "react"

export function ProfileHeader() {
  const [userName] = useState("Alex Chen")
  const [userLevel] = useState("Gold Member")

  return (
    <div className="mb-8 animate-fade-in">
      <div className="card-gradient mb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
          👤
        </div>
        <h1 className="text-3xl text-heading mb-1">{userName}</h1>
        <p
          className="text-sm text-neutral-600 mb-4"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          {userLevel}
        </p>
        <div className="flex gap-2">
          <div
            className="px-3 py-1 bg-white/50 rounded-full text-xs font-semibold"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Member since 2024
          </div>
        </div>
      </div>
    </div>
  )
}
