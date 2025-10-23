/**
 * Production Contract Repository Implementation
 * This is how you would connect to real smart contracts
 * Shows the exact same interface as mock repository
 */

import { Address } from 'viem';
import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { IPoolRepository, ITransactionRepository, IUserRepository, IMarketRepository, Pool, Transaction } from '../types';
import { LENDING_FACTORY_ABI, LIQUIDITY_POOL_ABI } from '../abi';
import { CONTRACT_ADDRESSES } from '../constants';

// ============================================================================
// PRODUCTION POOL REPOSITORY
// ============================================================================

export class ContractPoolRepository implements IPoolRepository {
  async getPools(filter?: any, sort?: any) {
    try {
      // Read all pools from factory contract
      const pools = await readContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'getAllPools',
        args: [],
      });

      // Transform contract data to frontend format
      const transformedPools = await Promise.all(
        (pools as Address[]).map(pool => this.getPoolByAddress(pool))
      );

      // Apply filters and sorting (same logic as mock)
      let filteredPools = this.applyFilters(transformedPools, filter);
      filteredPools = this.applySorting(filteredPools, sort);

      return filteredPools;
    } catch (error) {
      console.error('Failed to fetch pools from contract:', error);
      throw error;
    }
  }

  async getPoolById(id: string) {
    try {
      // For now, treat ID as pool address directly
      // In a real implementation, you might need a different function
      return await this.getPoolByAddress(id as Address);
    } catch (error) {
      console.error('Failed to get pool by ID:', error);
      throw error;
    }
  }

  async getPoolByAddress(address: Address) {
    try {
      const poolData = await readContract({
        address,
        abi: LIQUIDITY_POOL_ABI,
        functionName: 'getPoolInfo',
        args: [],
      });

      return this.transformPoolData(poolData, address);
    } catch (error) {
      console.error('Failed to get pool by address:', error);
      throw error;
    }
  }

  async createPool(params: {
    name: string;
    collateralAsset: Address;
    loanAsset: Address;
    interestRate: number;
    loanDuration: number;
    description?: string;
    category?: string;
  }) {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'createPoolWithMetadata',
        args: [
          params.collateralAsset,
          params.loanAsset,
          '1000000000000000000', // 1 collateral amount (placeholder)
          '1000000', // 1 USDC loan amount (placeholder)
          params.interestRate,
          params.loanDuration,
          params.description || '',
          params.name
        ],
      });

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt({ hash });

      // Get the newly created pool address from event logs
      const poolCreatedEvent = receipt.logs?.find(
        (log: any) => log.eventName === 'PoolCreated'
      );

      if (!poolCreatedEvent) {
        throw new Error('Pool creation event not found');
      }

      // Access event args differently based on the actual event structure
      const poolAddress = (poolCreatedEvent as any).args?.pool || (poolCreatedEvent as any).pool;
      return await this.getPoolByAddress(poolAddress as Address);
    } catch (error) {
      console.error('Failed to create pool:', error);
      throw error;
    }
  }

  async updatePool(id: string, updates: Partial<Pool>) {
    // Pool updates happen through contract calls (supply, borrow, etc.)
    // This would be implemented based on specific update actions
    // For now, refresh the pool data
    const pool = await this.getPoolById(id);
    if (!pool) {
      throw new Error(`Pool with id ${id} not found`);
    }
    return { ...pool, ...updates };
  }

  // Private helper methods

  private async transformPoolData(poolData: any, poolAddress: Address): Promise<Pool> {
    // Transform contract data to match Pool interface
    return {
      id: poolAddress,
      poolAddress: poolAddress,
      name: 'On-chain Pool',
      description: 'Pool created on Base Sepolia',
      borrower: poolData._collateralAsset || '0x0000000000000000000000000000000000000000',
      category: 'On-chain',
      riskLevel: 'Medium',

      // Use actual contract data
      collateralAsset: await this.getAssetInfo(poolData._collateralAsset as Address),
      loanAsset: await this.getAssetInfo(poolData._loanAsset as Address),

      terms: {
        interestRate: Number(poolData._interestRate),
        loanDuration: 31536000, // Default 1 year
        ltvRatio: 70, // Fixed in contract
        maxLoanAmount: poolData._totalLoaned,
        fixedRate: true,
      },

      // Read pool metrics from contract data
      metrics: {
        totalCollateral: poolData._totalCollateral.toString(),
        totalLiquidity: poolData._totalLiquidity.toString(),
        totalLoaned: poolData._totalLoaned.toString(),
        utilizationRate: Number(poolData._utilizationRate) / 100, // Convert from basis points
        tvl: (Number(poolData._totalLiquidity) - Number(poolData._totalLoaned)).toString(),
        supplyAPY: Number(poolData._interestRate) / 100,
        activeLenders: 0, // Would need separate tracking
      },

      status: {
        active: true,
        loanDisbursed: poolData._loanActive,
        loanRepaid: false,
        defaulted: await this.isPoolDefaulted(poolAddress),
        fundingComplete: Number(poolData._totalLiquidity) > 0,
      },

      timeline: {
        createdAt: new Date(),
        loanDisbursedAt: poolData._loanActive ? new Date() : null,
        loanDueDate: null,
        lastActivity: new Date(),
      },

      userSupplied: 0,
      userBorrowed: 0,
      canSupply: true,
      canBorrow: false,
    };
  }

  private async getAssetInfo(assetAddress: Address) {
    // This would read ERC20 contract to get token details
    // For now, use known token addresses
    const { TOKEN_ADDRESSES } = await import('../constants');

    if (assetAddress.toLowerCase() === TOKEN_ADDRESSES.WETH.toLowerCase()) {
      return {
        address: assetAddress,
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        amount: '0',
        usdValue: 0,
        icon: '🔷',
        price: 2850,
        priceChange24h: 2.5,
      };
    }

    if (assetAddress.toLowerCase() === TOKEN_ADDRESSES.USDC.toLowerCase()) {
      return {
        address: assetAddress,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        amount: '0',
        usdValue: 0,
        icon: '💵',
        price: 1.0,
        priceChange24h: 0.1,
      };
    }

    if (assetAddress.toLowerCase() === TOKEN_ADDRESSES.USDbC.toLowerCase()) {
      return {
        address: assetAddress,
        symbol: 'USDbC',
        name: 'Base USD',
        decimals: 6,
        amount: '0',
        usdValue: 0,
        icon: '💰',
        price: 1.0,
        priceChange24h: -0.2,
      };
    }

    // Default fallback
    return {
      address: assetAddress,
      symbol: 'TOKEN',
      name: 'Unknown Token',
      decimals: 18,
      amount: '0',
      usdValue: 0,
      icon: '🪙',
      price: 0,
      priceChange24h: 0,
    };
  }

  private async isPoolDefaulted(poolAddress: Address): Promise<boolean> {
    try {
      const isDefaulted = await readContract({
        address: poolAddress,
        abi: LIQUIDITY_POOL_ABI,
        functionName: 'isLoanDefaulted',
        args: [],
      });
      return isDefaulted as boolean;
    } catch (error) {
      return false;
    }
  }

  // private calculateRiskLevel is unused for now, keeping as placeholder

  private applyFilters(pools: Pool[], filter?: any) {
    // Same filtering logic as mock repository
    let filteredPools = [...pools];

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

    return filteredPools;
  }

  private applySorting(pools: Pool[], sort?: any) {
    // Same sorting logic as mock repository
    if (!sort) return pools;

    return [...pools].sort((a, b) => {
      const aValue = a[sort.field as keyof Pool];
      const bValue = b[sort.field as keyof Pool];

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = (aValue as number) - (bValue as number);
      }

      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }
}

// ============================================================================
// TRANSACTION REPOSITORY (PRODUCTION STUB)
// ============================================================================

export class ContractTransactionRepository implements ITransactionRepository {
  async getTransactions(_userId?: Address, _poolId?: string) {
    // This would read transaction logs from events
    // For now, return empty array
    return [];
  }

  async getTransactionById(_id: string) {
    return null;
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    // This would emit blockchain events
    // For now, return a mock transaction
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36),
      timestamp: new Date(),
      hash: undefined, // Would be populated after transaction
    };
    return newTransaction;
  }
}

// ============================================================================
// USER REPOSITORY (PRODUCTION STUB)
// ============================================================================

export class ContractUserRepository implements IUserRepository {
  async getUserPortfolio(_address: Address) {
    // This would calculate from user's positions across pools
    return {
      totalValue: 0,
      totalSupplied: 0,
      totalBorrowed: 0,
      interestEarned: 0,
      netAPY: 0,
      healthFactor: 1.8,
      availableToBorrow: 0,
      totalCollateral: 0,
    };
  }

  async getUserStats(_address: Address) {
    return {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalBorrows: 0,
      totalRepays: 0,
      averagePositionSize: 0,
      totalInterestEarned: 0,
      totalInterestPaid: 0,
      firstInteraction: new Date(),
      accountAge: 0,
    };
  }

  async getBorrowingPower(_address: Address) {
    return {
      totalCollateral: 0,
      totalBorrows: 0,
      availableToBorrow: 0,
      healthFactor: 1.8,
      borrowLimitUsed: 0,
      riskLevel: 'low' as const,
    };
  }
}

// ============================================================================
// MARKET REPOSITORY (PRODUCTION STUB)
// ============================================================================

export class ContractMarketRepository implements IMarketRepository {
  async getMarketStats() {
    // This would aggregate from all pools
    return {
      totalValueLocked: 0,
      totalBorrows: 0,
      totalSupply: 0,
      averageSupplyAPY: 0,
      averageBorrowAPY: 0,
      utilizationRate: 0,
      activeUsers: 0,
      totalTransactions: 0,
      marketCap: 0,
      volume24h: 0,
    };
  }

  async getHistoricalData(_asset: string, _period: string) {
    // This would read from price feeds or historical events
    return [];
  }
}

// ============================================================================
// PRODUCTION DATA STORE
// ============================================================================

export class ContractDataStore {
  public readonly pools: IPoolRepository;
  public readonly transactions: ITransactionRepository;
  public readonly users: IUserRepository;
  public readonly market: IMarketRepository;

  constructor() {
    this.pools = new ContractPoolRepository();
    this.transactions = new ContractTransactionRepository();
    this.users = new ContractUserRepository();
    this.market = new ContractMarketRepository();
  }
}

// Export factory function
export const createContractDataStore = () => new ContractDataStore();