/**
 * Type definitions for Pippu Lending Protocol
 * Mirror of smart contract structures with TypeScript safety
 */

import { Address } from 'viem';

// ============================================================================
// CORE CONTRACT TYPES (Mirror of Solidity structs)
// ============================================================================

/**
 * PoolInfo struct from LendingFactory.sol
 */
export interface PoolInfo {
  poolAddress: Address;
  borrower: Address;
  collateralAsset: Address;
  loanAsset: Address;
  interestRate: number; // Basis points (10000 = 100%)
  name: string;
  active: boolean;
}

/**
 * Asset information (token details)
 */
export interface AssetInfo {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  amount: string; // Wei/satoshi format
  usdValue: number;
  icon: string;
  price?: number;
  priceChange24h?: number;
}

/**
 * Pool terms and conditions
 */
export interface PoolTerms {
  interestRate: number; // Basis points
  loanDuration: number; // Seconds
  ltvRatio: number; // Percentage (70 = 70%)
  maxLoanAmount: string; // Wei/satoshi format
  fixedRate: boolean;
}

/**
 * Pool metrics and statistics
 */
export interface PoolMetrics {
  totalCollateral: string; // Wei/satoshi format
  totalLiquidity: string; // Wei/satoshi format
  totalLoaned: string; // Wei/satoshi format
  utilizationRate: number; // Percentage
  tvl: string; // Wei/satoshi format - remaining liquidity
  supplyAPY: number; // Percentage
  activeLenders: number;
}

/**
 * Pool status information
 */
export interface PoolStatus {
  active: boolean;
  loanDisbursed: boolean;
  loanRepaid: boolean;
  defaulted: boolean;
  fundingComplete: boolean;
}

/**
 * Pool timeline information
 */
export interface PoolTimeline {
  createdAt: Date;
  loanDisbursedAt: Date | null;
  loanDueDate: Date | null;
  lastActivity: Date | null;
}

// ============================================================================
// COMBINED DATA STRUCTURES (For frontend consumption)
// ============================================================================

/**
 * Complete pool information for frontend components
 * Combines contract data with computed/display information
 */
export interface Pool {
  // Basic info
  id: string;
  poolAddress: Address;
  name: string;
  description: string;
  borrower: Address;
  category: string;
  riskLevel: 'Low' | 'Medium' | 'High';

  // Assets
  collateralAsset: AssetInfo;
  loanAsset: AssetInfo;

  // Terms and metrics
  terms: PoolTerms;
  metrics: PoolMetrics;
  status: PoolStatus;
  timeline: PoolTimeline;

  // User interaction data
  userSupplied: number;
  userBorrowed: number;
  canSupply: boolean;
  canBorrow: boolean;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionType = 'supply' | 'borrow' | 'repay' | 'withdraw';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  tokenSymbol: string;
  tokenAmount: string;
  usdValue: number;
  timestamp: Date;
  status: TransactionStatus;
  hash: Address | undefined;
  poolId: string;
  poolName: string;
  description: string;
}

// ============================================================================
// USER DATA TYPES
// ============================================================================

export interface UserPortfolio {
  totalValue: number;
  totalSupplied: number;
  totalBorrowed: number;
  interestEarned: number;
  netAPY: number;
  healthFactor: number;
  availableToBorrow: number;
  totalCollateral: number;
}

export interface UserStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalBorrows: number;
  totalRepays: number;
  averagePositionSize: number;
  totalInterestEarned: number;
  totalInterestPaid: number;
  firstInteraction: Date;
  accountAge: number; // days
}

export interface BorrowingPower {
  totalCollateral: number;
  totalBorrows: number;
  availableToBorrow: number;
  healthFactor: number;
  borrowLimitUsed: number; // percentage
  riskLevel: 'low' | 'medium' | 'high';
}

// ============================================================================
// MARKET DATA TYPES
// ============================================================================

export interface MarketStats {
  totalValueLocked: number;
  totalBorrows: number;
  totalSupply: number;
  averageSupplyAPY: number;
  averageBorrowAPY: number;
  utilizationRate: number;
  activeUsers: number;
  totalTransactions: number;
  marketCap: number;
  volume24h: number;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface PoolFilters {
  category?: string;
  riskLevel?: string;
  status?: string;
  minAPY?: number;
  maxAPY?: number;
}

export interface SortOption {
  field: keyof Pool;
  direction: 'asc' | 'desc';
}

// ============================================================================
// SMART CONTRACT INTERFACES
// ============================================================================

/**
 * Interface for contract call parameters
 */
export interface CreatePoolParams {
  name: string;
  collateralAsset: Address;
  loanAsset: Address;
  interestRate: number; // Basis points
  loanDuration: number; // Seconds
  description?: string;
  category?: string;
}

export interface SupplyParams {
  poolAddress: Address;
  amount: string;
  asset: Address;
}

export interface BorrowParams {
  poolAddress: Address;
  amount: string;
}

export interface RepayParams {
  poolAddress: Address;
  amount: string;
}

// ============================================================================
// API/STORE INTERFACES
// ============================================================================

/**
 * Interface for data repository pattern
 * This makes it easy to swap mock data with real blockchain data
 */
export interface IPoolRepository {
  getPools(filter?: PoolFilters, sort?: SortOption): Promise<Pool[]>;
  getPoolById(id: string): Promise<Pool | null>;
  getPoolByAddress(address: Address): Promise<Pool | null>;
  createPool(params: CreatePoolParams): Promise<Pool>;
  updatePool(id: string, updates: Partial<Pool>): Promise<Pool>;
}

export interface ITransactionRepository {
  getTransactions(userId?: Address, poolId?: string): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction>;
}

export interface IUserRepository {
  getUserPortfolio(address: Address): Promise<UserPortfolio>;
  getUserStats(address: Address): Promise<UserStats>;
  getBorrowingPower(address: Address): Promise<BorrowingPower>;
}

export interface IMarketRepository {
  getMarketStats(): Promise<MarketStats>;
  getHistoricalData(asset: string, period: string): Promise<any[]>;
}

/**
 * Main data store interface
 */
export interface IDataStore {
  pools: IPoolRepository;
  transactions: ITransactionRepository;
  users: IUserRepository;
  market: IMarketRepository;
}