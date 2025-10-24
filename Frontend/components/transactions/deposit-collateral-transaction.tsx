"use client"

import { BaseTransaction, type BaseTransactionProps } from "./transaction-wrapper"
import { type Address, parseUnits } from "viem"
import { LIQUIDITY_POOL_ABI } from "@/lib/abi/liquidity-pool"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"

export interface DepositCollateralParams {
  poolAddress: Address
  collateralToken: Address
  amount: number
}

export interface DepositCollateralTransactionProps
  extends Omit<BaseTransactionProps, 'functionName' | 'args' | 'contractAddress' | 'abi'> {
  params: DepositCollateralParams
}

export function DepositCollateralTransaction({
  params,
  onSuccess,
  onError,
  onStatusChange,
  disabled = false,
  buttonText = "Deposit Collateral",
  loadingText = "Depositing Collateral...",
  className = "btn-primary w-full"
}: DepositCollateralTransactionProps) {
  // Validate params
  if (!params.poolAddress || !params.collateralToken || !params.amount) {
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
  const decimals = getTokenDecimals(params.collateralToken)
  const amountWei = parseUnits(params.amount.toString(), decimals)

  // Prepare transaction arguments for POOL contract
  // Note: We're calling the pool contract directly, not the factory
  const args = [amountWei] // Only amount needed for pool contract

  const handleSuccess = (receipt: any) => {
    console.log('Collateral deposited successfully:', receipt)
    onSuccess?.(receipt)
  }

  const handleError = (error: any) => {
    console.error('Deposit collateral failed:', error)
    onError?.(error)
  }

  return (
    <BaseTransaction
      contractAddress={params.poolAddress} // ← Pool address, not factory
      abi={LIQUIDITY_POOL_ABI as unknown as any[]} // ← Pool ABI, not factory ABI
      functionName="depositCollateral" // ← Function in pool contract
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