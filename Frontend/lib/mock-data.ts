/**
 * Mock Data for Pippu Lending Demo
 * Realistic data for isolated lending pools demonstration
 * This file maintains backward compatibility while using new types
 */

import { Address } from 'viem';
import { Pool, Transaction, UserPortfolio, UserStats, BorrowingPower, MarketStats } from './types';

// Mock user portfolio data
export const mockPortfolio: UserPortfolio = {
  totalValue: 12450.50,
  totalSupplied: 9250.00,
  totalBorrowed: 3200.00,
  interestEarned: 125.50,
  netAPY: 8.5,
  healthFactor: 1.8,
  availableToBorrow: 2850.00,
  totalCollateral: 15000.00,
};

// Mock isolated lending pools with business names and realistic scenarios
export const mockPools: Pool[] = [
  {
    id: '1',
    poolAddress: '0x1234567890abcdef1234567890abcdef12345678' as Address,
    name: 'TechNova Ventures - Seed Round',
    description: 'AI-powered SaaS platform development and market expansion',
    borrower: '0xabcdef1234567890abcdef1234567890abcdef12' as Address,
    category: 'Technology',
    riskLevel: 'Medium',

    // Collateral details
    collateralAsset: {
      address: '0x4200000000000000000000000000000000000006' as Address,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      amount: '1500000000000000000', // 1.5 WETH
      usdValue: 4275.75,
      icon: '🔷',
    },

    // Loan details
    loanAsset: {
      address: '0x036CBD5429286c61B3596927D7A3A475f7b3EE9c' as Address,
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      amount: '1050000000', // 1,050,000 USDC
      usdValue: 1050000.00,
      icon: '💵',
    },

    // Pool terms
    terms: {
      interestRate: 1500, // 15% annual (basis points)
      loanDuration: 31536000, // 365 days
      ltvRatio: 70, // 70% max LTV
      maxLoanAmount: '1050000000',
      fixedRate: true,
    },

    // Pool metrics
    metrics: {
      totalCollateral: '1500000000000000000',
      totalLiquidity: '2000000000', // 2M USDC provided by lenders
      totalLoaned: '1050000000', // 1.05M USDC disbursed
      utilizationRate: 52.5, // 52.5%
      tvl: '950000000', // 950K USDC remaining
      supplyAPY: 15.0,
      activeLenders: 8,
    },

    // Status
    status: {
      active: true,
      loanDisbursed: true,
      loanRepaid: false,
      defaulted: false,
      fundingComplete: true,
    },

    // User participation
    userSupplied: 5000.00,
    userBorrowed: 0.00,
    canSupply: false, // Funding complete
    canBorrow: false, // Not borrower

    // Timeline
    timeline: {
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      loanDisbursedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      loanDueDate: new Date(Date.now() + 340 * 24 * 60 * 60 * 1000), // Due in 340 days
      lastActivity: new Date(),
    },
  },
  {
    id: '2',
    poolAddress: '0x2345678901bcdef12345678901bcdef123456789' as Address,
    name: 'GlobalFashion Retail - Q4 Inventory',
    description: 'Working capital for holiday season inventory procurement',
    borrower: '0xbcdef12345678901bcdef12345678901bcdef123' as Address,
    category: 'E-commerce',
    riskLevel: 'Low',

    // Collateral details
    collateralAsset: {
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA' as Address,
      symbol: 'USDbC',
      name: 'Base USD',
      decimals: 6,
      amount: '500000000', // 500K USDbC
      usdValue: 500000.00,
      icon: '💰',
    },

    // Loan details
    loanAsset: {
      address: '0x036CBD5429286c61B3596927D7A3A475f7b3EE9c' as Address,
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      amount: '350000000', // 350K USDC
      usdValue: 350000.00,
      icon: '💵',
    },

    // Pool terms
    terms: {
      interestRate: 1000, // 10% annual
      loanDuration: 15552000, // 180 days (6 months)
      ltvRatio: 70,
      maxLoanAmount: '350000000',
      fixedRate: true,
    },

    // Pool metrics
    metrics: {
      totalCollateral: '500000000',
      totalLiquidity: '400000000', // 400K USDC total
      totalLoaned: '350000000', // 350K USDC disbursed
      utilizationRate: 87.5,
      tvl: '50000000', // 50K USDC remaining
      supplyAPY: 10.0,
      activeLenders: 12,
    },

    // Status
    status: {
      active: true,
      loanDisbursed: true,
      loanRepaid: false,
      defaulted: false,
      fundingComplete: true,
    },

    // User participation
    userSupplied: 4250.00,
    userBorrowed: 1700.00,
    canSupply: false, // Almost fully funded
    canBorrow: false, // Not the borrower

    // Timeline
    timeline: {
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      loanDisbursedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
      loanDueDate: new Date(Date.now() + 140 * 24 * 60 * 60 * 1000), // Due in 140 days
      lastActivity: new Date(),
    },
  },
  {
    id: '3',
    poolAddress: '0x3456789012cdef123456789012cdef1234567890' as Address,
    name: 'DeFi Protocol X - VC Round',
    description: 'Decentralized finance protocol development and security audits',
    borrower: '0xcdef123456789012cdef123456789012cdef1234' as Address,
    category: 'DeFi/Web3',
    riskLevel: 'High',

    // Collateral details
    collateralAsset: {
      address: '0x4200000000000000000000000000000000000006' as Address,
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      amount: '500000000000000000', // 0.5 WETH
      usdValue: 1425.25,
      icon: '🔷',
    },

    // Loan details
    loanAsset: {
      address: '0x036CBD5429286c61B3596927D7A3A475f7b3EE9c' as Address,
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      amount: '100000000', // 100K USDC
      usdValue: 100000.00,
      icon: '💵',
    },

    // Pool terms
    terms: {
      interestRate: 2000, // 20% annual (high risk)
      loanDuration: 63072000, // 2 years
      ltvRatio: 70,
      maxLoanAmount: '100000000',
      fixedRate: true,
    },

    // Pool metrics
    metrics: {
      totalCollateral: '500000000000000000',
      totalLiquidity: '120000000', // 120K USDC target
      totalLoaned: '0', // Not yet funded
      utilizationRate: 0.0,
      tvl: '120000000', // 120K USDC available
      supplyAPY: 20.0,
      activeLenders: 2,
    },

    // Status
    status: {
      active: true,
      loanDisbursed: false,
      loanRepaid: false,
      defaulted: false,
      fundingComplete: false, // Still open for funding
    },

    // User participation
    userSupplied: 0.00,
    userBorrowed: 0.00,
    canSupply: true, // Open for funding
    canBorrow: false, // Not the borrower

    // Timeline
    timeline: {
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      loanDisbursedAt: null, // Not yet
      loanDueDate: null, // Will be set when loan is disbursed
      lastActivity: new Date(),
    },
  },
];

// Mock transaction history with realistic pool-based transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'supply' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '5000',
    usdValue: 5000.00,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'completed' as const,
    hash: '0x1234...5678' as Address,
    poolId: '1',
    poolName: 'TechNova Ventures - Seed Round',
    description: 'Funded TechNova Ventures loan pool',
  },
  {
    id: '2',
    type: 'supply' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '4250',
    usdValue: 4250.00,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'completed' as const,
    hash: '0x8765...4321' as Address,
    poolId: '2',
    poolName: 'GlobalFashion Retail - Q4 Inventory',
    description: 'Funded GlobalFashion inventory pool',
  },
  {
    id: '3',
    type: 'borrow' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '1700',
    usdValue: 1700.00,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'completed' as const,
    hash: '0x9876...1234' as Address,
    poolId: '2',
    poolName: 'GlobalFashion Retail - Q4 Inventory',
    description: 'Borrowed from GlobalFashion pool',
  },
  {
    id: '4',
    type: 'repay' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '500',
    usdValue: 500.00,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    status: 'completed' as const,
    hash: '0x5432...8765' as Address,
    poolId: '2',
    poolName: 'GlobalFashion Retail - Q4 Inventory',
    description: 'Repaid GlobalFashion loan',
  },
  {
    id: '5',
    type: 'supply' as const,
    tokenSymbol: 'USDbC',
    tokenAmount: '500000',
    usdValue: 500000.00,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    status: 'completed' as const,
    hash: '0x2468...1357' as Address,
    poolId: '2',
    poolName: 'GlobalFashion Retail - Q4 Inventory',
    description: 'Added collateral to GlobalFashion pool',
  },
  {
    id: '6',
    type: 'supply' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '1000',
    usdValue: 1000.00,
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: 'pending' as const,
    hash: undefined,
    poolId: '3',
    poolName: 'DeFi Protocol X - VC Round',
    description: 'Funding DeFi Protocol X development',
  },
];

// Mock market statistics
export const mockMarketStats: MarketStats = {
  totalValueLocked: 9300000.50,
  totalBorrows: 3970000.25,
  totalSupply: 9300000.50,
  averageSupplyAPY: 6.2,
  averageBorrowAPY: 8.6,
  utilizationRate: 42.7,
  activeUsers: 2847,
  totalTransactions: 15634,
  marketCap: 25000000.00,
  volume24h: 450000.00,
};

// Mock user statistics
export const mockUserStats: UserStats = {
  totalDeposits: 28,
  totalWithdrawals: 15,
  totalBorrows: 12,
  totalRepays: 10,
  averagePositionSize: 3250.00,
  totalInterestEarned: 1250.50,
  totalInterestPaid: 245.75,
  firstInteraction: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  accountAge: 30, // days
};

// Mock borrowing power calculation
export const mockBorrowingPower: BorrowingPower = {
  totalCollateral: 15000.00,
  totalBorrows: 3200.00,
  availableToBorrow: 2850.00,
  healthFactor: 1.8,
  borrowLimitUsed: 52.9,
  riskLevel: 'low' as const,
};

// Helper functions for getting pool information
export const getPoolName = (poolId: string): string => {
  const pool = mockPools.find(p => p.id === poolId);
  return pool?.name || 'Unknown Pool';
};

export const getPoolIcon = (poolId: string): string => {
  const pool = mockPools.find(p => p.id === poolId);
  return pool?.loanAsset.icon || '🪙';
};

export const getPoolInfo = (poolId: string) => {
  const pool = mockPools.find(p => p.id === poolId);
  if (!pool) return null;

  return {
    name: pool.name,
    description: pool.description,
    category: pool.category,
    riskLevel: pool.riskLevel,
    loanAsset: pool.loanAsset,
    collateralAsset: pool.collateralAsset,
    terms: pool.terms,
    metrics: pool.metrics,
    status: pool.status,
  };
};

// Token icons and colors (still useful for asset displays)
export const tokenMetadata = {
  '0x4200000000000000000000000000000000000006': {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    icon: '🔷',
    color: '#627EEA',
  },
  '0x036CBD5429286c61B3596927D7A3A475f7b3EE9c': {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    color: '#2775CA',
  },
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA': {
    symbol: 'USDbC',
    name: 'Base USD',
    icon: '💰',
    color: '#0052FF',
  },
};

// Interest rate curves (mock data for visualization)
export const mockInterestRateCurves = {
  WETH: {
    optimalUtilization: 80,
    baseRate: 2,
    slope1: 4,
    slope2: 20,
  },
  USDC: {
    optimalUtilization: 80,
    baseRate: 4,
    slope1: 6,
    slope2: 30,
  },
  USDbC: {
    optimalUtilization: 80,
    baseRate: 5,
    slope1: 8,
    slope2: 40,
  },
};

// Mock price history for charts
export const mockPriceHistory = {
  WETH: [
    { timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, price: 2820.50 },
    { timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, price: 2845.20 },
    { timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, price: 2835.80 },
    { timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, price: 2865.40 },
    { timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, price: 2855.90 },
    { timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, price: 2875.30 },
    { timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, price: 2850.50 },
  ],
  USDC: [
    { timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, price: 1.00 },
    { timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, price: 1.00 },
    { timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, price: 1.00 },
    { timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, price: 1.00 },
    { timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, price: 1.00 },
    { timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, price: 1.00 },
    { timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, price: 1.00 },
  ],
};