import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import type { Address } from 'viem';

// Contract addresses on Base Sepolia
export const CONTRACT_ADDRESSES = {
  LENDING_FACTORY: '0x977C91fEed2d4FF77AEeeD1bFb2a6f51b2A518F5' as Address,
} as const;

// Token addresses on Base Sepolia
export const TOKEN_ADDRESSES = {
  WETH: '0x4200000000000000000000000000000000000006' as Address,
  USDC: '0x036CBD5429286c61B3596927D7A3A475f7b3EE9c' as Address,
  USDbC: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA' as Address,
} as const;

// Token metadata
export const TOKEN_METADATA = {
  [TOKEN_ADDRESSES.WETH]: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  },
  [TOKEN_ADDRESSES.USDC]: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  [TOKEN_ADDRESSES.USDbC]: {
    symbol: 'USDbC',
    name: 'Base USD',
    decimals: 6,
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
  USDbC: 6,
} as const;

// Type exports
export type TokenType = keyof typeof TOKEN_ADDRESSES;
export type NetworkConfig = typeof NETWORK_CONFIG.baseSepolia;