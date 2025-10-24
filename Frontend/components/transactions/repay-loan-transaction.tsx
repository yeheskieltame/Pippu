"use client"

import { BaseTransaction, type BaseTransactionProps } from "./transaction-wrapper"
import { type Address, parseUnits } from "viem"

export interface RepayLoanParams {
  poolAddress: Address
  amount: number
}

export interface RepayLoanTransactionProps
  extends Omit<BaseTransactionProps, 'functionName' | 'args'> {
  params: RepayLoanParams
}

export function RepayLoanTransaction({
  params,
  onSuccess,
  onError,
  onStatusChange,
  disabled = false,
  buttonText = "Repay Loan",
  loadingText = "Repaying Loan...",
  className = "btn-primary w-full"
}: RepayLoanTransactionProps) {
  // Validate params
  if (!params.poolAddress || !params.amount) {
    return (
      <button className={`${className} bg-gray-300 text-gray-500 cursor-not-allowed`} disabled>
        Invalid Parameters
      </button>
    )
  }

  // Convert amount to Wei for ETH payment (repayLoan is payable)
  const amountWei = parseUnits(params.amount.toString(), 18)

  // Prepare transaction arguments
  const args = [params.poolAddress]

  const handleSuccess = (receipt: any) => {
    console.log('Loan repaid successfully:', receipt)
    onSuccess?.(receipt)
  }

  const handleError = (error: any) => {
    console.error('Repay loan failed:', error)
    onError?.(error)
  }

  return (
    <BaseTransaction
      functionName="repayLoan"
      args={args}
      value={amountWei}
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