import { type Address, formatUnits, parseUnits } from "viem"
import { MOCK_TOKEN_CONFIG } from "@/lib/constants/mock-tokens"

// Contract utility functions for consistent formatting and calculations

/**
 * Get token decimals for a given token address
 */
export const getTokenDecimals = (tokenAddress: Address): number => {
  if (tokenAddress === MOCK_TOKEN_CONFIG.mWETH) return 18
  if (tokenAddress === MOCK_TOKEN_CONFIG.mUSDC) return 6
  if (tokenAddress === MOCK_TOKEN_CONFIG.mDAI) return 18
  return 18 // Default to 18 decimals
}

/**
 * Format token amount from Wei to human readable format
 */
export const formatTokenAmount = (
  amount: bigint | string | number,
  decimals: number,
  symbol?: string
): string => {
  const amountBigInt = typeof amount === 'string' || typeof amount === 'number'
    ? BigInt(amount)
    : amount

  const formatted = Number(formatUnits(amountBigInt, decimals))

  if (formatted === 0) return '0'
  if (formatted < 0.001) return '<0.001'

  // Format with appropriate precision
  if (decimals === 6) {
    return formatted.toFixed(2)
  } else {
    return formatted.toFixed(4)
  }
}

/**
 * Parse human readable amount to Wei
 */
export const parseTokenAmount = (
  amount: number | string,
  decimals: number
): bigint => {
  return parseUnits(amount.toString(), decimals)
}

/**
 * Calculate interest amount
 */
export const calculateInterest = (
  principal: number,
  aprBps: number, // Annual Percentage Rate in basis points
  durationSeconds: number
): number => {
  const annualRate = aprBps / 10000 // Convert from basis points to decimal
  const secondsInYear = 31536000 // 365 * 24 * 60 * 60
  return principal * annualRate * (durationSeconds / secondsInYear)
}

/**
 * Calculate Loan-to-Value ratio
 */
export const calculateLTV = (
  loanAmount: number,
  collateralValue: number
): number => {
  if (collateralValue === 0) return 0
  return (loanAmount / collateralValue) * 100
}

/**
 * Check if LTV is acceptable
 */
export const isValidLTV = (ltv: number, maxLTV: number = 70): boolean => {
  return ltv <= maxLTV
}

/**
 * Format currency amount
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount < 1 ? 2 : 0,
    maximumFractionDigits: amount < 1 ? 2 : 0,
  }).format(amount)
}

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Contract error mapping
 */
export const CONTRACT_ERRORS: Record<string, string> = {
  'Invalid collateral': 'Invalid collateral token address',
  'Invalid loan asset': 'Invalid loan token address',
  'Collateral > 0': 'Collateral amount must be greater than 0',
  'Loan amount > 0': 'Loan amount must be greater than 0',
  'Invalid rate': 'Invalid interest rate',
  'Description required': 'Pool description is required',
  'Name required': 'Pool name is required',
  'Invalid pool': 'Invalid pool address',
  'Insufficient balance': 'Insufficient token balance',
  'Only factory': 'Only factory can call this function',
  'Loan already active': 'Loan is already active',
  'No collateral': 'No collateral deposited',
  'Insufficient liquidity': 'Insufficient liquidity available',
  'No active loan': 'No active loan to repay',
  'Payment must be > 0': 'Payment amount must be greater than 0',
  'Insufficient payment': 'Payment amount is insufficient',
  'Already approved': 'Tokens already approved',
  'SafeERC20: failed operation': 'Token transfer failed',
  'ReentrancyGuard: reentrant call': 'Reentrancy guard triggered',
  'OwnableUnauthorizedAccount': 'Unauthorized account',
  'OwnableInvalidOwner': 'Invalid owner address',
}

/**
 * Get human readable error message from contract error
 */
export const getContractError = (error: any): string => {
  const errorMessage = error?.message || error || 'Unknown error'

  // Try to match known contract errors
  for (const [contractError, userMessage] of Object.entries(CONTRACT_ERRORS)) {
    if (errorMessage.includes(contractError)) {
      return userMessage
    }
  }

  // Handle common Web3 errors
  if (errorMessage.includes('user rejected')) {
    return 'Transaction was rejected by user'
  }

  if (errorMessage.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }

  if (errorMessage.includes('gas required exceeds')) {
    return 'Gas limit exceeded. Try increasing gas limit.'
  }

  if (errorMessage.includes('timeout')) {
    return 'Transaction timed out. Please try again.'
  }

  // Return original error if no mapping found
  return errorMessage
}

/**
 * Validate pool creation parameters
 */
export const validatePoolParams = (params: {
  name: string
  description: string
  collateralAmount: number
  loanAmount: number
  interestRate: number
  loanDuration: number
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!params.name?.trim()) {
    errors.push('Pool name is required')
  }

  if (!params.description?.trim()) {
    errors.push('Pool description is required')
  }

  if (params.collateralAmount <= 0) {
    errors.push('Collateral amount must be greater than 0')
  }

  if (params.loanAmount <= 0) {
    errors.push('Loan amount must be greater than 0')
  }

  if (params.interestRate <= 0 || params.interestRate > 20) {
    errors.push('Interest rate must be between 0% and 20%')
  }

  if (params.loanDuration < 1 || params.loanDuration > 365) {
    errors.push('Loan duration must be between 1 and 365 days')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Gas estimation utilities
 */
export const GAS_ESTIMATES = {
  CREATE_POOL: 3000000,
  FUND_POOL: 200000,
  WITHDRAW_POOL: 250000,
  DEPOSIT_COLLATERAL: 200000,
  DISBURSE_LOAN: 150000,
  REPAY_LOAN: 200000,
  APPROVE_TOKEN: 50000,
} as const

/**
 * Get gas estimate for transaction
 */
export const getGasEstimate = (txType: keyof typeof GAS_ESTIMATES): number => {
  return GAS_ESTIMATES[txType]
}