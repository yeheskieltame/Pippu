"use client"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { type Address } from "viem"
import { parseUnits } from "viem"
import { ERC20_ABI } from "@/lib/abi/erc20"
import { LIQUIDITY_POOL_ABI } from "@/lib/abi/liquidity-pool"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { formatCurrency } from "@/lib/utils/format"
import { Button } from "@/components/ui/button"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  poolAddress: Address
  collateralToken: Address
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

export function DepositModal({ isOpen, onClose, poolAddress, collateralToken, onSuccess, onError }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [needsApproval, setNeedsApproval] = useState(true)

  const { writeContract: approveToken } = useWriteContract()
  const { writeContract: depositCollateral } = useWriteContract()

  const { isLoading: isApprovalLoading } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when approve transaction is submitted
  })

  const { isLoading: isDepositLoading } = useWaitForTransactionReceipt({
    hash: undefined, // Will be set when deposit transaction is submitted
  })

  if (!isOpen) return null

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    try {
      setIsApproving(true)
      const amountInWei = parseUnits(amount, 18)

      // Approve token to the POOL contract, not factory
      await approveToken({
        address: collateralToken,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [poolAddress, amountInWei], // ← Pool address, NOT factory
      })

      setNeedsApproval(false)
    } catch (error) {
      console.error('Approval error:', error)
      onError?.(error as Error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    try {
      setIsDepositing(true)
      const amountInWei = parseUnits(amount, 18)

      // Call depositCollateral on the POOL contract, not factory
      await depositCollateral({
        address: poolAddress, // ← Pool address, NOT factory
        abi: LIQUIDITY_POOL_ABI,
        functionName: 'depositCollateral', // ← Function in pool contract
        args: [amountInWei], // ← Only amount, no pool address needed
      })

      onSuccess?.('deposit-tx-hash') // Replace with actual tx hash
      onClose()
    } catch (error) {
      console.error('Deposit error:', error)
      onError?.(error as Error)
    } finally {
      setIsDepositing(false)
    }
  }

  const handleClose = () => {
    if (!isApproving && !isDepositing) {
      setAmount("")
      setNeedsApproval(true)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-pink-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            💝 Deposit Collateral
          </h2>
          <button
            onClick={handleClose}
            disabled={isApproving || isDepositing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Amount to Deposit
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:outline-none text-lg font-semibold"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                disabled={isApproving || isDepositing}
                min="0"
                step="0.001"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">ETH</span>
              </div>
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Value: ~{formatCurrency(parseFloat(amount) * 3835.61)}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200">
            <h3 className="font-semibold text-sm text-pink-900 mb-2" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Deposit Information
            </h3>
            <ul className="text-xs text-pink-800 space-y-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              <li>• Your ETH will be locked as collateral</li>
              <li>• This increases your borrowing power by up to 70% of collateral value</li>
              <li>• Collateral will be returned when loan is fully repaid</li>
              <li>• You can deposit additional collateral at any time</li>
            </ul>
          </div>

          {/* Pool Address Display */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Pool Address:</p>
            <p className="text-xs font-mono text-gray-800 break-all">
              {poolAddress}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {needsApproval ? (
              <Button
                onClick={handleApprove}
                disabled={!amount || parseFloat(amount) <= 0 || isApproving}
                className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                {isApproving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Approving...</span>
                  </div>
                ) : (
                  "1️⃣ Approve ETH"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0 || isDepositing}
                className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              >
                {isDepositing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Depositing...</span>
                  </div>
                ) : (
                  "2️⃣ Deposit Collateral"
                )}
              </Button>
            )}

            <Button
              onClick={handleClose}
              disabled={isApproving || isDepositing}
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