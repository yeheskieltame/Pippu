/**
 * ABI exports for all smart contracts
 */

export { LENDING_FACTORY_ABI } from './lending-factory';
export { LIQUIDITY_POOL_ABI } from './liquidity-pool';
export { MOCK_USDC_ABI } from './MockUSDC';
export { MockWETH as MOCK_WETH_ABI } from './MockWETH';

// Standard ERC20 ABI for token operations
export const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "account", type: "address" }
    ],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

// Event topics for event filtering
export const POOL_CREATED_TOPIC = '0x...' as const; // Will be updated with actual topic