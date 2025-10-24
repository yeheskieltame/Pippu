"use client"

import { BaseTransaction, type BaseTransactionProps } from "./transaction-wrapper"
import { type Address, parseUnits } from "viem"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"

export interface WithdrawFromPoolParams {
  poolAddress: Address
  amount: number
}

export interface WithdrawFromPoolTransactionProps
  extends Omit<BaseTransactionProps, 'functionName' | 'args'> {
  params: WithdrawFromPoolParams
}

export function WithdrawFromPoolTransaction({
  params,
  onSuccess,
  onError,
  onStatusChange,
  disabled = false,
  buttonText = "Withdraw",
  loadingText = "Withdrawing...",
  className = "btn-primary w-full"
}: WithdrawFromPoolTransactionProps) {
  // Validate params
  if (!params.poolAddress || !params.amount) {
    return (
      <button className={`${className} bg-gray-300 text-gray-500 cursor-not-allowed`} disabled>
        Invalid Parameters
      </button>
    )
  }

  // For withdrawal, we typically use 6 decimals (USDC standard)
  // But we can make this flexible based on the pool's loan token
  const amountWei = parseUnits(params.amount.toString(), 6)

  // Prepare transaction arguments
  const args = [params.poolAddress, amountWei]

  const handleSuccess = (receipt: any) => {
    console.log('Withdrawal successful:', receipt)
    onSuccess?.(receipt)
  }

  const handleError = (error: any) => {
    console.error('Withdrawal failed:', error)
    onError?.(error)
  }

  return (
    <BaseTransaction
      functionName="withdrawFromPool"
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
}