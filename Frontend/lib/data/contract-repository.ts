/**
 * Production Contract Repository Implementation
 * Connects to real smart contracts using wagmi
 * Shows the exact same interface as mock repository
 */

import { Address } from 'viem';
import { IPoolRepository, ITransactionRepository, IUserRepository, IMarketRepository, Pool, Transaction } from '../types';
import { LENDING_FACTORY_ABI, LIQUIDITY_POOL_ABI, ERC20_ABI } from '../abi';
import { CONTRACT_ADDRESSES } from '../constants';

// ============================================================================
// PRODUCTION POOL REPOSITORY
// ============================================================================

export class ContractPoolRepository implements IPoolRepository {
  async getPools(filter?: any, sort?: any) {
    try {
      // Check if we're in a browser environment with wagmi available
      if (typeof window === 'undefined') {
        console.warn('Contract repository called in SSR environment, returning empty array');
        return [];
      }

      // Try to access wagmi from window (simpler approach for now)
      // In a real implementation, you'd inject the wagmi client or config
      const wagmiClient = (window as any).wagmiClient;
      if (!wagmiClient) {
        console.warn('Wagmi client not available, falling back to mock data');
        return [];
      }

      // Get pools from factory contract
      const pools = await wagmiClient.readContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'getActivePoolsPaginated',
        args: [0, 50], // offset, limit
      });

      if (!pools || !Array.isArray(pools) || pools.length === 0) {
        console.warn('No pools found from contract, returning empty array');
        return [];
      }

      const poolsData = pools[0] as any[];

      // Transform contract data to Pool interface
      const transformedPools: Pool[] = poolsData.map((poolData, index) => ({
        id: poolData.poolAddress || `pool-${index}`,
        poolAddress: poolData.poolAddress,
        name: poolData.name || `Pool ${index + 1}`,
        description: poolData.description || '',
        borrower: '0x0000000000000000000000000000000000000000' as Address, // Would get from contract
        category: 'lending',
        riskLevel: (poolData.riskLevel === 'Low' ? 'Low' :
                   poolData.riskLevel === 'High' ? 'High' : 'Medium') as 'Low' | 'Medium' | 'High',
        collateralAsset: {
          address: '' as Address, // Would need additional contract call to get this
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          amount: '0',
          usdValue: 0,
          icon: '/icons/eth.png',
        },
        loanAsset: {
          address: '' as Address, // Would need additional contract call to get this
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          amount: '0',
          usdValue: 0,
          icon: '/icons/usdc.png',
        },
        terms: {
          interestRate: Number(poolData.interestRate) || 0,
          loanDuration: 30 * 24 * 60 * 60, // 30 days in seconds
          ltvRatio: 70,
          maxLoanAmount: '0',
          fixedRate: true,
        },
        metrics: {
          totalCollateral: '0',
          totalLiquidity: poolData.tvl?.toString() || '0',
          totalLoaned: poolData.totalBorrowed?.toString() || '0',
          utilizationRate: Number(poolData.utilizationRate) || 0,
          tvl: poolData.tvl?.toString() || '0',
          supplyAPY: (Number(poolData.interestRate) || 0) / 100,
          activeLenders: Number(poolData.lendersCount) || 0,
        },
        status: {
          active: poolData.active || true,
          loanDisbursed: false,
          loanRepaid: false,
          defaulted: false,
          fundingComplete: false,
        },
        timeline: {
          createdAt: new Date(),
          loanDisbursedAt: null,
          loanDueDate: null,
          lastActivity: new Date(),
        },
        userSupplied: 0,
        userBorrowed: 0,
        canSupply: poolData.active || true,
        canBorrow: poolData.active || true,
      }));

      // Apply filtering and sorting if provided
      let filteredPools = transformedPools;

      if (filter?.riskLevel) {
        filteredPools = filteredPools.filter(pool => pool.riskLevel === filter.riskLevel);
      }

      if (filter?.category) {
        filteredPools = filteredPools.filter(pool => pool.category === filter.category);
      }

      if (sort) {
        filteredPools.sort((a, b) => {
          switch (sort) {
            case 'apy':
              return b.metrics.supplyAPY - a.metrics.supplyAPY;
            case 'tvl':
              return Number(b.metrics.tvl) - Number(a.metrics.tvl);
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });
      }

      return filteredPools;
    } catch (error) {
      console.error('Failed to fetch pools from contract:', error);
      console.warn('Falling back to empty array due to contract error');
      // Return empty array for now - in production you might want fallback data
      return [];
    }
  }

  async getPoolById(id: string) {
    try {
      // For now, try to get from pools array
      const pools = await this.getPools();
      return pools.find(pool => pool.id === id) || null;
    } catch (error) {
      console.error('Failed to get pool by ID:', error);
      return null;
    }
  }

  async getPoolByAddress(address: Address) {
    try {
      const pools = await this.getPools();
      return pools.find(pool => pool.poolAddress === address) || null;
    } catch (error) {
      console.error('Failed to get pool by address:', error);
      return null;
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
  }): Promise<Pool> {
    try {
      // This would use writeContract to call createPoolWithMetadata
      // For now, throw error since write functionality not implemented
      throw new Error('Pool creation not yet implemented in contract repository');
    } catch (error) {
      console.error('Failed to create pool:', error);
      throw error;
    }
  }

  async updatePool(id: string, updates: Partial<Pool>): Promise<Pool> {
    try {
      // This would use writeContract to update pool if needed
      throw new Error('Pool updates not yet implemented in contract repository');
    } catch (error) {
      console.error('Failed to update pool:', error);
      throw error;
    }
  }
}

// ============================================================================
// TRANSACTION REPOSITORY (PRODUCTION)
// ============================================================================

export class ContractTransactionRepository implements ITransactionRepository {
  async getTransactions(userId?: Address, poolId?: string) {
    try {
      // This would read transaction logs from events using getLogs
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  async getTransactionById(id: string) {
    try {
      // This would fetch specific transaction details
      return null;
    } catch (error) {
      console.error('Failed to get transaction by ID:', error);
      return null;
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    try {
      // This would use writeContract to execute transaction
      // For now, return a mock transaction
      const newTransaction: Transaction = {
        ...transaction,
        id: Math.random().toString(36),
        timestamp: new Date(),
        hash: undefined, // Would be populated after transaction
      };
      return newTransaction;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  }
}

// ============================================================================
// USER REPOSITORY (PRODUCTION)
// ============================================================================

export class ContractUserRepository implements IUserRepository {
  async getUserPortfolio(address: Address) {
    try {
      // This would calculate from user's positions across pools
      // For now, return default values
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
    } catch (error) {
      console.error('Failed to get user portfolio:', error);
      throw error;
    }
  }

  async getUserStats(address: Address) {
    try {
      // This would fetch user statistics from contract events
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
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }

  async getBorrowingPower(address: Address) {
    try {
      // This would calculate user's borrowing power from their collateral
      return {
        totalCollateral: 0,
        totalBorrows: 0,
        availableToBorrow: 0,
        healthFactor: 1.8,
        borrowLimitUsed: 0,
        riskLevel: 'low' as const,
      };
    } catch (error) {
      console.error('Failed to get borrowing power:', error);
      throw error;
    }
  }
}

// ============================================================================
// MARKET REPOSITORY (PRODUCTION)
// ============================================================================

export class ContractMarketRepository implements IMarketRepository {
  async getMarketStats() {
    try {
      // This would aggregate from all pools
      // For now, return default values
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
    } catch (error) {
      console.error('Failed to get market stats:', error);
      throw error;
    }
  }

  async getHistoricalData(asset: string, period: string) {
    try {
      // This would read from price feeds or historical events
      return [];
    } catch (error) {
      console.error('Failed to get historical data:', error);
      throw error;
    }
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