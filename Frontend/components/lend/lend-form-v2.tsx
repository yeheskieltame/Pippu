"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAccount } from "wagmi"
import { usePoolsFromContract, usePoolDetails } from "@/lib/hooks/use-pool-contract"
import { formatCurrency, formatPercent } from "@/lib/utils/format"
import { type Address } from "viem"
import { useReadContract } from "wagmi"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"
import {
  FundPoolTransaction,
  WithdrawFromPoolTransaction,
  ApproveTokenTransaction
} from "@/components/transactions"
import { Web3ErrorBoundary } from "@/components/common/web3-error-boundary"
import { TransactionSuccessModal } from "@/components/common/transaction-success-modal"

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
    approve?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
    fund?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
    withdraw?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
  }>({})

  // Success modal state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean
    type: 'approve' | 'fund' | 'withdraw'
    hash: string
    amount?: string
    poolName?: string
  }>({
    isOpen: false,
    type: 'approve',
    hash: ''
  })

  // Get pools data from contract
  const { pools, isLoading, error, refetch } = usePoolsFromContract()

  // Set default selected pool
  useEffect(() => {
    if (!selectedPoolId && pools.length > 0) {
      setSelectedPoolId(pools[0].id)
    }
  }, [pools])

  const selectedPool = pools.find(p => p.id === selectedPoolId)

  // Get pool details for selected pool
  const { poolDetails, poolInfo, isLoading: isLoadingDetails } = usePoolDetails(
    selectedPool?.poolAddress
  )

  // Get user balance in selected pool
  const { data: userBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getProviderBalance',
    args: selectedPool && address ? [selectedPool.poolAddress as Address, address] : undefined,
    query: {
      enabled: !!selectedPool?.poolAddress && !!address
    }
  })

  
  // Calculate earnings - memoized to prevent unnecessary recalculations
  const estimatedMonthlyEarnings = useMemo(() => {
    return selectedPool
      ? (depositAmount * selectedPool.metrics.supplyAPY / 100) / 12
      : 0
  }, [selectedPool, depositAmount])

  const userBalanceFormatted = useMemo(() => {
    return userBalance
      ? parseFloat(userBalance.toString()) / Math.pow(10, 6)
      : 0
  }, [userBalance])

  const canFund = useMemo(() => {
    return selectedPool &&
           depositAmount >= 100 &&
           !!selectedPool?.loanAsset?.address &&
           !!selectedPool?.id &&
           transactions.approve?.status === 'success'
  }, [selectedPool, depositAmount, transactions.approve?.status])

  const canWithdraw = useMemo(() => {
    return userBalanceFormatted > 0 && withdrawAmount <= userBalanceFormatted
  }, [userBalanceFormatted, withdrawAmount])

  // Transaction handlers
  const handleApproveSuccess = useCallback((receipt: any) => {
    const hash = receipt.transactionReceipts?.[0]?.transactionHash || ''
    setTransactions(prev => ({ ...prev, approve: { status: 'success', hash } }))
    onSuccess?.('approve', receipt)
    // Don't show modal for approve - only for fund/withdraw
  }, [onSuccess])

  const handleApproveError = useCallback((error: any) => {
    setTransactions(prev => ({ ...prev, approve: { status: 'error' } }))
    onError?.(error)
  }, [onError])

  const handleFundSuccess = useCallback((receipt: any) => {
    const hash = receipt.transactionReceipts?.[0]?.transactionHash || ''
    setTransactions(prev => ({ ...prev, fund: { status: 'success', hash } }))
    onSuccess?.('fund', receipt)

    // Show success modal instead of refetching
    setSuccessModal({
      isOpen: true,
      type: 'fund',
      hash,
      amount: depositAmount.toString(),
      poolName: selectedPool?.name || ''
    })
  }, [depositAmount, selectedPool?.name, onSuccess])

  const handleFundError = useCallback((error: any) => {
    setTransactions(prev => ({ ...prev, fund: { status: 'error' } }))
    onError?.(error)
  }, [onError])

  const handleWithdrawSuccess = useCallback((receipt: any) => {
    const hash = receipt.transactionReceipts?.[0]?.transactionHash || ''
    setTransactions(prev => ({ ...prev, withdraw: { status: 'success', hash } }))
    onSuccess?.('withdraw', receipt)

    // Show success modal instead of refetching
    setSuccessModal({
      isOpen: true,
      type: 'withdraw',
      hash,
      amount: withdrawAmount.toString(),
      poolName: selectedPool?.name || ''
    })
  }, [withdrawAmount, selectedPool?.name, onSuccess])

  const handleWithdrawError = useCallback((error: any) => {
    setTransactions(prev => ({ ...prev, withdraw: { status: 'error' } }))
    onError?.(error)
  }, [onError])

  const resetTransactions = useCallback(() => {
    setTransactions({})
  }, [])

  const handleCloseSuccessModal = useCallback(() => {
    setSuccessModal(prev => ({ ...prev, isOpen: false }))
    // Only refetch after modal is closed, not during transaction success
    refetch()
    resetTransactions()
  }, [refetch, resetTransactions])

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

  if (error) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Start Lending</h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-center">
            Error loading pools: {error}
          </p>
        </div>
      </div>
    )
  }

  if (pools.length === 0) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Start Lending</h3>
        <p className="text-center text-neutral-600">No pools available for lending at the moment.</p>
        <p className="text-center text-sm text-neutral-500 mt-2">
          Make sure you're connected to Base Sepolia testnet and the contract is deployed.
        </p>
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
                    <span className="text-blue-800">Interest Rate:</span>
                    <span className="font-bold text-blue-600">{selectedPool.terms.interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">TVL:</span>
                    <span className="font-bold text-blue-600">
                      {poolInfo?.tvl
                        ? formatCurrency(parseFloat(poolInfo.tvl.toString()) / Math.pow(10, 6))
                        : formatCurrency(parseFloat(selectedPool.metrics.tvl) / Math.pow(10, 6))
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Status:</span>
                    <span className={`font-bold ${selectedPool.status.active ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedPool.status.active ? 'Active' : 'Inactive'}
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

              {/* Approve Step */}
              <div className="space-y-3">
                {/* Only render ApproveTokenTransaction if we have valid addresses */}
                {selectedPool?.loanAsset?.address && selectedPool?.poolAddress ? (
                  <ApproveTokenTransaction
                    key={`approve-${selectedPool.poolAddress}`}
                    params={{
                      tokenAddress: selectedPool.loanAsset.address,
                      spenderAddress: selectedPool.poolAddress, // Approve to the pool address
                      amount: depositAmount,
                      isUnlimited: true // Approve unlimited amount for convenience
                    }}
                    onSuccess={handleApproveSuccess}
                    onError={handleApproveError}
                    buttonText="Approve USDC"
                    loadingText="Approving USDC..."
                    className="w-full py-3 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  />
                ) : (
                  <button
                    className="w-full py-3 rounded-2xl font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                    disabled
                  >
                    Select a pool to approve USDC
                  </button>
                )}

                {/* Fund Pool - Only show after approve succeeds */}
                {transactions.approve?.status === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                    <p className="text-green-800 text-center text-sm">
                      ✅ USDC approved! You can now fund the pool.
                    </p>
                    {selectedPool?.poolAddress && (
                      <p className="text-green-600 text-center text-xs mt-1">
                        Pool {selectedPool.poolAddress.slice(0, 8)}...{selectedPool.poolAddress.slice(-6)} can now spend your USDC
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Fund Pool Transaction */}
              {transactions.approve?.status === 'success' && selectedPool?.poolAddress && selectedPool?.loanAsset?.address && (
                <FundPoolTransaction
                  key={`fund-${selectedPool.poolAddress}-${depositAmount}`}
                  params={{
                    poolAddress: selectedPool.poolAddress,
                    loanToken: selectedPool.loanAsset.address,
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
              )}

              {/* Show info message when not yet approved */}
              {transactions.approve?.status !== 'success' && selectedPool?.poolAddress && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-blue-800 text-center text-sm">
                    📝 Approve USDC to spend from your wallet to pool: {selectedPool.poolAddress.slice(0, 8)}...{selectedPool.poolAddress.slice(-6)}
                  </p>
                  <p className="text-blue-600 text-center text-xs mt-1">
                    This allows the pool to transfer your USDC for lending
                  </p>
                </div>
              )}
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
              ) : selectedPool?.poolAddress ? (
                <WithdrawFromPoolTransaction
                  key={`withdraw-${selectedPool.poolAddress}-${withdrawAmount}`}
                  params={{
                    poolAddress: selectedPool.poolAddress,
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
              ) : (
                <button className="w-full py-3 rounded-2xl font-semibold bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                  Select a pool to withdraw
                </button>
              )}
            </>
          )}

          {/* Transaction Status Display */}
          {(transactions.approve?.status === 'success' || transactions.fund?.status === 'success' || transactions.withdraw?.status === 'success') && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 font-medium">
                🎉 {transactions.approve?.status === 'success' && 'USDC approved successfully for pool spending!'}
                {transactions.fund?.status === 'success' && 'Pool funded successfully!'}
                {transactions.withdraw?.status === 'success' && 'Withdrawal completed successfully!'}
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

      {/* Success Modal */}
      <TransactionSuccessModal
        isOpen={successModal.isOpen}
        onClose={handleCloseSuccessModal}
        transactionType={successModal.type}
        transactionHash={successModal.hash}
        amount={successModal.amount}
        poolName={successModal.poolName}
      />
    </Web3ErrorBoundary>
  )
}