"use client"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { type Address } from "viem"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { formatCurrency, formatPercent } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"
import { parseUnits } from "viem"

interface BorrowModalProps {
  isOpen: boolean
  onClose: () => void
  poolAddress: Address
  availableToBorrow: number
  interestRate: number
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

export function BorrowModal({ isOpen, onClose, poolAddress, availableToBorrow, interestRate, onSuccess, onError }: BorrowModalProps) {
  const [amount, setAmount] = useState("")
  const [isBorrowing, setIsBorrowing] = useState(false)

  const { writeContract: disburseLoan } = useWriteContract()

  const { isLoading: isBorrowLoading } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when borrow transaction is submitted
  })

  if (!isOpen) return null

  // Calculate interest for 30 days
  const calculateInterest = (principal: number, rate: number, days: number = 30) => {
    const dailyRate = rate / 100 / 365
    return principal * dailyRate * days
  }

  const borrowAmount = parseFloat(amount) || 0
  const interest = calculateInterest(borrowAmount, interestRate)
  const totalToRepay = borrowAmount + interest

  // Parse amount to 6 decimal places for USDC
  const getAmountInWei = () => {
    if (!amount || parseFloat(amount) <= 0) return BigInt(0)
    return parseUnits(amount, 6) // USDC uses 6 decimals
  }

  const handleBorrow = async () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableToBorrow) return

    try {
      setIsBorrowing(true)

      await disburseLoan({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'disburseLoan',
        args: [poolAddress],
      })

      onSuccess?.('borrow-tx-hash') // Replace with actual tx hash
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
      setAmount("")
      onClose()
    }
  }

  const isValidAmount = borrowAmount > 0 && borrowAmount <= availableToBorrow

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-purple-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            💰 Borrow Funds
          </h2>
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
          {/* Available to Borrow */}
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-purple-700" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                Available to Borrow
              </span>
              <span className="text-lg font-bold text-purple-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                {formatCurrency(availableToBorrow)}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Borrow Amount (USDC)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none text-lg font-semibold"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                disabled={isBorrowing}
                min="0"
                max={availableToBorrow}
                step="0.01"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">USDC</span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex space-x-2 mt-3">
              {[25, 50, 75, 100].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setAmount((availableToBorrow * percent / 100).toString())}
                  disabled={isBorrowing}
                  className="flex-1 py-2 px-3 bg-gray-100 hover:bg-purple-100 rounded-xl text-xs font-semibold text-gray-600 hover:text-purple-600 transition-colors disabled:opacity-50"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Validation Message */}
            {amount && !isValidAmount && (
              <p className="text-sm text-red-600 mt-2">
                {borrowAmount > availableToBorrow
                  ? `Maximum available: ${formatCurrency(availableToBorrow)}`
                  : "Please enter a valid amount"}
              </p>
            )}
          </div>

          {/* Loan Summary */}
          {borrowAmount > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200">
              <h3 className="font-semibold text-sm text-purple-900 mb-3" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                Loan Summary
              </h3>
              <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                <div className="flex justify-between">
                  <span className="text-purple-800">Borrow Amount:</span>
                  <span className="font-bold text-purple-700">
                    {formatCurrency(borrowAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-800">Interest Rate:</span>
                  <span className="font-bold text-purple-700">
                    {formatPercent(interestRate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-800">Period:</span>
                  <span className="font-bold text-purple-700">30 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-800">Est. Interest:</span>
                  <span className="font-bold text-purple-700">
                    +{formatCurrency(interest)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-purple-300 pt-2 mt-2">
                  <span className="text-purple-900">Total Repayment:</span>
                  <span className="text-purple-600">
                    {formatCurrency(totalToRepay)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Important Terms */}
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
            <h3 className="font-semibold text-sm text-yellow-900 mb-2" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              ⚠️ Important Terms
            </h3>
            <ul className="text-xs text-yellow-800 space-y-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <li>• You must repay the loan amount plus interest before due date</li>
              <li>• Your ETH collateral will be locked until full repayment</li>
              <li>• Late payments may result in additional interest fees</li>
              <li>• Default may lead to collateral liquidation</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleBorrow}
              disabled={!isValidAmount || isBorrowing}
              className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {isBorrowing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Borrowing...</span>
                </div>
              ) : (
                `Borrow ${formatCurrency(borrowAmount)}`
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