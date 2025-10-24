/**
 * Pippu Lending Protocol - Contract Integration
 *
 * Professional contract integration with:
 * - Type safety with TypeScript
 * - Comprehensive error handling
 * - Optimized queries with caching
 * - Clean separation of concerns
 */

// Re-export everything from the new structure
export * from './abi/index';
export * from './constants';
export * from './utils/index';
export * from './hooks/useLendingFactory';
export * from './hooks/useLiquidityPool';
export * from './hooks/useTransaction';

// Convenience exports for backward compatibility
export { useLendingFactory } from './hooks/useLendingFactory';
export { useLiquidityPool, useERC20 } from './hooks/useLiquidityPool';
export { useTransaction, useTransactions } from './hooks/useTransaction';
export {
  formatTokenAmount,
  parseTokenAmount,
  formatAddress,
  formatInterestRate,
  formatTokenWithSymbol,
  formatCurrency,
  formatDuration,
  copyToClipboard,
} from './utils/index';
export {
  CONTRACT_ADDRESSES,
  TOKEN_ADDRESSES,
  TOKEN_METADATA,
  publicClient,
  PROTOCOL_CONFIG,
} from './constants';