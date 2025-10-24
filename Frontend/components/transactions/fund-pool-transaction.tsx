"use client"

import { BaseTransaction, type BaseTransactionProps } from "./transaction-wrapper"
import { memo } from "react"
import { type Address, parseUnits } from "viem"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"

export interface FundPoolParams {
  poolAddress: Address
  loanToken: Address
  amount: number
}

export interface FundPoolTransactionProps
  extends Omit<BaseTransactionProps, 'functionName' | 'args'> {
  params: FundPoolParams
}

const FundPoolTransaction = memo(function FundPoolTransaction({
  params,
  onSuccess,
  onError,
  onStatusChange,
  disabled = false,
  buttonText = "Fund Pool",
  loadingText = "Funding Pool...",
  className = "btn-primary w-full"
}: FundPoolTransactionProps) {
  // Validate params
  if (!params.poolAddress || !params.loanToken || !params.amount) {
    return (
      <button className={`${className} bg-gray-300 text-gray-500 cursor-not-allowed`} disabled>
        Invalid Parameters
      </button>
    )
  }

  // Get token decimals for proper amount conversion
  const getTokenDecimals = (tokenAddress: Address): number => {
    if (tokenAddress === MOCK_TOKEN_CONFIG.mWETH) return 18
    if (tokenAddress === MOCK_TOKEN_CONFIG.mUSDC) return 6
    if (tokenAddress === MOCK_TOKEN_CONFIG.mDAI) return 18
    return 18
  }

  // Convert amount to proper contract units
  const decimals = getTokenDecimals(params.loanToken)
  const amountWei = parseUnits(params.amount.toString(), decimals)

  // Prepare transaction arguments
  const args = [params.poolAddress, amountWei]

  const handleSuccess = (receipt: any) => {
    console.log('Pool funded successfully:', receipt)
    onSuccess?.(receipt)
  }

  const handleError = (error: any) => {
    console.error('Fund pool failed:', error)
    onError?.(error)
  }

  return (
    <BaseTransaction
      functionName="fundPool"
      args={args}
      onSuccess={handleSuccess}
      onError={handleError}
      onStatusChange={onStatusChange}
      disabled={disabled}
      buttonText={buttonText}
      loadingText={loadingText}
      className={className}
    />
  )
})

export { FundPoolTransaction }