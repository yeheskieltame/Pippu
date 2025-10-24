"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionToast
} from "@coinbase/onchainkit/transaction"
import { type Address, parseUnits, encodeFunctionData } from "viem"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { baseSepolia } from "wagmi/chains"
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction"

export interface CreatePoolParams {
  name: string
  description: string
  collateralToken: Address
  loanToken: Address
  collateralAmount: number
  loanAmountRequested: number
  interestRate: number
  loanDuration: number
  riskLevel: "Low" | "Medium" | "High"
}

interface CreatePoolTransactionProps {
  params: CreatePoolParams
  onSuccess?: (poolAddress: Address) => void
  onError?: (error: Error) => void
  disabled?: boolean
}

export function CreatePoolTransaction({
  params,
  onSuccess,
  onError,
  disabled = false
}: CreatePoolTransactionProps) {
  const { address, isConnected } = useAccount()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [poolAddress, setPoolAddress] = useState<Address | null>(null)

  // Get token decimals for proper amount conversion
  const getTokenDecimals = (tokenAddress: Address): number => {
    if (tokenAddress === MOCK_TOKEN_CONFIG.mWETH) return 18
    if (tokenAddress === MOCK_TOKEN_CONFIG.mUSDC) return 6
    if (tokenAddress === MOCK_TOKEN_CONFIG.mDAI) return 18
    return 18 // Default to 18 decimals
  }

  // Convert amounts to proper contract units
  const collateralDecimals = getTokenDecimals(params.collateralToken)
  const loanDecimals = getTokenDecimals(params.loanToken)

  const collateralAmountWei = parseUnits(params.collateralAmount.toString(), collateralDecimals)
  const loanAmountWei = parseUnits(params.loanAmountRequested.toString(), loanDecimals)

  // Define the contract calls for creating a pool
  const calls = [
    {
      to: CONTRACT_ADDRESSES.LENDING_FACTORY,
      data: encodeFunctionData({
        abi: LENDING_FACTORY_ABI,
        functionName: 'createPoolWithMetadata',
        args: [
          params.collateralToken,
          params.loanToken,
          collateralAmountWei,
          loanAmountWei,
          BigInt(params.interestRate * 100), // Convert to basis points (12% -> 1200)
          BigInt(params.loanDuration * 86400), // Convert days to seconds
          params.description,
          params.name
        ],
      }),
    }
  ]

  const handleSuccess = (response: any) => {
    console.log('Transaction successful:', response)
    setIsCreating(false)
    setSuccess(true)
    setError(null)

    // Extract pool address from transaction receipt logs
    if (response.transactionReceipts && response.transactionReceipts.length > 0) {
      const receipt = response.transactionReceipts[0]
      if (receipt.logs && receipt.logs.length > 0) {
        // Find the PoolCreated event (assuming it's the first log with the right topic)
        const poolCreatedLog = receipt.logs.find((log: any) =>
          log.topics && log.topics.length > 1
        )

        if (poolCreatedLog?.topics[1]) {
          const extractedPoolAddress = `0x${poolCreatedLog.topics[1].slice(26)}` as Address
          setPoolAddress(extractedPoolAddress)
          onSuccess?.(extractedPoolAddress)
        }
      }
    }
  }

  const handleError = (error: any) => {
    console.error('Transaction error:', error)
    setIsCreating(false)
    setSuccess(false)
    setError(error?.message || error?.error || 'Transaction failed')
    onError?.(new Error(error?.message || error?.error || 'Transaction failed'))
  }

  const handleStatusChange = (status: LifecycleStatus) => {
    console.log('Transaction status:', status)

    if (status.statusName === 'transactionPending') {
      setIsCreating(true)
      setError(null)
      setSuccess(false)
    } else if (status.statusName === 'error') {
      setIsCreating(false)
      setSuccess(false)
      setError(status.statusData?.message || status.statusData?.error || 'Transaction failed')
    }
  }

  if (!isConnected) {
    return (
      <button
        className="btn-primary w-full"
        disabled
      >
        Connect Wallet to Create Pool
      </button>
    )
  }

  return (
    <Transaction
      chainId={baseSepolia.id}
      calls={calls}
      onStatus={handleStatusChange}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      <TransactionButton
        text={isCreating ? "Creating Pool..." : "Create Pool"}
        disabled={disabled || isCreating}
        className="btn-primary w-full"
      />

      <TransactionToast>
        <TransactionStatus>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Creating Pool...</span>
          </div>
        </TransactionStatus>
      </TransactionToast>
    </Transaction>
  )
}

