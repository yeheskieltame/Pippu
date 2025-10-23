import { useWaitForTransactionReceipt } from 'wagmi';
import { useState, useCallback } from 'react';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface TransactionState {
  hash?: `0x${string}`;
  status: TransactionStatus;
  error?: Error;
  isLoading: boolean;
}

/**
 * Hook for monitoring transaction status
 */
export function useTransaction(hash?: `0x${string}`) {
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: hash ? 'pending' : 'idle',
    hash,
    isLoading: !!hash,
  });

  const {
    data: receipt,
    error,
    isLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Update state based on receipt
  if (receipt && transactionState.status === 'pending') {
    setTransactionState({
      hash,
      status: 'success',
      isLoading: false,
    });
  }

  if (error && transactionState.status !== 'error') {
    setTransactionState({
      hash,
      status: 'error',
      error,
      isLoading: false,
    });
  }

  const resetTransaction = useCallback(() => {
    setTransactionState({
      status: 'idle',
      isLoading: false,
      hash: undefined,
      error: undefined,
    });
  }, []);

  const setTransaction = useCallback((newHash: `0x${string}`) => {
    setTransactionState({
      hash: newHash,
      status: 'pending',
      isLoading: true,
      error: undefined,
    });
  }, []);

  return {
    hash,
    receipt,
    status: transactionState.status,
    error: transactionState.error,
    isLoading: isLoading || transactionState.isLoading,
    isSuccess,
    resetTransaction,
    setTransaction,
  };
}

/**
 * Hook for managing multiple transactions
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Map<string, TransactionState>>(new Map());

  const addTransaction = useCallback((hash: `0x${string}`) => {
    setTransactions(prev => new Map(prev).set(hash, {
      hash,
      status: 'pending',
      isLoading: true,
    }));
  }, []);

  const updateTransactionStatus = useCallback((hash: `0x${string}`, status: TransactionStatus, error?: Error) => {
    setTransactions(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(hash);
      if (current) {
        newMap.set(hash, {
          ...current,
          status,
          error,
          isLoading: status === 'pending',
        });
      }
      return newMap;
    });
  }, []);

  const removeTransaction = useCallback((hash: `0x${string}`) => {
    setTransactions(prev => {
      const newMap = new Map(prev);
      newMap.delete(hash);
      return newMap;
    });
  }, []);

  const clearTransactions = useCallback(() => {
    setTransactions(new Map());
  }, []);

  const pendingTransactions = Array.from(transactions.values()).filter(tx => tx.status === 'pending');

  return {
    transactions,
    addTransaction,
    updateTransactionStatus,
    removeTransaction,
    clearTransactions,
    pendingTransactions,
    pendingCount: pendingTransactions.length,
  };
}