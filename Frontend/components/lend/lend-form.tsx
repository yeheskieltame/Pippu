"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { usePools } from "@/lib/hooks/use-data"
import { useLend } from "@/lib/hooks/useLend"
import { formatCurrency } from "@/lib/utils/index"
import { type Address } from "viem"
import { useReadContract } from "wagmi"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"

export function LendForm() {
  const { address } = useAccount()
  const [depositAmount, setDepositAmount] = useState(1000)
  const [selectedPoolId, setSelectedPoolId] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState(500)

  // Lend hooks
  const { state, executeFund, executeWithdraw, reset, getUserBalance, getTokenDecimals } = useLend()

  // Get pools data
  const { data: pools = [], isLoading } = usePools()

  // Set default selected pool
  if (!selectedPoolId && pools.length > 0) {
    setSelectedPoolId(pools[0].id)
  }

  const selectedPool = pools.find(p => p.id === selectedPoolId)

  // Read real pool data from contract
  const { data: poolDetails } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getPoolDetails',
    args: selectedPool ? [selectedPool.id as Address] : undefined,
    enabled: !!selectedPool?.id
  })

  // Get user balance in selected pool
  const { data: userBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getProviderBalance',
    args: selectedPool && address ? [selectedPool.id as Address, address] : undefined,
    enabled: !!selectedPool?.id && !!address
  })

  const estimatedMonthlyEarnings = selectedPool
    ? (depositAmount * selectedPool.metrics.supplyAPY / 100) / 12
    : 0

  // Handle fund action
  const handleFund = async () => {
    if (!selectedPool || depositAmount <= 0) return

    const success = await executeFund(
      selectedPool.id as Address,
      selectedPool.loanAsset as Address,
      depositAmount
    )

    if (success) {
      setTimeout(() => {
        reset()
      }, 3000)
    }
  }

  // Handle withdraw action
  const handleWithdraw = async () => {
    if (!selectedPool || withdrawAmount <= 0) return

    const success = await executeWithdraw(
      selectedPool.id as Address,
      withdrawAmount
    )

    if (success) {
      setTimeout(() => {
        reset()
      }, 3000)
    }
  }

  const canFund = selectedPool && depositAmount >= 100 && !state.isFunding && !state.isApproving
  const canWithdraw = userBalance && withdrawAmount > 0 && parseFloat(userBalance.toString()) >= withdrawAmount && !state.isWithdrawing

  if (isLoading) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (pools.length === 0) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Start Lending</h3>
        <p className="text-center text-neutral-600">No pools available for lending at the moment.</p>
      </div>
    )
  }

  return (
    <div className="card-glass animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-4">Start Lending</h3>

      <div className="space-y-4">
        {/* Deposit Amount */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Deposit Amount (USDC)
          </label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            min="100"
            step="100"
          />
          <p
            className="text-xs text-neutral-600 mt-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Minimum deposit: 100 USDC
          </p>
        </div>

        {/* Pool Selection */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Select Pool
          </label>
          <select
            value={selectedPoolId}
            onChange={(e) => setSelectedPoolId(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            {pools.map((pool) => (
              <option key={pool.id} value={pool.id}>
                {pool.name} - {pool.metrics.supplyAPY.toFixed(1)}% Fixed APY
              </option>
            ))}
          </select>
          {selectedPool && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                Category: {selectedPool.category} • Risk: {selectedPool.riskLevel}
              </p>
              <p className="text-xs text-blue-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                Available: {formatCurrency(parseFloat(selectedPool.metrics.tvl) / Math.pow(10, selectedPool.loanAsset.decimals))}
              </p>
            </div>
          )}
        </div>

        {/* Earnings Projection */}
        {selectedPool && (
          <div className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-2xl p-4 border border-green-200/50">
            <p
              className="text-sm font-semibold text-green-900 mb-3"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Earnings Projection
            </p>
            <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <div className="flex justify-between">
                <span className="text-green-800">Monthly Earnings:</span>
                <span className="font-bold text-green-600">
                  +{formatCurrency(estimatedMonthlyEarnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Yearly Earnings:</span>
                <span className="font-bold text-green-600">
                  +{formatCurrency(estimatedMonthlyEarnings * 12)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Fixed Rate:</span>
                <span className="font-bold text-green-600">
                  {selectedPool.metrics.supplyAPY.toFixed(1)}% APY
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <p
            className="text-xs font-semibold text-blue-900 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Important Terms
          </p>
          <ul
            className="text-xs text-blue-800 space-y-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            <li>• You can withdraw anytime (subject to pool liquidity)</li>
            <li>• Interest compounds daily</li>
            <li>• Your funds are protected by collateral</li>
          </ul>
        </div>

        {/* Status Messages */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Error:</span> {state.error}
            </p>
          </div>
        )}

        {state.success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800 font-medium">
              🎉 {state.currentStep === 'completed' ? 'Transaction completed successfully!' : 'Transaction in progress...'}
            </p>
            <button
              onClick={reset}
              className="mt-2 w-full px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              New Transaction
            </button>
          </div>
        )}

        {/* Loading State */}
        {(state.isApproving || state.isFunding || state.isWithdrawing) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-800">
                {state.isApproving && 'Approving USDC...'}
                {state.isFunding && 'Funding pool...'}
                {state.isWithdrawing && 'Withdrawing from pool...'}
              </p>
            </div>
          </div>
        )}

        {/* Fund Button */}
        <button
          className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
            canFund
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          disabled={!canFund}
          onClick={handleFund}
        >
          {state.isApproving ? 'Approving...' :
           state.isFunding ? 'Funding...' :
           !canFund ? (depositAmount < 100 ? 'Minimum $100' : 'Select Pool') :
           `Fund ${formatCurrency(depositAmount)}`}
        </button>

        {/* Withdraw Section */}
        {userBalance && parseFloat(userBalance.toString()) > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Withdraw Funds
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Your Balance: {parseFloat(userBalance.toString()) / Math.pow(10, 6)} USDC
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className={`w-full px-3 py-2 bg-white/70 rounded-xl border ${
                    canWithdraw ? 'border-green-200' : 'border-red-200'
                  } focus:outline-none`}
                  min="1"
                  max={parseFloat(userBalance.toString()) / Math.pow(10, 6)}
                  step="1"
                />
              </div>
              <button
                className={`w-full py-2 rounded-xl font-semibold transition-all duration-300 ${
                  canWithdraw
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                disabled={!canWithdraw}
                onClick={handleWithdraw}
              >
                {state.isWithdrawing ? 'Withdrawing...' :
                 !canWithdraw ? 'Insufficient Balance' :
                 `Withdraw ${formatCurrency(withdrawAmount)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
