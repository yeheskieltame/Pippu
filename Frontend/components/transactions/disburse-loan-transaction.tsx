"use client"

import { BaseTransaction, type BaseTransactionProps } from "./transaction-wrapper"
import { type Address } from "viem"

export interface DisburseLoanParams {
  poolAddress: Address
}

export interface DisburseLoanTransactionProps
  extends Omit<BaseTransactionProps, 'functionName' | 'args'> {
  params: DisburseLoanParams
}

export function DisburseLoanTransaction({
  params,
  onSuccess,
  onError,
  onStatusChange,
  disabled = false,
  buttonText = "Disburse Loan",
  loadingText = "Disbursing Loan...",
  className = "btn-primary w-full"
}: DisburseLoanTransactionProps) {
  // Validate params
  if (!params.poolAddress) {
    return (
      <button className={`${className} bg-gray-300 text-gray-500 cursor-not-allowed`} disabled>
        Invalid Pool Address
      </button>
    )
  }

  // Prepare transaction arguments
  const args = [params.poolAddress]

  const handleSuccess = (receipt: any) => {
    console.log('Loan disbursed successfully:', receipt)
    onSuccess?.(receipt)
  }

  const handleError = (error: any) => {
    console.error('Disburse loan failed:', error)
    onError?.(error)
  }

  return (
    <BaseTransaction
      functionName="disburseLoan"
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