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
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { baseSepolia } from "wagmi/chains"
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction"

export interface TransactionParams {
  functionName: string
  args: any[]
  value?: bigint
}

export interface BaseTransactionProps {
  functionName: string
  args: any[]
  onSuccess?: (receipt: any) => void
  onError?: (error: any) => void
  onStatusChange?: (status: LifecycleStatus) => void
  disabled?: boolean
  buttonText?: string
  loadingText?: string
  className?: string
  value?: bigint
}

export function BaseTransaction({
  functionName,
  args,
  onSuccess,
  onError,
  onStatusChange,
  disabled = false,
  buttonText = "Execute Transaction",
  loadingText = "Executing...",
  className = "",
  value
}: BaseTransactionProps) {
  const { isConnected, address } = useAccount()
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validate all arguments before preparing transaction
  const validateArguments = () => {
    for (const arg of args) {
      if (arg === undefined || arg === null) {
        throw new Error('Invalid transaction argument: one or more arguments are undefined')
      }
    }

    if (functionName && typeof functionName === 'string') {
      const functionAbi = LENDING_FACTORY_ABI.find(fn => fn.name === functionName)
      if (!functionAbi) {
        throw new Error(`Function ${functionName} not found in ABI`)
      }
    }
  }

  // Prepare transaction data with validation
  const calls = []
  try {
    validateArguments()

    calls.push({
      to: CONTRACT_ADDRESSES.LENDING_FACTORY,
      data: encodeFunctionData({
        abi: LENDING_FACTORY_ABI,
        functionName: functionName as any, // Type assertion for dynamic function names
        args: args as any[], // Type assertion for dynamic args
      }),
      ...(value && { value })
    })
  } catch (error) {
    console.error('Transaction preparation failed:', error)
    setError(error instanceof Error ? error.message : 'Transaction preparation failed')
  }

  // Don't render if calls array is empty (validation failed)
  if (calls.length === 0) {
    return (
      <button
        className={`${className} bg-gray-300 text-gray-500 cursor-not-allowed`}
        disabled
      >
        Invalid Transaction Data
      </button>
    )
  }

  const handleSuccess = (response: any) => {
    console.log(`${functionName} transaction successful:`, response)
    setIsExecuting(false)
    setError(null)
    onSuccess?.(response)
  }

  const handleError = (error: any) => {
    console.error(`${functionName} transaction error:`, error)
    setIsExecuting(false)
    setError(error?.message || error?.error || 'Transaction failed')
    onError?.(error)
  }

  const handleStatusChange = (status: LifecycleStatus) => {
    console.log(`${functionName} transaction status:`, status)

    if (status.statusName === 'transactionPending') {
      setIsExecuting(true)
      setError(null)
    } else if (status.statusName === 'error') {
      setIsExecuting(false)
      setError(status.statusData?.message || status.statusData?.error || 'Transaction failed')
    } else if (status.statusName === 'success') {
      setIsExecuting(false)
      setError(null)
    }

    onStatusChange?.(status)
  }

  if (!isConnected) {
    return (
      <button
        className={`${className} bg-gray-300 text-gray-500 cursor-not-allowed`}
        disabled
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <>
      <Transaction
        chainId={baseSepolia.id}
        calls={calls}
        onStatus={handleStatusChange}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <TransactionButton
          text={isExecuting ? loadingText : buttonText}
          disabled={disabled || isExecuting}
          className={className}
        />
      </Transaction>

      <TransactionToast>
        <TransactionStatus>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>{loadingText}</span>
          </div>
        </TransactionStatus>
      </TransactionToast>

      {/* Error Display */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}
    </>
  )
}