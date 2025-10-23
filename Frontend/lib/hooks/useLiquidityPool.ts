import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { getContract } from 'viem';
import { LIQUIDITY_POOL_ABI } from '../abi';
import { publicClient } from '../constants';
import type { Address } from 'viem';

/**
 * Hook for interacting with individual LiquidityPool contracts
 */
export function useLiquidityPool(poolAddress: Address) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  if (!poolAddress) {
    throw new Error('Pool address is required');
  }

  // Read functions
  const getPoolInfo = () => {
    return useReadContract({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getPoolInfo',
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const getProviderBalance = (providerAddress?: Address) => {
    return useReadContract({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getProviderBalance',
      args: [providerAddress || address || '0x0000000000000000000000000000000000000000'],
      query: {
        enabled: isConnected && !!poolAddress && !!(providerAddress || address),
        refetchInterval: 30000,
      },
    });
  };

  const getTVL = () => {
    return useReadContract({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getTVL',
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const calculateInterest = () => {
    return useReadContract({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'calculateInterest',
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const isLoanDefaulted = () => {
    return useReadContract({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'isLoanDefaulted',
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const getUtilizationRate = () => {
    return useReadContract({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'getUtilizationRate',
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  // Write functions
  const provideLiquidity = async (amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'provideLiquidity',
      args: [amount],
    });
  };

  const withdrawLiquidity = async (amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'withdrawLiquidity',
      args: [amount],
    });
  };

  const depositCollateral = async (amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'depositCollateral',
      args: [amount],
    });
  };

  const disburseLoan = async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'disburseLoan',
    });
  };

  const repayLoan = async (amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: poolAddress,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'repayLoan',
      value: amount,
    });
  };

  return {
    // Read functions
    getPoolInfo,
    getProviderBalance,
    getTVL,
    calculateInterest,
    isLoanDefaulted,
    getUtilizationRate,

    // Write functions
    provideLiquidity,
    withdrawLiquidity,
    depositCollateral,
    disburseLoan,
    repayLoan,

    // Contract state
    isConnected,
    address,
    poolAddress,
  };
}

/**
 * Hook for ERC20 token operations
 */
export function useERC20(tokenAddress: Address) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Read functions
  const balanceOf = (ownerAddress?: Address) => {
    return useReadContract({
      address: tokenAddress,
      abi: [
        {
          type: 'function',
          name: 'balanceOf',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ type: 'uint256' }],
        },
      ],
      functionName: 'balanceOf',
      args: [ownerAddress || address || '0x0000000000000000000000000000000000000000'],
      query: {
        enabled: isConnected && !!(ownerAddress || address),
        refetchInterval: 30000,
      },
    });
  };

  const allowance = (spenderAddress: Address) => {
    return useReadContract({
      address: tokenAddress,
      abi: [
        {
          type: 'function',
          name: 'allowance',
          stateMutability: 'view',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
          ],
          outputs: [{ type: 'uint256' }],
        },
      ],
      functionName: 'allowance',
      args: [address || '0x0000000000000000000000000000000000000000', spenderAddress],
      query: {
        enabled: isConnected && !!address && !!spenderAddress,
        refetchInterval: 30000,
      },
    });
  };

  const name = () => {
    return useReadContract({
      address: tokenAddress,
      abi: [
        {
          type: 'function',
          name: 'name',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'string' }],
        },
      ],
      functionName: 'name',
      query: {
        enabled: !!tokenAddress,
      },
    });
  };

  const symbol = () => {
    return useReadContract({
      address: tokenAddress,
      abi: [
        {
          type: 'function',
          name: 'symbol',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'string' }],
        },
      ],
      functionName: 'symbol',
      query: {
        enabled: !!tokenAddress,
      },
    });
  };

  const decimals = () => {
    return useReadContract({
      address: tokenAddress,
      abi: [
        {
          type: 'function',
          name: 'decimals',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'uint8' }],
        },
      ],
      functionName: 'decimals',
      query: {
        enabled: !!tokenAddress,
      },
    });
  };

  // Write functions
  const approve = async (spenderAddress: Address, amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: tokenAddress,
      abi: [
        {
          type: 'function',
          name: 'approve',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ type: 'bool' }],
        },
      ],
      functionName: 'approve',
      args: [spenderAddress, amount],
    });
  };

  const transfer = async (toAddress: Address, amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: tokenAddress,
      abi: [
        {
          type: 'function',
          name: 'transfer',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ type: 'bool' }],
        },
      ],
      functionName: 'transfer',
      args: [toAddress, amount],
    });
  };

  return {
    // Read functions
    balanceOf,
    allowance,
    name,
    symbol,
    decimals,

    // Write functions
    approve,
    transfer,

    // Contract state
    isConnected,
    address,
    tokenAddress,
  };
}

/**
 * Direct contract access (for non-React usage)
 */
export function getLiquidityPoolContract(poolAddress: Address) {
  return getContract({
    address: poolAddress,
    abi: LIQUIDITY_POOL_ABI,
    client: publicClient,
  });
}