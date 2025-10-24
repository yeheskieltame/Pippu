import { type Address } from "viem"

// Mock token configuration for testing
// Update these addresses after deployment

export const MOCK_TOKEN_CONFIG = {
  // Deployed addresses on Base Sepolia
  mWETH: '0xE56d6914563a09dfEA35152C2C2C676796d5Da1F' as Address,
  mUSDC: '0x08dfA087a14906B37e2F358E3Dc5180538e7c303' as Address,
  mDAI: '0xfDe8EFD598DC3Dc24FBD830f37fD646141dD662B' as Address,
  faucet: '0x227C6CD7c5980523fbCf622a333f3BfE4D1848A8' as Address,
} as const;

// Mock token metadata
export const MOCK_TOKEN_METADATA = {
  [MOCK_TOKEN_CONFIG.mWETH]: {
    symbol: 'mWETH',
    name: 'Mock Wrapped Ether',
    decimals: 18,
    color: '#627EEA',
    icon: '/weth.png',
    isMock: true,
    claimAmount: '100 mWETH',
  },
  [MOCK_TOKEN_CONFIG.mUSDC]: {
    symbol: 'mUSDC',
    name: 'Mock USD Coin',
    decimals: 6,
    color: '#2775CA',
    icon: '/usdc.png',
    isMock: true,
    claimAmount: '10,000 mUSDC',
  },
  [MOCK_TOKEN_CONFIG.mDAI]: {
    symbol: 'mDAI',
    name: 'Mock DAI Stablecoin',
    decimals: 18,
    color: '#F5AC37',
    icon: '/dai.png',
    isMock: true,
    claimAmount: '10,000 mDAI',
  },
} as const;

// Default token selections for pools
export const DEFAULT_POOL_TOKENS = {
  collateral: MOCK_TOKEN_CONFIG.mWETH, // Use mWETH as collateral
  loan: MOCK_TOKEN_CONFIG.mUSDC,      // Use mUSDC as loan asset
} as const;

// Faucet configuration
export const FAUCET_CONFIG = {
  cooldown: 3600, // 1 hour in seconds
  claimAmounts: {
    [MOCK_TOKEN_CONFIG.mWETH]: 100 * 10**18, // 100 mWETH
    [MOCK_TOKEN_CONFIG.mUSDC]: 10000 * 10**6,  // 10,000 mUSDC
    [MOCK_TOKEN_CONFIG.mDAI]: 10000 * 10**18, // 10,000 mDAI
  },
} as const;

// Environment variable fallbacks
export const getMockTokenAddress = (tokenName: string): Address => {
  const envVar = `NEXT_PUBLIC_MOCK_${tokenName.toUpperCase()}`;
  const address = process.env[envVar];

  if (address && address !== '') {
    return address as Address;
  }

  // Fallback to config
  switch (tokenName.toUpperCase()) {
    case 'MWETH':
      return MOCK_TOKEN_CONFIG.mWETH;
    case 'MUSDC':
      return MOCK_TOKEN_CONFIG.mUSDC;
    case 'MDAI':
      return MOCK_TOKEN_CONFIG.mDAI;
    case 'FAUCET':
      return MOCK_TOKEN_CONFIG.faucet;
    default:
      return '0x0000000000000000000000000000000000000000' as Address;
  }
};