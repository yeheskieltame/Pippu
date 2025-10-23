/**
 * Mock Repository Implementation
 * Professional repository pattern that mirrors real blockchain data access
 * Easy to swap with real contract calls in production
 */

import { Address } from 'viem';
import {
  Pool,
  Transaction,
  UserPortfolio,
  UserStats,
  BorrowingPower,
  MarketStats,
  PoolFilters,
  SortOption,
  IPoolRepository,
  ITransactionRepository,
  IUserRepository,
  IMarketRepository,
  PoolInfo,
  AssetInfo,
  PoolTerms,
  PoolMetrics,
  PoolStatus,
  PoolTimeline,
  TransactionType,
  TransactionStatus
} from '../types';

// Import mock data
import { mockPools, mockTransactions, mockPortfolio, mockUserStats, mockBorrowingPower, mockMarketStats } from '../mock-data';

// ============================================================================
// POOL REPOSITORY
// ============================================================================

export class MockPoolRepository implements IPoolRepository {
  private pools: Pool[] = [];

  constructor() {
    this.pools = this.transformMockData();
  }

  /**
   * Transform mock data to match contract structure
   * This simulates how we'd transform blockchain data
   */
  private transformMockData(): Pool[] {
    return mockPools.map(pool => ({
      id: pool.id,
      poolAddress: pool.poolAddress,
      name: pool.name,
      description: pool.description,
      borrower: pool.borrower,
      category: pool.category,
      riskLevel: pool.riskLevel as 'Low' | 'Medium' | 'High',

      collateralAsset: {
        address: pool.collateralAsset.address,
        symbol: pool.collateralAsset.symbol,
        name: pool.collateralAsset.name,
        decimals: pool.collateralAsset.decimals,
        amount: pool.collateralAsset.amount,
        usdValue: pool.collateralAsset.usdValue,
        icon: pool.collateralAsset.icon,
        price: pool.collateralAsset.usdValue / parseFloat(pool.collateralAsset.amount),
        priceChange24h: Math.random() * 10 - 5 // -5% to +5%
      },

      loanAsset: {
        address: pool.loanAsset.address,
        symbol: pool.loanAsset.symbol,
        name: pool.loanAsset.name,
        decimals: pool.loanAsset.decimals,
        amount: pool.loanAsset.amount,
        usdValue: pool.loanAsset.usdValue,
        icon: pool.loanAsset.icon,
        price: pool.loanAsset.usdValue / parseFloat(pool.loanAsset.amount),
        priceChange24h: Math.random() * 2 - 1 // -1% to +1% (stablecoins)
      },

      terms: pool.terms,
      metrics: pool.metrics,
      status: pool.status,
      timeline: pool.timeline,

      userSupplied: pool.userSupplied,
      userBorrowed: pool.userBorrowed,
      canSupply: pool.canSupply,
      canBorrow: pool.canBorrow
    }));
  }

  async getPools(filter?: PoolFilters, sort?: SortOption): Promise<Pool[]> {
    let filteredPools = [...this.pools];

    // Apply filters (simulates contract filtering)
    if (filter) {
      if (filter.category) {
        filteredPools = filteredPools.filter(pool =>
          pool.category.toLowerCase().includes(filter.category!.toLowerCase())
        );
      }
      if (filter.riskLevel) {
        filteredPools = filteredPools.filter(pool => pool.riskLevel === filter.riskLevel);
      }
      if (filter.minAPY) {
        filteredPools = filteredPools.filter(pool => pool.metrics.supplyAPY >= filter.minAPY!);
      }
      if (filter.maxAPY) {
        filteredPools = filteredPools.filter(pool => pool.metrics.supplyAPY <= filter.maxAPY!);
      }
    }

    // Apply sorting
    if (sort) {
      filteredPools.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];

        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else {
          comparison = (aValue as number) - (bValue as number);
        }

        return sort.direction === 'desc' ? -comparison : comparison;
      });
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return filteredPools;
  }

  async getPoolById(id: string): Promise<Pool | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.pools.find(pool => pool.id === id) || null;
  }

  async getPoolByAddress(address: Address): Promise<Pool | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.pools.find(pool => pool.poolAddress.toLowerCase() === address.toLowerCase()) || null;
  }

  async createPool(params: {
    name: string;
    collateralAsset: Address;
    loanAsset: Address;
    interestRate: number;
    loanDuration: number;
    description?: string;
    category?: string;
  }): Promise<Pool> {
    // Simulate contract call delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const newPool: Pool = {
      id: (this.pools.length + 1).toString(),
      poolAddress: `0x${Math.random().toString(16).substr(2, 40)}` as Address,
      name: params.name,
      description: params.description || '',
      borrower: `0x${Math.random().toString(16).substr(2, 40)}` as Address,
      category: params.category || 'Other',
      riskLevel: 'Medium',

      collateralAsset: {
        address: params.collateralAsset,
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        amount: '1000000000000000000',
        usdValue: 2850,
        icon: '🔷'
      },

      loanAsset: {
        address: params.loanAsset,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        amount: '200000000',
        usdValue: 200,
        icon: '💵'
      },

      terms: {
        interestRate: params.interestRate,
        loanDuration: params.loanDuration,
        ltvRatio: 70,
        maxLoanAmount: '0',
        fixedRate: true
      },

      metrics: {
        totalCollateral: '0',
        totalLiquidity: '0',
        totalLoaned: '0',
        utilizationRate: 0,
        tvl: '0',
        supplyAPY: params.interestRate / 100,
        activeLenders: 0
      },

      status: {
        active: true,
        loanDisbursed: false,
        loanRepaid: false,
        defaulted: false,
        fundingComplete: false
      },

      timeline: {
        createdAt: new Date(),
        loanDisbursedAt: null,
        loanDueDate: null,
        lastActivity: new Date()
      },

      userSupplied: 0,
      userBorrowed: 0,
      canSupply: true,
      canBorrow: false
    };

    this.pools.push(newPool);
    return newPool;
  }

  async updatePool(id: string, updates: Partial<Pool>): Promise<Pool> {
    await new Promise(resolve => setTimeout(resolve, 150));

    const poolIndex = this.pools.findIndex(pool => pool.id === id);
    if (poolIndex === -1) {
      throw new Error(`Pool with id ${id} not found`);
    }

    this.pools[poolIndex] = { ...this.pools[poolIndex], ...updates };
    return this.pools[poolIndex];
  }
}

// ============================================================================
// TRANSACTION REPOSITORY
// ============================================================================

export class MockTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  constructor() {
    this.transactions = this.transformMockData();
  }

  private transformMockData(): Transaction[] {
    return mockTransactions.map(tx => ({
      ...tx,
      timestamp: new Date(tx.timestamp),
      poolName: tx.poolName
    }));
  }

  async getTransactions(userId?: Address, poolId?: string): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 80));

    let filteredTransactions = [...this.transactions];

    if (userId) {
      // In real implementation, filter by user address
      filteredTransactions = filteredTransactions.slice(0, 10);
    }

    if (poolId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.poolId === poolId);
    }

    return filteredTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    await new Promise(resolve => setTimeout(resolve, 30));
    return this.transactions.find(tx => tx.id === id) || null;
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const newTransaction: Transaction = {
      ...transaction,
      id: (this.transactions.length + 1).toString(),
      timestamp: new Date()
    };

    this.transactions.unshift(newTransaction);
    return newTransaction;
  }
}

// ============================================================================
// USER REPOSITORY
// ============================================================================

export class MockUserRepository implements IUserRepository {
  async getUserPortfolio(address: Address): Promise<UserPortfolio> {
    await new Promise(resolve => setTimeout(resolve, 60));
    return { ...mockPortfolio };
  }

  async getUserStats(address: Address): Promise<UserStats> {
    await new Promise(resolve => setTimeout(resolve, 60));
    return { ...mockUserStats };
  }

  async getBorrowingPower(address: Address): Promise<BorrowingPower> {
    await new Promise(resolve => setTimeout(resolve, 60));
    return { ...mockBorrowingPower };
  }
}

// ============================================================================
// MARKET REPOSITORY
// ============================================================================

export class MockMarketRepository implements IMarketRepository {
  async getMarketStats(): Promise<MarketStats> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...mockMarketStats };
  }

  async getHistoricalData(asset: string, period: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Generate mock historical data
    const points = period === '24h' ? 24 : period === '7d' ? 7 : 30;
    const data = [];
    const now = Date.now();

    for (let i = points - 1; i >= 0; i--) {
      data.push({
        timestamp: now - (i * 60 * 60 * 1000),
        price: 2850 + (Math.random() - 0.5) * 100,
        volume24h: 450000 + (Math.random() - 0.5) * 50000
      });
    }

    return data;
  }
}

// ============================================================================
// MAIN DATA STORE
// ============================================================================

export class MockDataStore {
  public readonly pools: IPoolRepository;
  public readonly transactions: ITransactionRepository;
  public readonly users: IUserRepository;
  public readonly market: IMarketRepository;

  constructor() {
    this.pools = new MockPoolRepository();
    this.transactions = new MockTransactionRepository();
    this.users = new MockUserRepository();
    this.market = new MockMarketRepository();
  }
}

// Export singleton instance
export const mockDataStore = new MockDataStore();