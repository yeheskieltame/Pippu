"use client"

import { useState } from "react"
import { useDisconnect } from "wagmi"
import { LogOut, Download, HelpCircle, ChevronRight } from "lucide-react"

export function ProfileActions() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { disconnect } = useDisconnect()

  const actions = [
    {
      label: "Download Statement",
      description: "Export your transaction history",
      icon: Download,
      color: "from-blue-300 to-blue-400",
      action: () => {},
    },
    {
      label: "Help & Support",
      description: "Get help with your account",
      icon: HelpCircle,
      color: "from-purple-300 to-purple-400",
      action: () => {},
    },
    {
      label: "Disconnect Wallet",
      description: "Sign out of your account",
      icon: LogOut,
      color: "from-red-300 to-red-400",
      action: () => setShowLogoutConfirm(true),
    },
  ]

  return (
    <div className="animate-bounce-in" style={{ animationDelay: "0.4s" }}>
      <h3 className="text-2xl text-heading mb-4">More Options</h3>
      <div className="space-y-2 mb-6">
        {actions.map((action, idx) => {
          const Icon = action.icon
          return (
            <button
              key={idx}
              onClick={action.action}
              className="card-glass w-full flex items-center justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-full flex items-center justify-center`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {action.label}
                  </p>
                  <p
                    className="text-xs text-neutral-600"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    {action.description}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-neutral-400" />
            </button>
          )
        })}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-3xl p-6 animate-bounce-in">
            <h3 className="text-2xl text-heading mb-2">Disconnect Wallet?</h3>
            <p className="text-playful text-neutral-600 mb-6">
              You'll need to reconnect your wallet to access your account again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 bg-neutral-200 text-foreground rounded-full font-semibold hover:bg-neutral-300 transition-all"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  disconnect()
                  setShowLogoutConfirm(false)
                }}
                className="flex-1 btn-primary"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-center">
        <p className="text-xs text-blue-900" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Pippu v1.0 • Built on Base Sepolia • Powered by Farcaster
        </p>
      </div>
    </div>
  )
}
