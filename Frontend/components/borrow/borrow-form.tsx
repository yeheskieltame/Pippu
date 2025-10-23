"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { usePools } from "@/hooks/use-data"
import { formatCurrency, formatPercent } from "@/lib/utils/format"

export function BorrowForm() {
  const { isConnected, address } = useAccount()
  const [borrowAmount, setBorrowAmount] = useState(500)
  const [selectedPoolId, setSelectedPoolId] = useState("")

  // Get pools data - should show user's created pools
  const { data: pools = [], isLoading } = usePools()

  // Filter pools that belong to current user (in real app, would filter by borrower address)
  const userPools = pools.filter(pool =>
    pool.borrower === address || pool.status.active // For demo, show all active pools
  )

  // Set default selected pool
  if (!selectedPoolId && userPools.length > 0) {
    setSelectedPoolId(userPools[0].id)
  }

  const selectedPool = userPools.find(pool => pool.id === selectedPoolId)

  // ETH price assumption for MVP
  const ETH_PRICE = 3835.61
  const MAX_LTV = 0.7

  // Calculate borrowing power for selected pool
  const getPoolBorrowingPower = (pool: any) => {
    if (!pool) return { maxBorrow: 0, available: 0, collateralValue: 0 }

    // Calculate collateral value based on pool data
    const collateralValue = parseFloat(pool.metrics.totalCollateral) * ETH_PRICE
    const maxBorrow = collateralValue * MAX_LTV

    // Available amount is max borrow minus what's already borrowed
    const alreadyBorrowed = parseFloat(pool.metrics.totalLoaned) || 0
    const available = maxBorrow - alreadyBorrowed

    return { maxBorrow, available, collateralValue }
  }

  const borrowingPower = selectedPool ? getPoolBorrowingPower(selectedPool) : { maxBorrow: 0, available: 0, collateralValue: 0 }
  const canBorrow = selectedPool && borrowAmount <= borrowingPower.available && borrowingPower.available > 0

  // Interest calculation
  const calculateInterest = (amount: number, rate: number, days: number) => {
    const dailyRate = rate / 100 / 365
    return amount * dailyRate * days
  }

  const loanDuration = selectedPool?.terms.loanDuration ? selectedPool.terms.loanDuration / (24 * 60 * 60) : 30 // Convert seconds to days
  const interest = calculateInterest(borrowAmount, selectedPool?.terms.interestRate || 12, loanDuration)
  const totalToRepay = borrowAmount + interest

  if (!isConnected) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Borrow Funds</h3>
        <p className="text-center text-neutral-600">Please connect your wallet to borrow funds</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (userPools.length === 0) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Borrow Funds</h3>
        <p className="text-center text-neutral-600 mb-4">
          You don't have any active borrowing pools.
        </p>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            Create a pool first to lock collateral and get access to borrowing.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-glass animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-6">Borrow Funds</h3>

      <div className="space-y-6">
        {/* Pool Selection */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Select Your Pool
          </label>
          <select
            value={selectedPoolId}
            onChange={(e) => setSelectedPoolId(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            {userPools.map((pool) => (
              <option key={pool.id} value={pool.id}>
                {pool.name} - {formatPercent(pool.metrics.supplyAPY)} APY
              </option>
            ))}
          </select>
          {selectedPool && (
            <div className="mt-3 p-3 bg-blue-50 rounded-xl">
              <div className="grid grid-cols-2 gap-2 text-xs" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                <div>
                  <span className="text-blue-800">Collateral:</span>
                  <span className="ml-1 font-bold text-blue-600">
                    {parseFloat(selectedPool.metrics.totalCollateral).toFixed(2)} ETH
                  </span>
                </div>
                <div>
                  <span className="text-blue-800">Value:</span>
                  <span className="ml-1 font-bold text-blue-600">
                    {formatCurrency(borrowingPower.collateralValue)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-800">Max Borrow:</span>
                  <span className="ml-1 font-bold text-blue-600">
                    {formatCurrency(borrowingPower.maxBorrow)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-800">Available:</span>
                  <span className="ml-1 font-bold text-green-600">
                    {formatCurrency(borrowingPower.available)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Borrow Amount */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Borrow Amount (USDC)
          </label>
          <input
            type="number"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(Number(e.target.value))}
            className={`w-full px-4 py-3 bg-white/50 rounded-2xl border-2 ${
              canBorrow ? 'border-blue-200 focus:border-blue-400' : 'border-red-200 focus:border-red-400'
            } focus:outline-none`}
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            min="100"
            max={borrowingPower.available}
            step="100"
          />
          {!canBorrow && borrowAmount > borrowingPower.available && (
            <p className="text-xs text-red-600 mt-2">
              Maximum available: {formatCurrency(borrowingPower.available)}
            </p>
          )}
          {borrowingPower.available <= 0 && (
            <p className="text-xs text-red-600 mt-2">
              No borrowing power available. Check if your pool is funded.
            </p>
          )}
        </div>

        {/* Loan Summary */}
        {selectedPool && borrowAmount > 0 && (
          <div className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-2xl p-4 border border-green-200/50">
            <h4
              className="text-sm font-semibold text-green-900 mb-3"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Loan Summary
            </h4>
            <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <div className="flex justify-between">
                <span className="text-green-800">Borrow Amount:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(borrowAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Interest Rate:</span>
                <span className="font-bold text-green-600">
                  {formatPercent(selectedPool.terms.interestRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Loan Duration:</span>
                <span className="font-bold text-green-600">
                  {loanDuration} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Interest Amount:</span>
                <span className="font-bold text-green-600">
                  +{formatCurrency(interest)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-green-300 pt-2 mt-2">
                <span className="text-green-900">Total Repayment:</span>
                <span className="text-green-600">
                  {formatCurrency(totalToRepay)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pool Status */}
        {selectedPool && (
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
            <h4
              className="text-sm font-semibold text-purple-900 mb-3"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Pool Status
            </h4>
            <div className="space-y-2 text-xs" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <div className="flex justify-between">
                <span className="text-purple-800">Pool Status:</span>
                <span className={`font-bold ${
                  selectedPool.status.loanDisbursed ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {selectedPool.status.loanDisbursed ? 'Loan Active' : 'Ready to Borrow'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-800">Total Liquidity:</span>
                <span className="font-bold text-purple-600">
                  {formatCurrency(parseFloat(selectedPool.metrics.totalLiquidity))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-800">Already Borrowed:</span>
                <span className="font-bold text-purple-600">
                  {formatCurrency(parseFloat(selectedPool.metrics.totalLoaned))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-800">Utilization Rate:</span>
                <span className="font-bold text-purple-600">
                  {formatPercent(selectedPool.metrics.utilizationRate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Important Terms */}
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <h4
            className="text-xs font-semibold text-yellow-900 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Important Terms
          </h4>
          <ul
            className="text-xs text-yellow-800 space-y-1"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            <li>• You must repay the loan amount plus interest before the due date</li>
            <li>• Your ETH collateral will be locked until full repayment</li>
            <li>• Late payments may result in additional interest fees</li>
            <li>• Default may lead to collateral liquidation</li>
          </ul>
        </div>

        {/* Borrow Button */}
        <button
          className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
            canBorrow
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          disabled={!canBorrow}
          onClick={() => {
            if (canBorrow) {
              // TODO: Implement contract call to disburse loan
              console.log("Borrowing:", {
                poolId: selectedPoolId,
                amount: borrowAmount,
                totalRepayment: totalToRepay
              })
            }
          }}
        >
          {!canBorrow ? (
            borrowingPower.available <= 0 ? 'Pool Not Funded' : 'Adjust Borrow Amount'
          ) : (
            `Borrow ${formatCurrency(borrowAmount)}`
          )}
        </button>
      </div>
    </div>
  )
}