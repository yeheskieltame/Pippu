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

      // Add better validation before calling contract
      console.log('Borrow attempt:', {
        poolAddress,
        isLoanActive,
        maxLoan: loanData.maxLoan,
        totalCollateral,
        totalLiquidity,
        interestRate
      })

      // The smart contract handles the maximum amount calculation automatically
      // We don't need to pass any parameters - it uses the maxLoanAmount we calculated
      await disburseLoan({
        address: poolAddress, // ✅ Pool address, not factory
        abi: LIQUIDITY_POOL_ABI as unknown as any[], // ✅ Pool ABI with proper typing
        functionName: 'disburseLoan', // ✅ Function in pool contract
        args: [], // ✅ No parameters needed - contract calculates max automatically
        gas: BigInt(300000) // Add gas limit to prevent estimation issues
      })

      onSuccess?.('borrow-tx-hash')
      onClose()
    } catch (error: any) {
      console.error('Borrow error:', error)

      // Provide better error messages
      if (error.message?.includes('Loan already active')) {
        onError?.(new Error('You already have an active loan'))
      } else if (error.message?.includes('No collateral')) {
        onError?.(new Error('No collateral found in this pool'))
      } else if (error.message?.includes('Insufficient liquidity')) {
        onError?.(new Error('Not enough liquidity available to borrow'))
      } else if (error.message?.includes('onlyBorrower')) {
        onError?.(new Error('Only the designated borrower can take loans'))
      } else {
        onError?.(new Error(error.message || 'Failed to process borrow transaction'))
      }
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

  // Debug info - remove in production
  console.log('Borrow Modal Debug:', {
    poolAddress,
    poolInfo: poolInfo ? 'loaded' : 'loading',
    totalCollateral: totalCollateral?.toString(),
    totalLiquidity: totalLiquidity?.toString(),
    interestRate: interestRate?.toString(),
    isLoanActive,
    maxLoan: loanData.maxLoan,
    isCalculating,
    isBorrowDisabled
  })

  // Calculate interest for display (assuming 30-day loan for demo)
  const calculateInterest = (principal: number, rate: number) => {
    const dailyRate = rate / 100 / 365
    return principal * dailyRate * 30 // 30 days assumption
  }

  const interest = calculateInterest(loanData.maxLoan, Number(interestRate || 0))

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border-2 border-purple-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Borrow Funds
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isBorrowing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Status Alert */}
          {isCalculating ? (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">
                Calculating available loan amount...
              </AlertDescription>
            </Alert>
          ) : isLoanActive ? (
            <Alert className="border-orange-200 bg-orange-50">
              <Shield className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                You already have an active loan. Please repay it before borrowing again.
              </AlertDescription>
            </Alert>
          ) : loanData.maxLoan <= 0 ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {totalCollateral?.toString() === "0" ?
                  "No collateral found. Please deposit collateral first." :
                  "Not enough liquidity available. Please add more liquidity to the pool."
                }
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-200 bg-green-50">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Ready to borrow! You can borrow up to {formatCurrency(loanData.maxLoan)}.
              </AlertDescription>
            </Alert>
          )}

          {/* Loan Calculator */}
          {!isCalculating && !isLoanActive && loanData.maxLoan > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-200">
              <h3 className="font-semibold text-xs text-purple-900 mb-2 flex items-center gap-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                <Calculator className="w-3 h-3" />
                Loan Calculator
              </h3>

              <div className="space-y-2">
                <div className="bg-white/80 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-purple-700">Max Amount</span>
                    <span className="text-sm font-bold text-purple-900">
                      {formatCurrency(loanData.maxLoan)}
                    </span>
                  </div>
                  <div className="text-xs text-purple-600">
                    70% LTV of collateral
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/80 rounded-lg p-2">
                    <div className="text-xs text-purple-600 mb-1">Interest</div>
                    <div className="text-xs font-bold text-purple-900">
                      {formatPercent(Number(interestRate || 0))}
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2">
                    <div className="text-xs text-purple-600 mb-1">Duration</div>
                    <div className="text-xs font-bold text-purple-900">
                      30 days
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 rounded-lg p-2 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-700">Total Repayment</span>
                    <span className="text-xs font-bold text-purple-600">
                      {formatCurrency(loanData.maxLoan + interest)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pool Address Display */}
          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Pool:</p>
            <p className="text-xs font-mono text-gray-800 truncate">
              {poolAddress.slice(0, 8)}...{poolAddress.slice(-6)}
            </p>
          </div>

          {/* Important Terms */}
          <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
            <h3 className="font-semibold text-xs text-yellow-900 mb-1 flex items-center gap-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <AlertTriangle className="w-3 h-3" />
              Terms
            </h3>
            <ul className="text-xs text-yellow-800 space-y-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <li>• 70% LTV max loan</li>
              <li>• Repay loan + interest</li>
              <li>• ETH locked until repayment</li>
              <li>• Default = liquidation</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleBorrow}
              disabled={isBorrowDisabled}
              className="w-full py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {isBorrowing ? (
                <div className="flex items-center justify-center space-x-1">
                  <Loader2 className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Borrowing...</span>
                </div>
              ) : isCalculating ? (
                <div className="flex items-center justify-center space-x-1">
                  <Loader2 className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-1">
                  <span>Borrow</span>
                  <span className="font-bold text-xs">{formatCurrency(loanData.maxLoan)}</span>
                </div>
              )}
            </Button>

            <Button
              onClick={handleClose}
              disabled={isBorrowing}
              variant="outline"
              className="w-full py-1 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
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