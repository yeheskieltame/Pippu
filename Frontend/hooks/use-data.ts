/**
 * Data Access Hooks
 * Professional hooks for accessing data from repositories
 * Easy to switch between mock and real contract data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Address } from 'viem';
import { mockDataStore } from '@/lib/data/mock-repository';
import { createContractDataStore } from '@/lib/data/contract-repository';
import { Pool, PoolFilters, SortOption, CreatePoolParams } from '@/lib/types';

// Configuration: Switch between mock and real data
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

// Get appropriate data store
const dataStore = USE_MOCK_DATA ? mockDataStore : createContractDataStore();

// Query keys for React Query
const QUERY_KEYS = {
  pools: ['pools'],
  pool: (id: string) => ['pools', id],
  poolByAddress: (address: Address) => ['pools', 'address', address],
  transactions: ['transactions'],
  userPortfolio: (address: Address) => ['portfolio', address],
} as const;

// ============================================================================
// POOL HOOKS
// ============================================================================

/**
 * Hook for fetching pools with optional filtering and sorting
 */
export function usePools(filters?: PoolFilters, sort?: SortOption) {
  return useQuery({
    queryKey: [...QUERY_KEYS.pools, filters, sort],
    queryFn: () => dataStore.pools.getPools(filters, sort),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

/**
 * Hook for fetching a single pool by ID
 */
export function usePool(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.pool(id),
    queryFn: () => dataStore.pools.getPoolById(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

/**
 * Hook for fetching a pool by contract address
 */
export function usePoolByAddress(address: Address) {
  return useQuery({
    queryKey: QUERY_KEYS.poolByAddress(address),
    queryFn: () => dataStore.pools.getPoolByAddress(address),
    enabled: !!address,
    staleTime: 30000,
  });
}

/**
 * Hook for creating a new pool
 */
export function useCreatePool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreatePoolParams) => dataStore.pools.createPool(params),
    onSuccess: (newPool) => {
      // Invalidate pools query to refresh the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pools });

      // Add the new pool to the cache
      queryClient.setQueryData(QUERY_KEYS.pool(newPool.id), newPool);
    },
    onError: (error) => {
      console.error('Failed to create pool:', error);
    },
  });
}

/**
 * Hook for updating pool information
 */
export function useUpdatePool(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Pool>) => dataStore.pools.updatePool(id, updates),
    onSuccess: (updatedPool) => {
      // Update the specific pool in cache
      queryClient.setQueryData(QUERY_KEYS.pool(id), updatedPool);

      // Invalidate pools list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pools });
    },
    onError: (error) => {
      console.error('Failed to update pool:', error);
    },
  });
}

// ============================================================================
// TRANSACTION HOOKS
// ============================================================================

/**
 * Hook for fetching transactions
 */
export function useTransactions(userId?: Address, poolId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.transactions, userId, poolId],
    queryFn: () => dataStore.transactions.getTransactions(userId, poolId),
    staleTime: 15000, // 15 seconds
    refetchInterval: 30000, // 30 seconds
  });
}

/**
 * Hook for adding a new transaction
 */
export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Omit<any, 'id'>) =>
      dataStore.transactions.addTransaction(transaction),
    onSuccess: (newTransaction) => {
      // Invalidate transactions query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
    },
    onError: (error) => {
      console.error('Failed to add transaction:', error);
    },
  });
}

// ============================================================================
// USER HOOKS
// ============================================================================

/**
 * Hook for fetching user portfolio
 */
export function useUserPortfolio(address: Address) {
  return useQuery({
    queryKey: QUERY_KEYS.userPortfolio(address),
    queryFn: () => dataStore.users.getUserPortfolio(address),
    enabled: !!address,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

/**
 * Hook for fetching user statistics
 */
export function useUserStats(address: Address) {
  return useQuery({
    queryKey: ['userStats', address],
    queryFn: () => dataStore.users.getUserStats(address),
    enabled: !!address,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook for fetching user borrowing power
 */
export function useBorrowingPower(address: Address) {
  return useQuery({
    queryKey: ['borrowingPower', address],
    queryFn: () => dataStore.users.getBorrowingPower(address),
    enabled: !!address,
    staleTime: 30000,
  });
}

// ============================================================================
// MARKET HOOKS
// ============================================================================

/**
 * Hook for fetching market statistics
 */
export function useMarketStats() {
  return useQuery({
    queryKey: ['marketStats'],
    queryFn: () => dataStore.market.getMarketStats(),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
}

/**
 * Hook for fetching historical data
 */
export function useHistoricalData(asset: string, period: string) {
  return useQuery({
    queryKey: ['historicalData', asset, period],
    queryFn: () => dataStore.market.getHistoricalData(asset, period),
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for prefetching data (useful for optimistic UI updates)
 */
export function usePrefetchPool() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.pool(id),
      queryFn: () => dataStore.pools.getPoolById(id),
      staleTime: 30000,
    });
  };
}

/**
 * Hook for invalidating queries (useful for manual refreshes)
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidatePools: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pools }),
    invalidatePool: (id: string) => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pool(id) }),
    invalidateTransactions: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions }),
    invalidateUserPortfolio: (address: Address) =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userPortfolio(address) }),
    invalidateMarketStats: () => queryClient.invalidateQueries({ queryKey: ['marketStats'] }),
  };
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  return {
    updatePoolOptimistically: (id: string, updates: Partial<Pool>) => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: QUERY_KEYS.pool(id) });

      // Snapshot the previous value
      const previousPool = queryClient.getQueryData<Pool>(QUERY_KEYS.pool(id));

      // Optimistically update to the new value
      queryClient.setQueryData(QUERY_KEYS.pool(id), (old: Pool | undefined) =>
        old ? { ...old, ...updates } : undefined
      );

      // Return a context object with the snapshotted value
      return { previousPool };
    },

    rollbackPool: (id: string, previousPool: Pool | undefined) => {
      queryClient.setQueryData(QUERY_KEYS.pool(id), previousPool);
    },
  };
}