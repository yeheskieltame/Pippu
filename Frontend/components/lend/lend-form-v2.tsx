"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { usePools } from "@/lib/hooks/use-data"
import { formatCurrency, formatPercent } from "@/lib/utils/format"
import { type Address } from "viem"
import { useReadContract } from "wagmi"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import {
  FundPoolTransaction,
  WithdrawFromPoolTransaction
} from "@/components/transactions"
import { Web3ErrorBoundary } from "@/components/common/web3-error-boundary"

interface LendFormV2Props {
  onSuccess?: (action: string, data: any) => void
  onError?: (error: Error) => void
}

export function LendFormV2({ onSuccess, onError }: LendFormV2Props) {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form states
  const [depositAmount, setDepositAmount] = useState(1000)
  const [withdrawAmount, setWithdrawAmount] = useState(500)
  const [selectedPoolId, setSelectedPoolId] = useState("")
  const [currentAction, setCurrentAction] = useState<'fund' | 'withdraw'>('fund')

  // Transaction states
  const [transactions, setTransactions] = useState<{
    fund?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
    withdraw?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
  }>({})

  // Get pools data
  const { data: pools = [], isLoading, refetch: refetchPools } = usePools()

  // Set default selected pool
  useEffect(() => {
    if (!selectedPoolId && pools.length > 0) {
      setSelectedPoolId(pools[0].id)
    }
  }, [pools, selectedPoolId])

  const selectedPool = pools.find(p => p.id === selectedPoolId)

  // Read real pool data from contract
  const { data: poolDetails, refetch: refetchPoolDetails } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getPoolDetails',
    args: selectedPool ? [selectedPool.id as Address] : undefined,
    query: {
      enabled: !!selectedPool?.id
    }
  })

  // Get user balance in selected pool
  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getProviderBalance',
    args: selectedPool && address ? [selectedPool.id as Address, address] : undefined,
    query: {
      enabled: !!selectedPool?.id && !!address
    }
  })

  // Calculate earnings
  const estimatedMonthlyEarnings = selectedPool
    ? (depositAmount * selectedPool.metrics.supplyAPY / 100) / 12
    : 0

  const userBalanceFormatted = userBalance
    ? parseFloat(userBalance.toString()) / Math.pow(10, 6)
    : 0

  const canFund = selectedPool && depositAmount >= 100 && !!selectedPool?.loanAsset?.address && !!selectedPool?.id
  const canWithdraw = userBalanceFormatted > 0 && withdrawAmount <= userBalanceFormatted

  // Transaction handlers
  const handleFundSuccess = (receipt: any) => {
    setTransactions(prev => ({ ...prev, fund: { status: 'success', hash: receipt.transactionReceipts[0].transactionHash } }))
    onSuccess?.('fund', receipt)
    refetchPoolDetails()
    refetchUserBalance()
    refetchPools()
  }

  const handleFundError = (error: any) => {
    setTransactions(prev => ({ ...prev, fund: { status: 'error' } }))
    onError?.(error)
  }

  const handleWithdrawSuccess = (receipt: any) => {
    setTransactions(prev => ({ ...prev, withdraw: { status: 'success', hash: receipt.transactionReceipts[0].transactionHash } }))
    onSuccess?.('withdraw', receipt)
    refetchPoolDetails()
    refetchUserBalance()
    refetchPools()
  }

  const handleWithdrawError = (error: any) => {
    setTransactions(prev => ({ ...prev, withdraw: { status: 'error' } }))
    onError?.(error)
  }

  const resetTransactions = () => {
    setTransactions({})
  }

  if (!mounted) {
    return null
  }

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
    <Web3ErrorBoundary>
      <div className="card-glass animate-bounce-in" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-6">Start Lending</h3>

        <div className="space-y-6">
          {/* Action Selector */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setCurrentAction('fund')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                currentAction === 'fund'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Fund Pool
            </button>
            <button
              onClick={() => setCurrentAction('withdraw')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                currentAction === 'withdraw'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Withdraw
            </button>
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
              <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                <div className="space-y-1 text-xs" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Category:</span>
                    <span className="font-bold text-blue-600">{selectedPool.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Risk Level:</span>
                    <span className="font-bold text-blue-600">{selectedPool.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">APY:</span>
                    <span className="font-bold text-blue-600">{selectedPool.metrics.supplyAPY.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">TVL:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(parseFloat(selectedPool.metrics.tvl) / Math.pow(10, 6))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Content Based on Action */}
          {currentAction === 'fund' && (
            <>
              {/* Fund Amount */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  Fund Amount (USDC)
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

              {/* Earnings Projection */}
              {selectedPool && (
                <div className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-2xl p-4 border border-green-200/50">
                  <h4
                    className="text-sm font-semibold text-green-900 mb-3"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Earnings Projection
                  </h4>
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

              <FundPoolTransaction
                params={{
                  poolAddress: selectedPool?.id as Address,
                  loanToken: selectedPool?.loanAsset?.address as Address,
                  amount: depositAmount
                }}
                onSuccess={handleFundSuccess}
                onError={handleFundError}
                disabled={!canFund}
                buttonText={`Fund ${formatCurrency(depositAmount)}`}
                loadingText="Funding Pool..."
                className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  canFund
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              />
            </>
          )}

          {currentAction === 'withdraw' && (
            <>
              {/* User Balance Display */}
              {userBalanceFormatted > 0 && (
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                  <h4
                    className="text-sm font-semibold text-purple-900 mb-3"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Your Investment
                  </h4>
                  <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    <div className="flex justify-between">
                      <span className="text-purple-800">Current Balance:</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(userBalanceFormatted)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-800">Pool APY:</span>
                      <span className="font-bold text-purple-600">
                        {selectedPool?.metrics.supplyAPY.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdraw Amount */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  Withdraw Amount (USDC)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className={`w-full px-4 py-3 bg-white/50 rounded-2xl border-2 ${
                    canWithdraw ? 'border-green-200 focus:border-green-400' : 'border-red-200 focus:border-red-400'
                  } focus:outline-none`}
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  min="1"
                  max={userBalanceFormatted}
                  step="1"
                />
                {!canWithdraw && withdrawAmount > userBalanceFormatted && (
                  <p className="text-xs text-red-600 mt-2">
                    Maximum available: {formatCurrency(userBalanceFormatted)}
                  </p>
                )}
              </div>

              {userBalanceFormatted === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    You don't have any funds in this pool to withdraw.
                  </p>
                </div>
              ) : (
                <WithdrawFromPoolTransaction
                  params={{
                    poolAddress: selectedPool?.id as Address,
                    amount: withdrawAmount
                  }}
                  onSuccess={handleWithdrawSuccess}
                  onError={handleWithdrawError}
                  disabled={!canWithdraw}
                  buttonText={`Withdraw ${formatCurrency(withdrawAmount)}`}
                  loadingText="Withdrawing..."
                  className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    canWithdraw
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                />
              )}
            </>
          )}

          {/* Transaction Status Display */}
          {(transactions.fund?.status === 'success' || transactions.withdraw?.status === 'success') && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 font-medium">
                🎉 Transaction completed successfully!
              </p>
              <button
                onClick={resetTransactions}
                className="mt-2 w-full px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                New Transaction
              </button>
            </div>
          )}

          {/* Important Terms */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <h4
              className="text-xs font-semibold text-blue-900 mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Important Terms
            </h4>
            <ul
              className="text-xs text-blue-800 space-y-1"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {currentAction === 'fund' && (
                <>
                  <li>• You can withdraw anytime (subject to pool liquidity)</li>
                  <li>• Interest compounds daily at the fixed rate</li>
                  <li>• Your funds are protected by borrower collateral</li>
                  <li>• Minimum deposit amount is 100 USDC</li>
                </>
              )}
              {currentAction === 'withdraw' && (
                <>
                  <li>• Withdrawals are subject to available pool liquidity</li>
                  <li>• You'll receive principal plus accrued interest</li>
                  <li>• Withdrawal doesn't affect other lenders' positions</li>
                  <li>• Interest stops accruing once withdrawn</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Web3ErrorBoundary>
  )
}