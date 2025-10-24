"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useReadContract } from "wagmi"
import { type Address } from "viem"
import { LIQUIDITY_POOL_ABI } from "@/lib/abi/liquidity-pool"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { formatCurrency, formatPercent } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, Calculator, Shield, AlertTriangle } from "lucide-react"

interface BorrowModalProps {
  isOpen: boolean
  onClose: () => void
  poolAddress: Address
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

export function BorrowModal({ isOpen, onClose, poolAddress, onSuccess, onError }: BorrowModalProps) {
  const [isBorrowing, setIsBorrowing] = useState(false)
  const [isCalculating, setIsCalculating] = useState(true)

  const { writeContract: disburseLoan } = useWriteContract()
  const { isLoading: isBorrowLoading } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when borrow transaction is submitted
  })

  // Read pool info to show available amounts
  const { data: poolInfo } = useReadContract({
    address: poolAddress,
    abi: LIQUIDITY_POOL_ABI,
    functionName: 'getPoolInfo',
  })

  // Extract data from poolInfo
  const collateralAsset = poolInfo?.[0]
  const loanAsset = poolInfo?.[1]
  const totalCollateral = poolInfo?.[2]
  const totalLiquidity = poolInfo?.[3]
  const totalLoaned = poolInfo?.[4]
  const interestRate = poolInfo?.[5]
  const isLoanActive = poolInfo?.[6]
  const loanAmount = poolInfo?.[7]

  // Calculate max loan amount (70% LTV)
  const calculateMaxLoan = () => {
    if (!totalCollateral || !totalLiquidity) return { maxLoan: 0, maxLoanValue: 0, availableLiquidity: 0 }

    const collateralValue = totalCollateral // Assuming ETH, value in wei
    const maxLoanByLTV = (collateralValue * BigInt(7000)) / BigInt(10000) // 70% LTV
    const availableLiquidity = totalLiquidity

    return {
      maxLoan: Math.min(Number(maxLoanByLTV), Number(availableLiquidity)),
      maxLoanValue: Number(maxLoanByLTV),
      availableLiquidity: Number(availableLiquidity)
    }
  }

  const loanData = calculateMaxLoan()

  useEffect(() => {
    if (totalCollateral && totalLiquidity && interestRate) {
      setIsCalculating(false)
    }
  }, [totalCollateral, totalLiquidity, interestRate])

  const handleBorrow = async () => {
    if (isLoanActive || loanData.maxLoan <= 0) return

    try {
      setIsBorrowing(true)

      // The smart contract handles the maximum amount calculation automatically
      // We don't need to pass any parameters - it uses the maxLoanAmount we calculated
      await disburseLoan({
        address: poolAddress, // ✅ Pool address, not factory
        abi: LIQUIDITY_POOL_ABI, // ✅ Pool ABI
        functionName: 'disburseLoan', // ✅ Function in pool contract
        args: [], // ✅ No parameters needed - contract calculates max automatically
      })

      onSuccess?.('borrow-tx-hash')
      onClose()
    } catch (error) {
      console.error('Borrow error:', error)
      onError?.(error as Error)
    } finally {
      setIsBorrowing(false)
    }
  }

  const handleClose = () => {
    if (!isBorrowing) {
      onClose()
    }
  }

  if (!isOpen) return null

  const isBorrowDisabled = isLoanActive || loanData.maxLoan <= 0 || isBorrowing || isCalculating

  // Calculate interest for display (assuming 30-day loan for demo)
  const calculateInterest = (principal: number, rate: number) => {
    const dailyRate = rate / 100 / 365
    return principal * dailyRate * 30 // 30 days assumption
  }

  const interest = calculateInterest(loanData.maxLoan, Number(interestRate || 0))

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-purple-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Borrow Funds
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isBorrowing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Status Alert */}
          {isLoanActive ? (
            <Alert className="border-orange-200 bg-orange-50">
              <Shield className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                You already have an active loan. Please repay it before borrowing again.
              </AlertDescription>
            </Alert>
          ) : loanData.maxLoan <= 0 ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Not enough liquidity available. Please add more liquidity to the pool.
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Loan Calculator */}
          {!isCalculating && !isLoanActive && loanData.maxLoan > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="font-semibold text-sm text-purple-900 mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                <Calculator className="w-4 h-4" />
                Loan Calculator
              </h3>

              <div className="space-y-3">
                <div className="bg-white/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-700">Maximum Amount</span>
                    <span className="text-lg font-bold text-purple-900">
                      {formatCurrency(loanData.maxLoan)}
                    </span>
                  </div>
                  <div className="text-xs text-purple-600">
                    Based on 70% LTV of your collateral
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/80 rounded-xl p-3">
                    <div className="text-xs text-purple-600 mb-1">Interest Rate</div>
                    <div className="text-sm font-bold text-purple-900">
                      {formatPercent(Number(interestRate || 0))}
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3">
                    <div className="text-xs text-purple-600 mb-1">Duration</div>
                    <div className="text-sm font-bold text-purple-900">
                      30 days (fixed)
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-700">Est. Interest</span>
                    <span className="text-sm font-bold text-orange-600">
                      +{formatCurrency(interest)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-base">
                    <span className="text-purple-900">Total Repayment</span>
                    <span className="text-purple-600">
                      {formatCurrency(loanData.maxLoan + interest)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pool Address Display */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Pool Address:</p>
            <p className="text-xs font-mono text-gray-800 break-all">
              {poolAddress}
            </p>
          </div>

          {/* Important Terms */}
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
            <h3 className="font-semibold text-sm text-yellow-900 mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <AlertTriangle className="w-4 h-4" />
              Important Terms
            </h3>
            <ul className="text-xs text-yellow-800 space-y-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <li>• Maximum loan is 70% of your collateral value</li>
              <li>• You must repay the loan amount plus interest</li>
              <li>• Your ETH collateral will be locked until repayment</li>
              <li>• Default may result in collateral liquidation</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleBorrow}
              disabled={isBorrowDisabled}
              className="w-full py-4 rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {isBorrowing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Borrowing...</span>
                </div>
              ) : isCalculating ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Borrow</span>
                  <span className="font-bold text-lg">{formatCurrency(loanData.maxLoan)}</span>
                </div>
              )}
            </Button>

            <Button
              onClick={handleClose}
              disabled={isBorrowing}
              variant="outline"
              className="w-full py-3 rounded-2xl font-semibold border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}