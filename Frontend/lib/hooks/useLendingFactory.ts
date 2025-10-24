import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { getContract } from 'viem';
import { LENDING_FACTORY_ABI } from '../abi/lending-factory';
import { CONTRACT_ADDRESSES, publicClient } from '../constants';
import type { Address } from 'viem';

/**
 * Hook for interacting with LendingFactory contract
 */
export function useLendingFactory() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Read functions
  const getAllPools = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getAllPools',
      query: {
        enabled: isConnected,
        refetchInterval: 30000, // Refetch every 30 seconds
      },
    });
  };

  const getActivePools = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getActivePools',
      query: {
        enabled: isConnected,
        refetchInterval: 30000,
      },
    });
  };

  const getPoolCount = () => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getPoolCount',
      query: {
        enabled: isConnected,
        refetchInterval: 30000,
      },
    });
  };

  const getPoolInfo = (poolAddress: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getPoolInfo',
      args: [poolAddress],
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const getPoolDetails = (poolAddress: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getPoolDetails',
      args: [poolAddress],
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const getUserPools = (userAddress?: Address) => {
    const targetAddress = userAddress || address;
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getUserPools',
      args: [targetAddress || '0x0000000000000000000000000000000000000000'],
      query: {
        enabled: isConnected && !!targetAddress,
        refetchInterval: 30000,
      },
    });
  };

  const getPoolTVL = (poolAddress: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getPoolTVL',
      args: [poolAddress],
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const getProviderBalance = (poolAddress: Address, providerAddress?: Address) => {
    const targetAddress = providerAddress || address;
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getProviderBalance',
      args: [poolAddress, targetAddress || '0x0000000000000000000000000000000000000000'],
      query: {
        enabled: isConnected && !!poolAddress && !!targetAddress,
        refetchInterval: 30000,
      },
    });
  };

  const calculateInterest = (poolAddress: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'calculateInterest',
      args: [poolAddress],
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  const isLoanDefaulted = (poolAddress: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'isLoanDefaulted',
      args: [poolAddress],
      query: {
        enabled: isConnected && !!poolAddress,
        refetchInterval: 30000,
      },
    });
  };

  // Write functions
  const createPool = async (params: {
    collateralAsset: Address;
    loanAsset: Address;
    collateralAmount: bigint;
    loanAmount: bigint;
    interestRate: number;
    loanDuration: number;
    description: string;
    name: string;
  }) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'createPoolWithMetadata',
      args: [
        params.collateralAsset,
        params.loanAsset,
        params.collateralAmount,
        params.loanAmount,
        BigInt(params.interestRate),
        BigInt(params.loanDuration),
        params.description,
        params.name,
      ],
    });
  };

  const fundPool = async (poolAddress: Address, amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'fundPool',
      args: [poolAddress, amount],
    });
  };

  const withdrawFromPool = async (poolAddress: Address, amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'withdrawFromPool',
      args: [poolAddress, amount],
    });
  };

  const depositCollateral = async (poolAddress: Address, amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'depositCollateral',
      args: [poolAddress, amount],
    });
  };

  const disburseLoan = async (poolAddress: Address) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'disburseLoan',
      args: [poolAddress],
    });
  };

  const repayLoan = async (poolAddress: Address, amount: bigint) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return writeContractAsync({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'repayLoan',
      args: [poolAddress],
      value: amount,
    });
  };

  return {
    // Read functions
    getAllPools,
    getActivePools,
    getPoolCount,
    getPoolInfo,
    getPoolDetails,
    getUserPools,
    getPoolTVL,
    getProviderBalance,
    calculateInterest,
    isLoanDefaulted,

    // Write functions
    createPool,
    fundPool,
    withdrawFromPool,
    depositCollateral,
    disburseLoan,
    repayLoan,

    // Contract state
    isConnected,
    address,
  };
}

/**
 * Direct contract access (for non-React usage)
 */
export function getLendingFactoryContract() {
  return getContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    client: publicClient,
  });
}