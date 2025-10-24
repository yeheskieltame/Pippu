"use client"

import { useState, useEffect, useRef } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi"
import { type Address, parseEther, parseUnits, type Hash } from "viem"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"
import { LENDING_FACTORY_ABI, POOL_CREATED_TOPIC } from "@/lib/abi/lending-factory"

// ERC20 ABI for token approvals
const ERC20_ABI = [
  {
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

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

export interface CreatePoolState {
  isCreating: boolean
  isApproving: boolean
  isDepositing: boolean
  error: string | null
  success: boolean
  poolAddress: Address | null
  currentStep: 'idle' | 'approving' | 'creating' | 'completed'
  transactionHash: Hash | null
  isConfirming: boolean
  confirmationTimeout: boolean
}

export function useCreatePool() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash } = useWriteContract()
  const publicClient = usePublicClient()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { data: receipt, isLoading: isWaitingTx, error: txError } = useWaitForTransactionReceipt({
    hash: hash as Hash,
    pollingInterval: 2000, // Poll every 2 seconds
    retryCount: 10, // Retry up to 10 times
  })

  const [state, setState] = useState<CreatePoolState>({
    isCreating: false,
    isApproving: false,
    isDepositing: false,
    error: null,
    success: false,
    poolAddress: null,
    currentStep: 'idle',
    transactionHash: null,
    isConfirming: false,
    confirmationTimeout: false
  })

  // Reset state
  const reset = () => {
    // Clear all timeouts and intervals
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    setState({
      isCreating: false,
      isApproving: false,
      isDepositing: false,
      error: null,
      success: false,
      poolAddress: null,
      currentStep: 'idle',
      transactionHash: null,
      isConfirming: false,
      confirmationTimeout: false
    })
      }

  // Fallback transaction polling mechanism
  const startFallbackPolling = (txHash: Hash) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    let pollCount = 0
    const maxPolls = 30 // Poll for maximum 60 seconds (30 * 2 seconds)

    pollingIntervalRef.current = setInterval(async () => {
      pollCount++

      try {
        if (publicClient) {
          const transaction = await publicClient.getTransaction({ hash: txHash })

          if (transaction) {
            const receipt = await publicClient.getTransactionReceipt({ hash: txHash })

            if (receipt) {
              // Transaction found, clear polling
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
                pollingIntervalRef.current = null
              }

              // Manually trigger the success handling
              handleTransactionSuccess(receipt)
              return
            }
          }
        }
      } catch (error) {
        console.error('Fallback polling error:', error)
      }

      // Stop polling after max attempts
      if (pollCount >= maxPolls) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }

        setState(prev => ({
          ...prev,
          isCreating: false,
          isApproving: false,
          error: 'Transaction confirmation timeout. Please check your wallet to verify if the transaction was completed.',
          confirmationTimeout: true,
          currentStep: 'idle'
        }))
              }
    }, 2000) // Poll every 2 seconds
  }

  // Handle transaction success
  const handleTransactionSuccess = (txReceipt: any) => {
    console.log('Transaction confirmed successfully:', txReceipt)

    // Clear timeouts and polling
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    // Use the receipt to determine current step more reliably
    const txHash = txReceipt.transactionHash

    if (state.currentStep === 'creating' || state.transactionHash === txHash) {
      console.log('Processing pool creation transaction...')
      console.log('Transaction logs:', txReceipt.logs)

      let poolAddress: Address | null = null
      if (txReceipt.logs && txReceipt.logs.length > 0) {
        const poolCreatedEvent = txReceipt.logs.find((log: any) =>
          log.topics[0]?.toLowerCase() === POOL_CREATED_TOPIC.toLowerCase()
        )
        console.log('Pool created event:', poolCreatedEvent)

        if (poolCreatedEvent?.topics[1]) {
          // Convert hex string to address format
          poolAddress = `0x${poolCreatedEvent.topics[1].slice(26)}` as Address
        }
      }

      console.log('Extracted pool address:', poolAddress)

      setState(prev => ({
        ...prev,
        isCreating: false,
        isConfirming: false,
        success: true,
        poolAddress,
        currentStep: 'completed',
        error: null // Clear any previous errors
      }))
    } else if (state.currentStep === 'approving') {
      setState(prev => ({
        ...prev,
        isApproving: false,
        isConfirming: false,
        currentStep: 'idle',
        error: null // Clear any previous errors
      }))
    }

      }

  // Handle transaction completion
  useEffect(() => {
    console.log('Transaction state update:', {
      receipt: !!receipt,
      receiptStatus: receipt?.status,
      hash,
      currentStep: state.currentStep,
      txError: !!txError,
      isWaitingTx
    })

    if (receipt && hash && receipt.transactionHash === hash) {
      console.log('Transaction receipt matches pending hash, processing...')

      if (receipt.status === 'success') {
        console.log('Transaction successful, calling handleTransactionSuccess')
        handleTransactionSuccess(receipt)
      } else if (receipt.status === 'reverted') {
        console.log('Transaction reverted')
        setState(prev => ({
          ...prev,
          isCreating: false,
          isApproving: false,
          isConfirming: false,
          error: 'Transaction failed: Transaction was reverted by the network',
          currentStep: 'idle'
        }))
              }
    }

    if (txError) {
      console.log('Transaction error occurred:', txError)
      // Clear timeouts and polling
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      setState(prev => ({
        ...prev,
        isCreating: false,
        isApproving: false,
        isConfirming: false,
        error: `Transaction error: ${txError.message}`,
        currentStep: 'idle'
      }))
          }
  }, [receipt, txError, hash, state.currentStep, isWaitingTx])

  // Set up timeout and fallback polling when transaction is submitted
  useEffect(() => {
    if (hash && (state.currentStep === 'creating' || state.currentStep === 'approving')) {
      setState(prev => ({ ...prev, isConfirming: true, confirmationTimeout: false }))

      // Set up timeout for primary transaction receipt checking
      timeoutRef.current = setTimeout(() => {
        console.log('Primary transaction receipt checking timeout, starting fallback polling...')
        startFallbackPolling(hash)
      }, 30000) // 30 seconds timeout for primary method
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [hash, state.currentStep])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [])

  // Approve token for factory
  const approveToken = async (
    tokenAddress: Address,
    amount: bigint
  ): Promise<boolean> => {
    if (!isConnected || !address) return false

    try {
      setState(prev => ({
        ...prev,
        isApproving: true,
        currentStep: 'approving',
        error: null,
        transactionHash: null
      }))

      const hash = await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.LENDING_FACTORY, amount],
      })

      console.log('Approval transaction submitted:', hash)

            setState(prev => ({ ...prev, transactionHash: hash }))
      return true
    } catch (error: any) {
      console.error('Approval error:', error)
      setState(prev => ({
        ...prev,
        isApproving: false,
        error: error?.message || 'Failed to approve token',
        currentStep: 'idle',
        transactionHash: null
      }))
      return false
    }
  }

  // Create pool with metadata only (no approval needed for this step)
  const createPoolWithCollateral = async (params: CreatePoolParams): Promise<Address | null> => {
    if (!isConnected || !address) return null

    try {
      setState(prev => ({
        ...prev,
        isCreating: true,
        currentStep: 'creating',
        error: null,
        transactionHash: null
      }))

      // Get token decimals for proper amount conversion
      const getTokenDecimals = (tokenAddress: Address): number => {
        if (tokenAddress === MOCK_TOKEN_CONFIG.mWETH) return 18
        if (tokenAddress === MOCK_TOKEN_CONFIG.mUSDC) return 6
        if (tokenAddress === MOCK_TOKEN_CONFIG.mDAI) return 18
        return 18 // Default to 18 decimals
      }

      // Convert amounts to proper contract units using parseUnits
      const collateralDecimals = getTokenDecimals(params.collateralToken)
      const loanDecimals = getTokenDecimals(params.loanToken)

      const collateralAmountWei = parseUnits(params.collateralAmount.toString(), collateralDecimals)
      const loanAmountWei = parseUnits(params.loanAmountRequested.toString(), loanDecimals)

      console.log('Creating pool with params:', {
        collateralToken: params.collateralToken,
        loanToken: params.loanToken,
        collateralAmountWei: collateralAmountWei.toString(),
        loanAmountWei: loanAmountWei.toString(),
        interestRate: BigInt(params.interestRate * 100).toString(),
        loanDuration: BigInt(params.loanDuration * 86400).toString(),
        description: params.description,
        name: params.name
      })

      // Create pool with metadata - this only creates the pool, no token transfers needed
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
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
      })

      console.log('Pool creation transaction submitted:', hash)

            setState(prev => ({ ...prev, transactionHash: hash }))
      return hash
    } catch (error: any) {
      console.error('Pool creation error:', error)
      setState(prev => ({
        ...prev,
        isCreating: false,
        error: error?.message || 'Failed to create pool',
        currentStep: 'idle',
        transactionHash: null
      }))
      return null
    }
  }

  // Simple create pool flow: just create pool (no approvals needed)
  const executeCreatePool = async (params: CreatePoolParams): Promise<Address | null> => {
    console.log('executeCreatePool called with:', params)
    reset()

    // Create pool with metadata only - token approvals will be needed later for deposit operations
    console.log('Calling createPoolWithCollateral...')

    try {
      const result = await createPoolWithCollateral(params)
      console.log('createPoolWithCollateral result:', result)
      return result
    } catch (error) {
      console.error('executeCreatePool error:', error)
      return null
    }
  }

  return {
    state,
    reset,
    approveToken,
    createPoolWithCollateral,
    executeCreatePool
  }
}