/**
 * Frontend Contract Integration Helper
 * Handles all interactions with the lending protocol smart contracts
 */

// Contract ABIs (simplified for demonstration)
export const LENDING_FACTORY_ABI = [
  // Pool creation
  "function createPool(address collateralAsset, address loanAsset, uint256 collateralAmount, uint256 loanAmount, uint256 interestRate, uint256 loanDuration, string description) external returns (address)",
  "function createPoolWithMetadata(address collateralAsset, address loanAsset, uint256 collateralAmount, uint256 loanAmount, uint256 interestRate, uint256 loanDuration, string description, string name, string riskLevel) external returns (address)",

  // Pool funding
  "function fundPool(address pool, uint256 amount) external",
  "function withdrawFromPool(address pool, uint256 amount) external",
  "function depositCollateral(address pool, uint256 amount) external",

  // Loan operations
  "function disburseLoan(address pool) external",
  "function repayLoan(address pool) external payable",
  "function liquidateCollateral(address pool) external",

  // View functions
  "function getPoolCount() external view returns (uint256)",
  "function getAllPools() external view returns (address[])",
  "function getActivePools() external view returns (address[])",
  "function getProposalByPool(address pool) external view returns (tuple(address borrower, address collateralAsset, address loanAsset, uint256 collateralAmount, uint256 loanAmountRequested, uint256 interestRate, uint256 loanDuration, string description, bool active, address liquidityPool))",
  "function getUserPools(address user) external view returns (address[])",
  "function getPoolTVL(address pool) external view returns (uint256)",
  "function getPoolInfo(address pool) external view returns (tuple(address collateralAsset, address loanAsset, uint256 totalCollateral, uint256 totalLiquidity, uint256 totalLoaned, uint256 interestRate, uint256 loanDuration, uint256 maxLoanToValue, address borrower, bool loanActive, uint256 loanStartTime, uint256 loanEndTime, uint256 loanAmount, uint256 accruedInterest))",
  "function getProviderBalance(address pool, address provider) external view returns (uint256)",
  "function calculateInterest(address pool) external view returns (uint256)",
  "function isLoanDefaulted(address pool) external view returns (bool)",

  // Enhanced frontend functions
  "function getMultiplePoolsInfo(address[] pools) external view returns (tuple(address poolAddress, string name, string description, uint256 tvl, uint256 totalBorrowed, uint256 interestRate, uint256 utilizationRate, uint256 lendersCount, bool active, string riskLevel)[])",
  "function getActivePoolsPaginated(uint256 offset, uint256 limit) external view returns (tuple(address poolAddress, string name, string description, uint256 tvl, uint256 totalBorrowed, uint256 interestRate, uint256 utilizationRate, uint256 lendersCount, bool active, string riskLevel)[], uint256 total)",
  "function getUserLenderPositions(address lender) external view returns (tuple(address pool, uint256 liquidityProvided, uint256 shares, uint256 earningsAccumulated, bool isActive)[])",
  "function getPoolMetrics(address pool) external view returns (uint256 tvl, uint256 utilizationRate, uint256 lendersCount, uint256 averageAPY, uint256 totalInterestPaid)",
  "function calculateUserRewards(address lender, address pool) external view returns (uint256)",
  "function getPoolHealthMetrics(address pool) external view returns (bool isHealthy, uint256 collateralRatio, uint256 timeToLiquidation, bool hasDefaultRisk)",

  // Events
  "event PoolCreated(address indexed pool, address indexed borrower, address collateralAsset, address loanAsset, uint256 loanAmount)",
  "event PoolFunded(address indexed pool, address indexed lender, uint256 amount, uint256 totalTVL)",
  "event LiquidityWithdrawn(address indexed pool, address indexed lender, uint256 amount, uint256 sharesBurned)",
  "event LoanDisbursed(address indexed pool, address indexed borrower, uint256 amount)",
  "event LoanRepaid(address indexed pool, address indexed borrower, uint256 principal, uint256 interest)",
]

export const LIQUIDITY_POOL_ABI = [
  // Basic operations
  "function provideLiquidity(uint256 amount) external",
  "function withdrawLiquidity(uint256 amount) external",
  "function disburseLoan() external",
  "function repayLoan() external payable",
  "function liquidateCollateral() external",

  // Enhanced view functions
  "function calculateInterest() external view returns (uint256)",
  "function isLoanDefaulted() external view returns (bool)",
  "function getPoolInfo() external view returns (tuple(address collateralAsset, address loanAsset, uint256 totalCollateral, uint256 totalLiquidity, uint256 totalLoaned, uint256 interestRate, uint256 loanDuration, uint256 maxLoanToValue, address borrower, bool loanActive, uint256 loanStartTime, uint256 loanEndTime, uint256 loanAmount, uint256 accruedInterest))",
  "function getProviderBalance(address provider) external view returns (uint256)",
  "function getTVL() external view returns (uint256)",

  // Frontend-specific functions
  "function getPoolMetrics() external view returns (tuple(uint256 totalLenders, uint256 totalDeposits, uint256 totalWithdrawals, uint256 totalInterestEarned, uint256 averageDepositSize, uint24 utilizationRate))",
  "function getLenderInfo(address lender) external view returns (tuple(uint256 totalDeposited, uint256 totalWithdrawn, uint256 currentDeposit, uint256 shares, uint256 earningsAccumulated, uint256 lastActivityTimestamp, bool isActive))",
  "function calculateUserRewards(address lender) external view returns (uint256)",
  "function getHealthMetrics() external view returns (bool isHealthy, uint256 collateralRatio, uint256 timeToLiquidation, bool hasDefaultRisk)",

  // Enhanced events
  "event LiquidityProvided(address indexed provider, uint256 amount, uint256 shares, uint256 totalTVL, uint256 newUtilizationRate)",
  "event LiquidityWithdrawn(address indexed provider, uint256 amount, uint256 shares, uint256 totalTVL, uint256 newUtilizationRate)",
  "event LoanDisbursed(address indexed borrower, uint256 amount, uint256 interestRate, uint256 duration, uint256 totalCollateral)",
  "event LoanRepaid(address indexed borrower, uint256 principal, uint256 interest, uint256 totalRepayment, uint256 collateralReturned)",
  "event PoolMetricsUpdated(uint256 totalTVL, uint256 utilizationRate, uint256 totalLenders, uint256 totalInterestEarned)",
]

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  BASE_SEPOLIA: {
    LENDING_FACTORY: "0x...", // Replace with actual deployed address
    USDC: "0x...", // USDC on Base Sepolia
    WETH: "0x...", // WETH on Base Sepolia
  },
  BASE_MAINNET: {
    LENDING_FACTORY: "0x...", // Replace with actual deployed address
    USDC: "0x...", // USDC on Base Mainnet
    WETH: "0x...", // WETH on Base Mainnet
  }
}

// Network configurations
export const NETWORK_CONFIG = {
  BASE_SEPOLIA: {
    chainId: "0x14a34", // 84532 in hex
    chainName: "Base Sepolia Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.base.org"],
    blockExplorerUrls: ["https://sepolia.basescan.org"],
  },
  BASE_MAINNET: {
    chainId: "0x2105", // 8453 in hex
    chainName: "Base",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
  },
}

// Type definitions for contract interactions
export interface PoolSummary {
  poolAddress: string
  name: string
  description: string
  tvl: string
  totalBorrowed: string
  interestRate: number
  utilizationRate: number
  lendersCount: number
  active: boolean
  riskLevel: string
}

export interface LenderPosition {
  pool: string
  liquidityProvided: string
  shares: string
  earningsAccumulated: string
  isActive: boolean
}

export interface PoolMetrics {
  totalTVL: string
  utilizationRate: number
  lendersCount: number
  averageAPY: number
  totalInterestPaid: string
}

export interface HealthMetrics {
  isHealthy: boolean
  collateralRatio: number
  timeToLiquidation: number
  hasDefaultRisk: boolean
}

export interface ActivityLog {
  timestamp: number
  user: string
  action: string
  amount: string
  pool: string
  details: string
}

// Utility functions for contract interaction
export class LendingProtocol {
  private factoryContract: any
  private provider: any

  constructor(provider: any) {
    this.provider = provider
    this.factoryContract = new this.provider.Contract(
      CONTRACT_ADDRESSES.BASE_SEPOLIA.LENDING_FACTORY,
      LENDING_FACTORY_ABI
    )
  }

  // Pool management
  async createPool(params: {
    collateralAsset: string
    loanAsset: string
    collateralAmount: string
    loanAmount: string
    interestRate: number
    loanDuration: number
    description: string
    name?: string
    riskLevel?: string
  }) {
    const tx = params.name && params.riskLevel
      ? await this.factoryContract.methods.createPoolWithMetadata(
          params.collateralAsset,
          params.loanAsset,
          params.collateralAmount,
          params.loanAmount,
          params.interestRate,
          params.loanDuration,
          params.description,
          params.name,
          params.riskLevel
        ).send()
      : await this.factoryContract.methods.createPool(
          params.collateralAsset,
          params.loanAsset,
          params.collateralAmount,
          params.loanAmount,
          params.interestRate,
          params.loanDuration,
          params.description
        ).send()

    return tx
  }

  // Data fetching
  async getAllPools(): Promise<PoolSummary[]> {
    const poolAddresses = await this.factoryContract.methods.getAllPools().call()

    if (poolAddresses.length === 0) return []

    return await this.factoryContract.methods.getMultiplePoolsInfo(poolAddresses).call()
  }

  async getActivePools(offset = 0, limit = 10): Promise<{ pools: PoolSummary[], total: number }> {
    return await this.factoryContract.methods.getActivePoolsPaginated(offset, limit).call()
  }

  async getUserPositions(userAddress: string): Promise<LenderPosition[]> {
    return await this.factoryContract.methods.getUserLenderPositions(userAddress).call()
  }

  async getPoolMetrics(poolAddress: string): Promise<PoolMetrics> {
    return await this.factoryContract.methods.getPoolMetrics(poolAddress).call()
  }

  async calculateUserRewards(userAddress: string, poolAddress: string): Promise<string> {
    return await this.factoryContract.methods.calculateUserRewards(userAddress, poolAddress).call()
  }

  async getPoolHealth(poolAddress: string): Promise<HealthMetrics> {
    return await this.factoryContract.methods.getPoolHealthMetrics(poolAddress).call()
  }

  // Pool operations
  async fundPool(poolAddress: string, amount: string) {
    return await this.factoryContract.methods.fundPool(poolAddress, amount).send()
  }

  async withdrawFromPool(poolAddress: string, amount: string) {
    return await this.factoryContract.methods.withdrawFromPool(poolAddress, amount).send()
  }

  async depositCollateral(poolAddress: string, amount: string) {
    return await this.factoryContract.methods.depositCollateral(poolAddress, amount).send()
  }

  async disburseLoan(poolAddress: string) {
    return await this.factoryContract.methods.disburseLoan(poolAddress).send()
  }

  async repayLoan(poolAddress: string, amount: string) {
    return await this.factoryContract.methods.repayLoan(poolAddress).send({ value: amount })
  }

  // Event listeners
  onPoolCreated(callback: (event: any) => void) {
    this.factoryContract.events.PoolCreated().on('data', callback)
  }

  onPoolFunded(callback: (event: any) => void) {
    this.factoryContract.events.PoolFunded().on('data', callback)
  }

  onLoanDisbursed(callback: (event: any) => void) {
    this.factoryContract.events.LoanDisbursed().on('data', callback)
  }

  onLoanRepaid(callback: (event: any) => void) {
    this.factoryContract.events.LoanRepaid().on('data', callback)
  }

  // Utility functions
  async isLoanDefaulted(poolAddress: string): Promise<boolean> {
    return await this.factoryContract.methods.isLoanDefaulted(poolAddress).call()
  }

  async getPoolInfo(poolAddress: string) {
    return await this.factoryContract.methods.getPoolInfo(poolAddress).call()
  }
}

// React hook for using the lending protocol
import { useState, useEffect, useCallback } from 'react'

export function useLendingProtocol(provider: any) {
  const [protocol, setProtocol] = useState<LendingProtocol | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (provider) {
      try {
        const lendingProtocol = new LendingProtocol(provider)
        setProtocol(lendingProtocol)
        setError(null)
      } catch (err) {
        setError('Failed to initialize lending protocol')
        console.error(err)
      }
    }
  }, [provider])

  const createPool = useCallback(async (params: any) => {
    if (!protocol) throw new Error('Protocol not initialized')
    setLoading(true)
    try {
      const result = await protocol.createPool(params)
      return result
    } finally {
      setLoading(false)
    }
  }, [protocol])

  const fundPool = useCallback(async (poolAddress: string, amount: string) => {
    if (!protocol) throw new Error('Protocol not initialized')
    setLoading(true)
    try {
      return await protocol.fundPool(poolAddress, amount)
    } finally {
      setLoading(false)
    }
  }, [protocol])

  const getPools = useCallback(async () => {
    if (!protocol) throw new Error('Protocol not initialized')
    return await protocol.getAllPools()
  }, [protocol])

  return {
    protocol,
    loading,
    error,
    createPool,
    fundPool,
    getPools,
  }
}