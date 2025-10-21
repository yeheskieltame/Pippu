"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export function AccountSettings() {
  const [email] = useState("alex.chen@example.com")
  const [walletAddress] = useState("0x1234...5678")

  const settings = [
    {
      label: "Email Address",
      value: email,
      icon: "📧",
    },
    {
      label: "Wallet Address",
      value: walletAddress,
      icon: "🔐",
    },
    {
      label: "Preferred Network",
      value: "Base Sepolia",
      icon: "🌐",
    },
  ]

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-2xl text-heading mb-4">Account Settings</h3>
      <div className="space-y-2">
        {settings.map((setting, idx) => (
          <button
            key={idx}
            className="card-glass w-full flex items-center justify-between hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{setting.icon}</span>
              <div className="text-left">
                <p
                  className="text-xs text-neutral-600"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {setting.label}
                </p>
                <p
                  className="text-sm font-semibold truncate"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {setting.value}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-neutral-400" />
          </button>
        ))}
      </div>
    </div>
  )
}
