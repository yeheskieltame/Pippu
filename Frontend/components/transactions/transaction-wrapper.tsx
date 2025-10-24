"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { useAccount } from "wagmi"
import {
  Transaction,
  TransactionButton
} from "@coinbase/onchainkit/transaction"
import { type Address, encodeFunctionData } from "viem"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { LENDING_FACTORY_ABI, ERC20_ABI } from "@/lib/abi"
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
  tokenAddress?: Address // Optional token address for ERC20 transactions
  onSuccess?: (receipt: any) => void
  onError?: (error: any) => void
  onStatusChange?: (status: LifecycleStatus) => void
  disabled?: boolean
  buttonText?: string
  loadingText?: string
  className?: string
  value?: bigint
}

const BaseTransaction = memo(function BaseTransaction({
  functionName,
  args,
  tokenAddress,
  onSuccess,
  onError,
  onStatusChange,
  disabled = false,
  buttonText = "Execute Transaction",
  loadingText = "Executing...",
  className = "",
  value
}: BaseTransactionProps) {
  const { isConnected } = useAccount()
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoized stringified args for stable dependencies
  const stringifiedArgs = useMemo(() => {
    return JSON.stringify(args, (_, value) =>
      typeof value === 'bigint' ? value.toString() + 'n' : value
    )
  }, [args])

  // Validate all arguments before preparing transaction - memoized
  const validateArguments = useCallback(() => {
    for (const arg of args) {
      if (arg === undefined || arg === null) {
        throw new Error('Invalid transaction argument: one or more arguments are undefined')
      }
    }

    // Skip ABI validation for now to prevent infinite loop
    // TODO: Add proper validation logic that doesn't cause re-renders
  }, [stringifiedArgs])

  // Prepare transaction data using useMemo to prevent re-renders
  const calls = useMemo(() => {
    try {
      validateArguments()

      // Determine which contract and ABI to use
      const contractAddress = tokenAddress || CONTRACT_ADDRESSES.LENDING_FACTORY
      const abi = tokenAddress ? ERC20_ABI : LENDING_FACTORY_ABI

      // Simple transaction data preparation
      const transactionData = {
        to: contractAddress as Address,
        data: encodeFunctionData({
          abi: abi,
          functionName: functionName as any,
          args: args as any,
        }) as `0x${string}`,
        ...(value && { value })
      }

      return [transactionData]
    } catch (error) {
      console.error('Transaction preparation failed:', error)
      setError(error instanceof Error ? error.message : 'Transaction preparation failed')
      return []
    }
  }, [functionName, stringifiedArgs, tokenAddress, value])

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

  const handleSuccess = useCallback((response: any) => {
    console.log(`${functionName} transaction successful:`, response)
    setIsExecuting(false)
    setError(null)
    onSuccess?.(response)
  }, [functionName, onSuccess])

  const handleError = useCallback((error: any) => {
    console.error(`${functionName} transaction error:`, error)
    setIsExecuting(false)

    // Handle specific timeout errors
    if (error?.message?.includes('TimeoutError') || error?.name === 'TimeoutError') {
      setError('Transaction timed out. The transaction may still be processing. Please check your wallet.')
    } else if (error?.message?.includes('400') || error?.status === 400) {
      setError('Network error: Bad request. Please try again.')
    } else if (error?.message?.includes('Fetch failed')) {
      setError('Network connection failed. Please check your internet connection and try again.')
    } else {
      setError(error?.message || error?.error || 'Transaction failed')
    }

    onError?.(error)
  }, [functionName, onError])

  const handleStatusChange = useCallback((status: LifecycleStatus) => {
    console.log(`${functionName} transaction status:`, status)

    try {
      if (status.statusName === 'transactionPending') {
        setIsExecuting(true)
        setError(null)
      } else if (status.statusName === 'error') {
        setIsExecuting(false)
        const errorMessage = status.statusData?.message || status.statusData?.error || 'Transaction failed'

        // Handle specific error types in status
        if (errorMessage.includes('TimeoutError') || errorMessage.includes('timeout')) {
          setError('Transaction timed out. The transaction may still be processing. Please check your wallet.')
        } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
          setError('Network error: Bad request. Please try again.')
        } else {
          setError(errorMessage)
        }
      } else if (status.statusName === 'success') {
        setIsExecuting(false)
        setError(null)
      }

      onStatusChange?.(status)
    } catch (err) {
      console.error('Error in handleStatusChange:', err)
      setIsExecuting(false)
    }
  }, [functionName, onStatusChange])

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

  // Memoize transaction props to prevent unnecessary re-renders
  const transactionProps = useMemo(() => ({
    chainId: baseSepolia.id,
    calls,
    onStatus: handleStatusChange,
    onSuccess: handleSuccess,
    onError: handleError
  }), [calls, handleStatusChange, handleSuccess, handleError])

  return (
    <>
      <Transaction {...transactionProps}>
        <TransactionButton
          text={isExecuting ? loadingText : buttonText}
          disabled={disabled || isExecuting}
          className={className}
        />
      </Transaction>

      {/* Custom Loading Indicator - Replaces problematic TransactionToast */}
      {isExecuting && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-800">{loadingText}</span>
          </div>
        </div>
      )}

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
})

export { BaseTransaction }