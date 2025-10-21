"use client"

import { useState } from "react"

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const securityOptions = [
    {
      label: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      icon: "🔒",
      enabled: twoFactorEnabled,
      action: () => setTwoFactorEnabled(!twoFactorEnabled),
    },
    {
      label: "Transaction Limits",
      description: "Set daily withdrawal limits",
      icon: "⚙️",
      enabled: true,
      action: () => {},
    },
    {
      label: "Notification Preferences",
      description: "Manage email and push alerts",
      icon: "🔔",
      enabled: true,
      action: () => {},
    },
  ]

  return (
    <div className="mb-6 animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-4">Security & Privacy</h3>
      <div className="space-y-2">
        {securityOptions.map((option, idx) => (
          <button
            key={idx}
            onClick={option.action}
            className="card-glass w-full flex items-center justify-between hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{option.icon}</span>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {option.label}
                </p>
                <p
                  className="text-xs text-neutral-600"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {option.description}
                </p>
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-all duration-300 ${
                option.enabled ? "bg-green-400" : "bg-neutral-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                  option.enabled ? "translate-x-5" : "translate-x-0.5"
                } mt-0.5`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
