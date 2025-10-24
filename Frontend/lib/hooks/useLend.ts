"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { type Address, parseUnits, type Hash } from "viem"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"

// ERC20 ABI for token approvals
const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "account", type: "address" }
    ],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const

export interface LendParams {
  poolAddress: Address
  amount: number
}

export interface WithdrawParams {
  poolAddress: Address
  amount: number
}

export interface LendState {
  isFunding: boolean
  isWithdrawing: boolean
  isApproving: boolean
  error: string | null
  success: boolean
  currentStep: 'idle' | 'approving' | 'funding' | 'withdrawing' | 'completed'
}

export function useLend() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const [pendingTxHash, setPendingTxHash] = useState<Hash | null>(null)
  const { data: receipt, isLoading: isWaitingTx, error: txError } = useWaitForTransactionReceipt({
    hash: pendingTxHash as Hash,
  })

  const [state, setState] = useState<LendState>({
    isFunding: false,
    isWithdrawing: false,
    isApproving: false,
    error: null,
    success: false,
    currentStep: 'idle'
  })

  // Reset state
  const reset = () => {
    setState({
      isFunding: false,
      isWithdrawing: false,
      isApproving: false,
      error: null,
      success: false,
      currentStep: 'idle'
    })
    setPendingTxHash(null)
  }

  // Handle transaction completion
  useEffect(() => {
    if (receipt && pendingTxHash) {
      if (receipt.status === 'success') {
        setState(prev => ({
          ...prev,
          isFunding: false,
          isWithdrawing: false,
          isApproving: false,
          success: true,
          currentStep: 'completed'
        }))
      } else {
        setState(prev => ({
          ...prev,
          isFunding: false,
          isWithdrawing: false,
          isApproving: false,
          error: 'Transaction failed',
          currentStep: 'idle'
        }))
      }
      setPendingTxHash(null)
    }

    if (txError) {
      setState(prev => ({
        ...prev,
        isFunding: false,
        isWithdrawing: false,
        isApproving: false,
        error: txError.message,
        currentStep: 'idle'
      }))
      setPendingTxHash(null)
    }
  }, [receipt, txError, pendingTxHash])

  // Get token decimals
  const getTokenDecimals = (tokenAddress: Address): number => {
    if (tokenAddress === MOCK_TOKEN_CONFIG.mWETH) return 18
    if (tokenAddress === MOCK_TOKEN_CONFIG.mUSDC) return 6
    if (tokenAddress === MOCK_TOKEN_CONFIG.mDAI) return 18
    return 18
  }

  // Get user token balance
  const getUserBalance = async (tokenAddress: Address): Promise<number> => {
    // This would typically use wagmi's useReadContract hook, but for simplicity here
    // we'll return a placeholder. In real implementation, this should use useReadContract
    return 10000 // Placeholder
  }

  // Approve token
  const approveToken = async (tokenAddress: Address, amount: bigint): Promise<boolean> => {
    if (!isConnected || !address) return false

    try {
      setState(prev => ({ ...prev, isApproving: true, currentStep: 'approving', error: null }))

      const hash = await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.LENDING_FACTORY, amount],
      })

      setPendingTxHash(hash)
      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isApproving: false,
        error: error?.message || 'Failed to approve token',
        currentStep: 'idle'
      }))
      return false
    }
  }

  // Fund pool (provide liquidity)
  const fundPool = async (poolAddress: Address, loanAsset: Address, amount: number): Promise<boolean> => {
    if (!isConnected || !address) return false

    try {
      setState(prev => ({ ...prev, isFunding: true, currentStep: 'funding', error: null }))

      const decimals = getTokenDecimals(loanAsset)
      const amountWei = parseUnits(amount.toString(), decimals)

      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'fundPool',
        args: [poolAddress, amountWei],
      })

      setPendingTxHash(hash)
      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isFunding: false,
        error: error?.message || 'Failed to fund pool',
        currentStep: 'idle'
      }))
      return false
    }
  }

  // Withdraw from pool
  const withdrawFromPool = async (poolAddress: Address, amount: number): Promise<boolean> => {
    if (!isConnected || !address) return false

    try {
      setState(prev => ({ ...prev, isWithdrawing: true, currentStep: 'withdrawing', error: null }))

      const amountWei = parseUnits(amount.toString(), 6) // Assuming USDC (6 decimals)

      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'withdrawFromPool',
        args: [poolAddress, amountWei],
      })

      setPendingTxHash(hash)
      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isWithdrawing: false,
        error: error?.message || 'Failed to withdraw from pool',
        currentStep: 'idle'
      }))
      return false
    }
  }

  // Complete fund pool flow: approve -> fund
  const executeFund = async (poolAddress: Address, loanAsset: Address, amount: number): Promise<boolean> => {
    reset()

    // Step 1: Approve loan asset (USDC)
    const decimals = getTokenDecimals(loanAsset)
    const amountWei = parseUnits(amount.toString(), decimals)
    const approved = await approveToken(loanAsset, amountWei)

    if (!approved) return false

    // Step 2: Fund pool
    return await fundPool(poolAddress, loanAsset, amount)
  }

  // Complete withdraw flow: withdraw only (no approval needed)
  const executeWithdraw = async (poolAddress: Address, amount: number): Promise<boolean> => {
    reset()

    // Withdraw from pool
    return await withdrawFromPool(poolAddress, amount)
  }

  return {
    state,
    reset,
    approveToken,
    fundPool,
    withdrawFromPool,
    executeFund,
    executeWithdraw,
    getUserBalance,
    getTokenDecimals
  }
}