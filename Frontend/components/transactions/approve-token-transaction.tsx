"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { BaseTransaction, type BaseTransactionProps } from "./transaction-wrapper"
import { type Address, parseUnits } from "viem"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"

export interface ApproveTokenParams {
  tokenAddress: Address
  spenderAddress: Address
  amount?: number
  isUnlimited?: boolean
}

export interface ApproveTokenTransactionProps
  extends Omit<BaseTransactionProps, 'functionName' | 'args'> {
  params: ApproveTokenParams
}

export function ApproveTokenTransaction({
  params,
  onSuccess,
  onError,
  disabled = false,
  buttonText = "Approve USDC",
  loadingText = "Approving...",
  className = "btn-primary w-full"
}: ApproveTokenTransactionProps) {
  const { address } = useAccount()
  const [showApprove, setShowApprove] = useState(true)

  // Get token decimals for proper amount conversion
  const getTokenDecimals = (tokenAddress: Address): number => {
    if (tokenAddress === MOCK_TOKEN_CONFIG.mWETH) return 18
    if (tokenAddress === MOCK_TOKEN_CONFIG.mUSDC) return 6
    if (tokenAddress === MOCK_TOKEN_CONFIG.mDAI) return 18
    return 18
  }

  // Convert amount to proper contract units
  const decimals = getTokenDecimals(params.tokenAddress)
  const amountWei = params.isUnlimited
    ? BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935") // 2^256 - 1
    : parseUnits((params.amount || 0).toString(), decimals)

  // Prepare transaction arguments
  const args = [params.spenderAddress, amountWei]

  const handleSuccess = (receipt: any) => {
    console.log('Token approved successfully:', receipt)
    setShowApprove(false) // Hide approve button after success
    onSuccess?.(receipt)
  }

  const handleError = (error: any) => {
    console.error('Token approval failed:', error)
    onError?.(error)
  }

  if (!address) {
    return (
      <button className={`${className} bg-gray-300 text-gray-500 cursor-not-allowed`} disabled>
        Connect Wallet
      </button>
    )
  }

  // If already approved, show success message
  if (!showApprove) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-green-800 text-center">
          ✅ Token approved for spending
        </p>
      </div>
    )
  }

  return (
    <BaseTransaction
      functionName="approve"
      args={args}
      tokenAddress={params.tokenAddress}
      onSuccess={handleSuccess}
      onError={handleError}
      disabled={disabled}
      buttonText={buttonText}
      loadingText={loadingText}
      className={`${className} bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full py-3 rounded-2xl font-semibold transition-all duration-300`}
    />
  )
}