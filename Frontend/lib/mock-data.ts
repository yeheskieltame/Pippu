/**
 * Mock Data for Pippu Lending Demo
 * Realistic data for demonstration purposes
 */

import { Address } from 'viem';

// Mock user portfolio data
export const mockPortfolio = {
  totalValue: 12450.50,
  totalSupplied: 9250.00,
  totalBorrowed: 3200.00,
  interestEarned: 125.50,
  netAPY: 8.5,
  healthFactor: 1.8,
  availableToBorrow: 2850.00,
  totalCollateral: 15000.00,
};

// Mock liquidity pools
export const mockPools = [
  {
    id: '1',
    tokenAddress: '0x4200000000000000000000000000000000000006' as Address,
    tokenSymbol: 'WETH',
    tokenName: 'Wrapped Ether',
    decimals: 18,
    totalLiquidity: 2500000.50,
    totalBorrowed: 1250000.25,
    supplyAPY: 4.5,
    borrowAPY: 6.2,
    utilizationRate: 50.0,
    availableLiquidity: 1250000.25,
    userSupplied: 5000.00,
    userBorrowed: 1500.00,
    canSupply: true,
    canBorrow: true,
    collateralFactor: 0.8,
    price: 2850.50,
    priceChange24h: 2.5,
    icon: '🔷',
  },
  {
    id: '2',
    tokenAddress: '0x036CBD5429286c61B3596927D7A3A475f7b3EE9c' as Address,
    tokenSymbol: 'USDC',
    tokenName: 'USD Coin',
    decimals: 6,
    totalLiquidity: 5000000.00,
    totalBorrowed: 2000000.00,
    supplyAPY: 6.8,
    borrowAPY: 9.5,
    utilizationRate: 40.0,
    availableLiquidity: 3000000.00,
    userSupplied: 4250.00,
    userBorrowed: 1700.00,
    canSupply: true,
    canBorrow: true,
    collateralFactor: 0.85,
    price: 1.00,
    priceChange24h: 0.1,
    icon: '💵',
  },
  {
    id: '3',
    tokenAddress: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA' as Address,
    tokenSymbol: 'USDbC',
    tokenName: 'Base USD',
    decimals: 6,
    totalLiquidity: 1800000.00,
    totalBorrowed: 720000.00,
    supplyAPY: 7.2,
    borrowAPY: 10.1,
    utilizationRate: 40.0,
    availableLiquidity: 1080000.00,
    userSupplied: 0.00,
    userBorrowed: 0.00,
    canSupply: true,
    canBorrow: true,
    collateralFactor: 0.85,
    price: 1.00,
    priceChange24h: -0.2,
    icon: '💰',
  },
];

// Mock transaction history
export const mockTransactions = [
  {
    id: '1',
    type: 'supply' as const,
    tokenSymbol: 'WETH',
    tokenAmount: '1.5',
    usdValue: 4275.75,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'completed' as const,
    hash: '0x1234...5678' as Address,
    poolId: '1',
    description: 'Supplied 1.5 WETH',
  },
  {
    id: '2',
    type: 'borrow' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '2000',
    usdValue: 2000.00,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'completed' as const,
    hash: '0x8765...4321' as Address,
    poolId: '2',
    description: 'Borrowed 2000 USDC',
  },
  {
    id: '3',
    type: 'repay' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '500',
    usdValue: 500.00,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'completed' as const,
    hash: '0x9876...1234' as Address,
    poolId: '2',
    description: 'Repaid 500 USDC',
  },
  {
    id: '4',
    type: 'withdraw' as const,
    tokenSymbol: 'WETH',
    tokenAmount: '0.8',
    usdValue: 2280.40,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    status: 'completed' as const,
    hash: '0x5432...8765' as Address,
    poolId: '1',
    description: 'Withdrew 0.8 WETH',
  },
  {
    id: '5',
    type: 'supply' as const,
    tokenSymbol: 'USDC',
    tokenAmount: '4250',
    usdValue: 4250.00,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    status: 'completed' as const,
    hash: '0x2468...1357' as Address,
    poolId: '2',
    description: 'Supplied 4250 USDC',
  },
  {
    id: '6',
    type: 'pending' as const,
    tokenSymbol: 'USDbC',
    tokenAmount: '1000',
    usdValue: 1000.00,
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: 'pending' as const,
    hash: undefined,
    poolId: '3',
    description: 'Supplying 1000 USDbC',
  },
];

// Mock market statistics
export const mockMarketStats = {
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
export const mockUserStats = {
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
export const mockBorrowingPower = {
  totalCollateral: 15000.00,
  totalBorrows: 3200.00,
  availableToBorrow: 2850.00,
  healthFactor: 1.8,
  borrowLimitUsed: 52.9,
  riskLevel: 'low' as const,
};

// Token icons and colors
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