"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { usePools } from "@/lib/hooks/use-data"
import { formatCurrency, formatPercent } from "@/lib/utils/format"
import { useReadContract } from "wagmi"
import { type Address } from "viem"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import {
  DepositCollateralTransaction,
  DisburseLoanTransaction,
  RepayLoanTransaction
} from "@/components/transactions"
import { Web3ErrorBoundary } from "@/components/common/web3-error-boundary"

interface BorrowFormV2Props {
  onSuccess?: (action: string, data: any) => void
  onError?: (error: Error) => void
}

export function BorrowFormV2({ onSuccess, onError }: BorrowFormV2Props) {
  const { isConnected, address } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form states
  const [borrowAmount, setBorrowAmount] = useState(500)
  const [selectedPoolId, setSelectedPoolId] = useState("")
  const [depositAmount, setDepositAmount] = useState(1) // For additional collateral
  const [currentAction, setCurrentAction] = useState<'borrow' | 'repay' | 'deposit'>('borrow')

  // Transaction states
  const [transactions, setTransactions] = useState<{
    deposit?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
    disburse?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
    repay?: { status: 'idle' | 'pending' | 'success' | 'error'; hash?: string }
  }>({})

  // Get pools data
  const { data: pools = [], isLoading } = usePools()

  // Filter pools that belong to current user
  const userPools = pools.filter(pool =>
    pool.borrower === address || pool.status.active
  )

  // Set default selected pool
  useEffect(() => {
    if (!selectedPoolId && userPools.length > 0) {
      setSelectedPoolId(userPools[0].id)
    }
  }, [userPools, selectedPoolId])

  const selectedPool = userPools.find(pool => pool.id === selectedPoolId)

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

  // ETH price assumption for MVP
  const ETH_PRICE = 3835.61
  const MAX_LTV = 0.7

  // Calculate borrowing power for selected pool
  const getPoolBorrowingPower = (pool: any) => {
    if (!pool || !poolDetails) return { maxBorrow: 0, available: 0, collateralValue: 0 }

    const totalCollateral = parseFloat((poolDetails[2] || '0n').toString())
    const totalLiquidity = parseFloat((poolDetails[3] || '0n').toString())
    const totalLoaned = parseFloat((poolDetails[4] || '0n').toString())

    const collateralValue = (totalCollateral / Math.pow(10, 18)) * ETH_PRICE
    const maxBorrow = collateralValue * MAX_LTV

    const availableLiquidity = totalLiquidity / Math.pow(10, 6)
    const borrowCapacity = maxBorrow - (totalLoaned / Math.pow(10, 6))
    const available = Math.min(availableLiquidity, borrowCapacity)

    return { maxBorrow, available, collateralValue }
  }

  const borrowingPower = selectedPool ? getPoolBorrowingPower(selectedPool) : { maxBorrow: 0, available: 0, collateralValue: 0 }
  const canBorrow = selectedPool && borrowAmount <= borrowingPower.available && borrowingPower.available > 0 && !!selectedPool?.id

  // Interest calculation
  const calculateInterest = (amount: number, rate: number, days: number) => {
    const dailyRate = rate / 100 / 365
    return amount * dailyRate * days
  }

  const loanDuration = selectedPool?.terms.loanDuration ? selectedPool.terms.loanDuration / (24 * 60 * 60) : 30
  const interestRate = poolDetails ? parseFloat((poolDetails[5] || '0n').toString()) / 100 : (selectedPool?.terms.interestRate || 12)
  const interest = calculateInterest(borrowAmount, interestRate, loanDuration)
  const totalToRepay = borrowAmount + interest

  // Transaction handlers
  const handleDepositSuccess = (receipt: any) => {
    setTransactions(prev => ({ ...prev, deposit: { status: 'success', hash: receipt.transactionReceipts[0].transactionHash } }))
    onSuccess?.('deposit', receipt)
    refetchPoolDetails()
  }

  const handleDepositError = (error: any) => {
    setTransactions(prev => ({ ...prev, deposit: { status: 'error' } }))
    onError?.(error)
  }

  const handleDisburseSuccess = (receipt: any) => {
    setTransactions(prev => ({ ...prev, disburse: { status: 'success', hash: receipt.transactionReceipts[0].transactionHash } }))
    onSuccess?.('disburse', receipt)
    refetchPoolDetails()
  }

  const handleDisburseError = (error: any) => {
    setTransactions(prev => ({ ...prev, disburse: { status: 'error' } }))
    onError?.(error)
  }

  const handleRepaySuccess = (receipt: any) => {
    setTransactions(prev => ({ ...prev, repay: { status: 'success', hash: receipt.transactionReceipts[0].transactionHash } }))
    onSuccess?.('repay', receipt)
    refetchPoolDetails()
  }

  const handleRepayError = (error: any) => {
    setTransactions(prev => ({ ...prev, repay: { status: 'error' } }))
    onError?.(error)
  }

  const resetTransactions = () => {
    setTransactions({})
  }

  if (!mounted) {
    return null
  }

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
    <Web3ErrorBoundary>
      <div className="card-glass animate-bounce-in" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-6">Borrow Funds</h3>

        <div className="space-y-6">
          {/* Action Selector */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setCurrentAction('borrow')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                currentAction === 'borrow'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Borrow
            </button>
            <button
              onClick={() => setCurrentAction('deposit')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                currentAction === 'deposit'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Deposit Collateral
            </button>
            <button
              onClick={() => setCurrentAction('repay')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                currentAction === 'repay'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Repay
            </button>
          </div>

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

          {/* Dynamic Content Based on Action */}
          {currentAction === 'borrow' && (
            <>
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
                        {formatPercent(interestRate)}
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

              {/* Borrow Action Buttons */}
              <div className="space-y-3">
                <DisburseLoanTransaction
                  params={{ poolAddress: selectedPool?.id as Address }}
                  onSuccess={handleDisburseSuccess}
                  onError={handleDisburseError}
                  disabled={!canBorrow || !selectedPool}
                  buttonText={`Borrow ${formatCurrency(borrowAmount)}`}
                  loadingText="Borrowing..."
                  className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    canBorrow
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                />
              </div>
            </>
          )}

          {currentAction === 'deposit' && (
            <>
              {/* Additional Collateral Amount */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  Additional Collateral (ETH)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  min="0.1"
                  step="0.1"
                />
                <p
                  className="text-xs text-neutral-600 mt-2"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  This will increase your borrowing power
                </p>
              </div>

              <DepositCollateralTransaction
                params={{
                  poolAddress: selectedPool?.id as Address,
                  collateralToken: selectedPool?.collateralAsset?.address as Address,
                  amount: depositAmount
                }}
                onSuccess={handleDepositSuccess}
                onError={handleDepositError}
                disabled={!selectedPool || depositAmount <= 0}
                buttonText={`Deposit ${depositAmount} ETH`}
                loadingText="Depositing..."
                className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              />
            </>
          )}

          {currentAction === 'repay' && (
            <>
              {/* Repayment Info */}
              {selectedPool && poolDetails && poolDetails[6] && (
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                  <h4
                    className="text-sm font-semibold text-orange-900 mb-3"
                    style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                  >
                    Loan Repayment
                  </h4>
                  <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    <div className="flex justify-between">
                      <span className="text-orange-800">Total to Repay:</span>
                      <span className="font-bold text-orange-600">
                        {formatCurrency(totalToRepay)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-800">Interest Rate:</span>
                      <span className="font-bold text-orange-600">
                        {formatPercent(interestRate)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(!selectedPool || !poolDetails || !poolDetails[6]) && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    No active loan to repay
                  </p>
                </div>
              )}

              <RepayLoanTransaction
                params={{
                  poolAddress: selectedPool?.id as Address,
                  amount: totalToRepay
                }}
                onSuccess={handleRepaySuccess}
                onError={handleRepayError}
                disabled={!selectedPool || !poolDetails || !poolDetails[6]}
                buttonText={`Repay ${formatCurrency(totalToRepay)}`}
                loadingText="Repaying..."
                className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  selectedPool && poolDetails && poolDetails[6]
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              />
            </>
          )}

          {/* Transaction Status Display */}
          {(transactions.deposit?.status === 'success' ||
            transactions.disburse?.status === 'success' ||
            transactions.repay?.status === 'success') && (
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
              {currentAction === 'borrow' && (
                <>
                  <li>• You must repay the loan amount plus interest before the due date</li>
                  <li>• Your ETH collateral will be locked until full repayment</li>
                  <li>• Late payments may result in additional interest fees</li>
                  <li>• Default may lead to collateral liquidation</li>
                </>
              )}
              {currentAction === 'deposit' && (
                <>
                  <li>• Additional collateral increases your borrowing power</li>
                  <li>• Collateral will be locked until loan is fully repaid</li>
                  <li>• You can deposit multiple times to increase collateral</li>
                </>
              )}
              {currentAction === 'repay' && (
                <>
                  <li>• Repayment includes principal plus accumulated interest</li>
                  <li>• Full repayment releases your collateral</li>
                  <li>• Early repayment may reduce total interest paid</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Web3ErrorBoundary>
  )
}