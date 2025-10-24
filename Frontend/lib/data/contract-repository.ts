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
      console.log('getPools called from contract repository');

      // Return empty array for now - this will be handled by hooks directly
      // The hooks will use wagmi's useReadContract to call the smart contract functions
      console.warn('Contract repository getPools: Using direct contract calls from hooks instead');
      return [];
    } catch (error) {
      console.error('Failed to fetch pools from contract:', error);
      console.warn('Falling back to empty array due to contract error');
      // Return empty array for now - in production you might want fallback data
      return [];
    }
  }

  async getPoolById(id: string) {
    try {
      // Treat the ID as a pool address and get detailed information
      return await this.getPoolByAddress(id as Address);
    } catch (error) {
      console.error('Failed to get pool by ID:', error);
      return null;
    }
  }

  async getPoolByAddress(address: Address) {
    try {
      // Check if we're in a browser environment with wagmi available
      if (typeof window === 'undefined') {
        console.warn('Contract repository called in SSR environment, returning null');
        return null;
      }

      const wagmiClient = (window as any).wagmiClient;
      if (!wagmiClient) {
        console.warn('Wagmi client not available, falling back to pools array');
        const pools = await this.getPools();
        return pools.find(pool => pool.poolAddress === address) || null;
      }

      // Get pool details and info in parallel
      const [poolDetails, poolInfo] = await Promise.all([
        wagmiClient.readContract({
          address: CONTRACT_ADDRESSES.LENDING_FACTORY,
          abi: LENDING_FACTORY_ABI,
          functionName: 'getPoolDetails',
          args: [address],
        }),
        wagmiClient.readContract({
          address: CONTRACT_ADDRESSES.LENDING_FACTORY,
          abi: LENDING_FACTORY_ABI,
          functionName: 'getPoolInfo',
          args: [address],
        })
      ]);

      // Get basic pool info from getAllPools to get name and other basic info
      const poolAddresses = await wagmiClient.readContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'getAllPools',
        args: [],
      });

      const poolsInfo = await wagmiClient.readContract({
        address: CONTRACT_ADDRESSES.LENDING_FACTORY,
        abi: LENDING_FACTORY_ABI,
        functionName: 'getMultiplePoolsInfo',
        args: [poolAddresses],
      });

      // Find the specific pool info from the array
      const poolBasicInfo = poolsInfo.find((info: any[]) =>
        info[0].toLowerCase() === address.toLowerCase()
      );

      if (!poolBasicInfo) {
        console.warn('Pool basic info not found for address:', address);
        return null;
      }

      // Extract basic info: [poolAddress, owner, collateralAsset, loanAsset, interestRate, name, active]
      const [
        poolAddress,
        borrower,
        collateralAssetAddress,
        loanAssetAddress,
        interestRate,
        name,
        active
      ] = poolBasicInfo as any[];

      // Extract details: {collateralAsset, loanAsset, totalCollateral, totalLiquidity, totalLoaned, interestRate, loanActive, loanAmount, utilizationRate}
      const {
        collateralAsset: detailsCollateralAsset,
        loanAsset: detailsLoanAsset,
        totalCollateral,
        totalLiquidity,
        totalLoaned,
        interestRate: detailsInterestRate,
        loanActive,
        loanAmount,
        utilizationRate
      } = poolDetails as any;

      // Extract info: {tvl}
      const { tvl } = poolInfo as any;

      // Determine asset details
      const getAssetDetails = (assetAddress: Address) => {
        if (assetAddress.toLowerCase().includes('4200000000000000000000000000000000000006'.toLowerCase())) {
          return {
            address: assetAddress as Address,
            symbol: 'WETH',
            name: 'Wrapped Ether',
            decimals: 18,
            amount: '0',
            usdValue: 0,
            icon: '/icons/weth.png',
          };
        } else if (assetAddress.toLowerCase().includes('77c4a1cD22005b67Eb9CcEaE7E9577188d7Bca82'.toLowerCase())) {
          return {
            address: assetAddress as Address,
            symbol: 'mUSDC',
            name: 'Mock USD Coin',
            decimals: 6,
            amount: '0',
            usdValue: 0,
            icon: '/icons/usdc.png',
          };
        } else {
          return {
            address: assetAddress as Address,
            symbol: 'TOKEN',
            name: 'Token',
            decimals: 18,
            amount: '0',
            usdValue: 0,
            icon: '/icons/token.png',
          };
        }
      };

      const collateralAsset = getAssetDetails(collateralAssetAddress);
      const loanAsset = getAssetDetails(loanAssetAddress);

      return {
        id: poolAddress,
        poolAddress: poolAddress as Address,
        name: name || 'Pool',
        description: `${name || 'Pool'} - ${(Number(interestRate) / 100).toFixed(1)}% APY`,
        borrower: borrower as Address,
        category: 'lending',
        riskLevel: Number(interestRate) <= 5 ? 'Low' :
                   Number(interestRate) <= 15 ? 'Medium' : 'High' as 'Low' | 'Medium' | 'High',
        collateralAsset,
        loanAsset,
        terms: {
          interestRate: Number(interestRate),
          loanDuration: 30 * 24 * 60 * 60, // 30 days in seconds
          ltvRatio: 70,
          maxLoanAmount: '0',
          fixedRate: true,
        },
        metrics: {
          totalCollateral: totalCollateral?.toString() || '0',
          totalLiquidity: totalLiquidity?.toString() || '0',
          totalLoaned: totalLoaned?.toString() || '0',
          utilizationRate: Number(utilizationRate) || 0,
          tvl: tvl?.toString() || '0',
          supplyAPY: Number(interestRate) / 100,
          activeLenders: 0,
        },
        status: {
          active: Boolean(active),
          loanDisbursed: Boolean(loanActive),
          loanRepaid: false,
          defaulted: false,
          fundingComplete: Number(totalLiquidity) > 0,
        },
        timeline: {
          createdAt: new Date(),
          loanDisbursedAt: Boolean(loanActive) ? new Date() : null,
          loanDueDate: null,
          lastActivity: new Date(),
        },
        userSupplied: 0,
        userBorrowed: 0,
        canSupply: Boolean(active),
        canBorrow: Boolean(active) && !Boolean(loanActive),
      };
    } catch (error) {
      console.error('Failed to get pool by address:', error);
      // Fallback to pools array if detailed fetch fails
      try {
        const pools = await this.getPools();
        return pools.find(pool => pool.poolAddress === address) || null;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return null;
      }
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