"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useUserPortfolio } from "@/hooks/use-data"
import { formatCurrency } from "@/lib/utils/index"
import { WalletConnect } from "@/components/wallet/wallet-connect"

export function PortfolioCard() {
  const [showBalance, setShowBalance] = useState(true)
  const { isConnected, address } = useAccount()

  // Get user portfolio data
  const { data: portfolio, isLoading } = useUserPortfolio(address as `0x${string}`)

  if (!isConnected) {
    return (
      <div className="card-gradient mb-6 animate-bounce-in flex flex-col items-center justify-center py-12" style={{ animationDelay: "0.1s" }}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl text-heading mb-2">Connect Your Wallet</h2>
          <p className="text-sm text-neutral-600">
            Connect your wallet to view your portfolio and start earning with Pippu
          </p>
        </div>
        <WalletConnect />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="card-gradient mb-6 animate-bounce-in p-6" style={{ animationDelay: "0.1s" }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card-gradient mb-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p
            className="text-sm text-neutral-600 mb-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Total Portfolio
          </p>
          <h2 className="text-3xl text-heading">
            {showBalance ? formatCurrency(portfolio?.totalValue || 0) : "••••••"}
          </h2>
        </div>
        <button onClick={() => setShowBalance(!showBalance)} className="text-2xl hover:scale-110 transition-transform">
          {showBalance ? "👁️" : "🙈"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/50 rounded-2xl p-4">
          <p
            className="text-xs text-neutral-600 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Borrowed
          </p>
          <p className="text-xl text-heading">{formatCurrency(portfolio?.totalBorrowed || 0)}</p>
        </div>
        <div className="bg-white/50 rounded-2xl p-4">
          <p
            className="text-xs text-neutral-600 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Supplying
          </p>
          <p className="text-xl text-heading">{formatCurrency(portfolio?.totalSupplied || 0)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/30">
        <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Net APY: <span className="text-green-500 font-bold">{portfolio?.netAPY || 0}%</span>
          <span className="mx-2">•</span>
          Interest earned: <span className="text-pink-500 font-bold">+{formatCurrency(portfolio?.interestEarned || 0)}</span>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Health Factor: <span className={`font-bold ${(portfolio?.healthFactor || 0) < 1.5 ? 'text-red-500' : 'text-green-500'}`}>
            {portfolio?.healthFactor || 0}
          </span>
        </p>
        <p className="text-xs text-neutral-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
          Available to Borrow: <span className="font-bold text-blue-500">
            {formatCurrency(portfolio?.availableToBorrow || 0)}
          </span>
        </p>
      </div>
    </div>
  )
}
