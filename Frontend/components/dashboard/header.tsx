"use client"

import { useState, useEffect } from "react"

export function DashboardHeader() {
  const [greeting, setGreeting] = useState("Welcome")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  return (
    <div className="flex justify-between items-start mb-8 animate-fade-in">
      <div>
        <h1 className="text-4xl text-heading mb-2">{greeting}! 👋</h1>
        <p className="text-playful text-neutral-600">Ready to grow your assets with Pippu?</p>
      </div>
    </div>
  )
}
