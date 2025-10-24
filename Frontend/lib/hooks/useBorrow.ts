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
  }
] as const

export interface BorrowParams {
  poolAddress: Address
  amount: number
}

export interface RepayParams {
  poolAddress: Address
  amount: number
}

export interface BorrowState {
  isDepositing: boolean
  isDisbursing: boolean
  isRepaying: boolean
  isApproving: boolean
  error: string | null
  success: boolean
  currentStep: 'idle' | 'approving' | 'depositing' | 'disbursing' | 'repaying' | 'completed'
}

export function useBorrow() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const [pendingTxHash, setPendingTxHash] = useState<Hash | null>(null)
  const { data: receipt, isLoading: isWaitingTx, error: txError } = useWaitForTransactionReceipt({
    hash: pendingTxHash as Hash,
  })

  const [state, setState] = useState<BorrowState>({
    isDepositing: false,
    isDisbursing: false,
    isRepaying: false,
    isApproving: false,
    error: null,
    success: false,
    currentStep: 'idle'
  })

  // Reset state
  const reset = () => {
    setState({
      isDepositing: false,
      isDisbursing: false,
      isRepaying: false,
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
          isDepositing: false,
          isDisbursing: false,
          isRepaying: false,
          isApproving: false,
          success: true,
          currentStep: 'completed'
        }))
      } else {
        setState(prev => ({
          ...prev,
          isDepositing: false,
          isDisbursing: false,
          isRepaying: false,
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
        isDepositing: false,
        isDisbursing: false,
        isRepaying: false,
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

  // Deposit collateral to pool
  const depositCollateral = async (poolAddress: Address, collateralToken: Address, amount: number): Promise<boolean> => {
    if (!isConnected || !address) return false

    try {
      setState(prev => ({ ...prev, isDepositing: true, currentStep: 'depositing', error: null }))

      const decimals = getTokenDecimals(collateralToken)
      const amountWei = parseUnits(amount.toString(), decimals)

      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'depositCollateral',
        args: [poolAddress, amountWei],
      })

      setPendingTxHash(hash)
      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isDepositing: false,
        error: error?.message || 'Failed to deposit collateral',
        currentStep: 'idle'
      }))
      return false
    }
  }

  // Disburse loan from pool
  const disburseLoan = async (poolAddress: Address): Promise<boolean> => {
    if (!isConnected || !address) return false

    try {
      setState(prev => ({ ...prev, isDisbursing: true, currentStep: 'disbursing', error: null }))

      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'disburseLoan',
        args: [poolAddress],
      })

      setPendingTxHash(hash)
      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isDisbursing: false,
        error: error?.message || 'Failed to disburse loan',
        currentStep: 'idle'
      }))
      return false
    }
  }

  // Repay loan
  const repayLoan = async (poolAddress: Address, amount: number): Promise<boolean> => {
    if (!isConnected || !address) return false

    try {
      setState(prev => ({ ...prev, isRepaying: true, currentStep: 'repaying', error: null }))

      // Convert to Wei for ETH payment
      const amountWei = parseUnits(amount.toString(), 18)

      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'repayLoan',
        args: [poolAddress],
        value: amountWei, // Send ETH for repayment
      })

      setPendingTxHash(hash)
      return true
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isRepaying: false,
        error: error?.message || 'Failed to repay loan',
        currentStep: 'idle'
      }))
      return false
    }
  }

  // Complete borrow flow: approve collateral -> deposit -> disburse
  const executeBorrow = async (poolAddress: Address, collateralToken: Address, amount: number): Promise<boolean> => {
    reset()

    // Step 1: Approve collateral token
    const decimals = getTokenDecimals(collateralToken)
    const amountWei = parseUnits(amount.toString(), decimals)
    const approved = await approveToken(collateralToken, amountWei)

    if (!approved) return false

    // Step 2: Deposit collateral
    const deposited = await depositCollateral(poolAddress, collateralToken, amount)
    if (!deposited) return false

    // Step 3: Disburse loan
    return await disburseLoan(poolAddress)
  }

  return {
    state,
    reset,
    approveToken,
    depositCollateral,
    disburseLoan,
    repayLoan,
    executeBorrow
  }
}