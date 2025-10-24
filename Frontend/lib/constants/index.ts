import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import type { Address } from 'viem';
import { MOCK_TOKEN_CONFIG, MOCK_TOKEN_METADATA } from './mock-tokens';

// Contract addresses on Base Sepolia
export const CONTRACT_ADDRESSES = {
  LENDING_FACTORY: '0x977C91fEed2d4FF77AEeeD1bFb2a6f51b2A518F5' as Address,
} as const;

// Use mock tokens for development
export const TOKEN_ADDRESSES = {
  WETH: MOCK_TOKEN_CONFIG.mWETH as Address,
  USDC: MOCK_TOKEN_CONFIG.mUSDC as Address,
  DAI: MOCK_TOKEN_CONFIG.mDAI as Address,
} as const;

// Token metadata using mock tokens with icons
export const TOKEN_METADATA = {
  [TOKEN_ADDRESSES.WETH]: {
    symbol: 'mWETH',
    name: 'Mock Wrapped Ether',
    decimals: 18,
    icon: '/weth.png',
    color: '#627EEA',
  },
  [TOKEN_ADDRESSES.USDC]: {
    symbol: 'mUSDC',
    name: 'Mock USD Coin',
    decimals: 6,
    icon: '/usdc.png',
    color: '#2775CA',
  },
  [TOKEN_ADDRESSES.DAI]: {
    symbol: 'mDAI',
    name: 'Mock DAI Stablecoin',
    decimals: 18,
    icon: '/dai.png',
    color: '#F5AC37',
  },
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  baseSepolia: {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    rpcUrls: {
      default: {
        http: ['https://sepolia.base.org'],
      },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
    },
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
} as const;

// Public client for Base Sepolia
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Constants for the protocol
export const PROTOCOL_CONFIG = {
  // Interest rates are in basis points (100 = 1%)
  MIN_INTEREST_RATE: 100, // 1%
  MAX_INTEREST_RATE: 2000, // 20%
  DEFAULT_INTEREST_RATE: 500, // 5%

  // Loan durations are in seconds
  MIN_LOAN_DURATION: 60 * 60 * 24, // 1 day
  MAX_LOAN_DURATION: 60 * 60 * 24 * 365, // 1 year
  DEFAULT_LOAN_DURATION: 60 * 60 * 24 * 30, // 30 days

  // Collateral ratio
  MAX_LOAN_TO_VALUE: 7000, // 70%

  // Gas limits for transactions
  GAS_LIMITS: {
    CREATE_POOL: BigInt(3000000),
    FUND_POOL: BigInt(200000),
    WITHDRAW_FROM_POOL: BigInt(250000),
    DEPOSIT_COLLATERAL: BigInt(200000),
    DISBURSE_LOAN: BigInt(150000),
    REPAY_LOAN: BigInt(200000),
  },
} as const;

// Common token decimals
export const TOKEN_DECIMALS = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  DAI: 18,
} as const;

// Type exports
export type TokenType = keyof typeof TOKEN_ADDRESSES;
export type NetworkConfig = typeof NETWORK_CONFIG.baseSepolia;