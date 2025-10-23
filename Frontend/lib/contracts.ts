// SPDX-License-Identifier: MIT
// Contract addresses for Pippu Lending Protocol on Base Sepolia
// Update these with your actual deployed contract addresses

export const CONTRACT_ADDRESSES = {
  // Base Sepolia Testnet
  baseSepolia: {
    LENDING_FACTORY: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual deployed LendingFactory address
    // Add other contract addresses as needed
  },
  // You can add other networks here
  base: {
    LENDING_FACTORY: '0x0000000000000000000000000000000000000000', // TODO: Replace with actual deployed LendingFactory address on mainnet
  },
} as const;

// Get contract address for current network
export function getContractAddress(
  contractName: keyof typeof CONTRACT_ADDRESSES.baseSepolia,
  chainId: number
): string {
  const addresses = CONTRACT_ADDRESSES[chainId === 84532 ? 'baseSepolia' : 'base'];
  return addresses[contractName];
}

// Current network configuration
export const DEFAULT_CHAIN_ID = 84532; // Base Sepolia

// Common token addresses on Base Sepolia
export const TOKEN_ADDRESSES = {
  baseSepolia: {
    USDC: '0x036CbD542C63760e3c5F3F9d6Df9F9E5E4e4B4d1', // Example USDC on Base Sepolia
    WETH: '0x4200000000000000000000000000000000000006', // WETH on Base Sepolia
    // Add other token addresses as needed
  },
  base: {
    USDC: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDC on Base mainnet
    WETH: '0x4200000000000000000000000000000000000006', // WETH on Base mainnet
  },
} as const;