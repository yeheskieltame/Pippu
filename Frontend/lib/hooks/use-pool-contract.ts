/**
 * Pool Hook - Direct Smart Contract Integration
 * Mengambil data pool langsung dari smart contract dengan wagmi
 */

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { Address } from 'viem';
import { LENDING_FACTORY_ABI } from '@/lib/abi/lending-factory';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { Pool } from '@/lib/types';

// Transform data dari getMultiplePoolsInfo ke Pool interface
const transformPoolData = (poolInfo: any, index: number): Pool => {
  console.log(`Transforming pool data ${index}:`, poolInfo);

  // Handle both array and object formats
  let poolAddress, borrower, collateralAssetAddress, loanAssetAddress, interestRate, name, active;

  if (Array.isArray(poolInfo)) {
    [poolAddress, borrower, collateralAssetAddress, loanAssetAddress, interestRate, name, active] = poolInfo;
  } else {
    // If it's an object, try to extract properties
    poolAddress = poolInfo.poolAddress || poolInfo[0];
    borrower = poolInfo.borrower || poolInfo[1];
    collateralAssetAddress = poolInfo.collateralAsset || poolInfo[2];
    loanAssetAddress = poolInfo.loanAsset || poolInfo[3];
    interestRate = poolInfo.interestRate || poolInfo[4];
    name = poolInfo.name || poolInfo[5];
    active = poolInfo.active !== undefined ? poolInfo.active : poolInfo[6];
  }

  // Determine asset details based on address
  const getAssetDetails = (assetAddress: Address) => {
    if (assetAddress.toLowerCase().includes('4200000000000000000000000000000000000006'.toLowerCase())) {
      return {
        address: assetAddress as Address,
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        amount: '0',
        usdValue: 0,
        icon: '/icons/weth.png',
      };
    } else if (assetAddress.toLowerCase().includes('77c4a1cD22005b67Eb9CcEaE7E9577188d7Bca82'.toLowerCase())) {
      return {
        address: assetAddress as Address,
        symbol: 'mUSDC',
        name: 'Mock USD Coin',
        decimals: 6,
        amount: '0',
        usdValue: 0,
        icon: '/icons/usdc.png',
      };
    } else {
      // Default asset
      return {
        address: assetAddress as Address,
        symbol: 'TOKEN',
        name: 'Token',
        decimals: 18,
        amount: '0',
        usdValue: 0,
        icon: '/icons/token.png',
      };
    }
  };

  const collateralAsset = getAssetDetails(collateralAssetAddress);
  const loanAsset = getAssetDetails(loanAssetAddress);

  return {
    id: (poolAddress as Address) || `pool-${index}`,
    poolAddress: poolAddress as Address,
    name: name || `Pool ${index + 1}`,
    description: `${name || 'Pool'} - ${(Number(interestRate) / 100).toFixed(1)}% APY`,
    borrower: borrower as Address,
    category: 'lending',
    riskLevel: Number(interestRate) <= 5 ? 'Low' :
               Number(interestRate) <= 15 ? 'Medium' : 'High' as 'Low' | 'Medium' | 'High',
    collateralAsset,
    loanAsset,
    terms: {
      interestRate: Number(interestRate),
      loanDuration: 30 * 24 * 60 * 60, // 30 days in seconds
      ltvRatio: 70,
      maxLoanAmount: '0',
      fixedRate: true,
    },
    metrics: {
      totalCollateral: '0',
      totalLiquidity: '0', // Will be updated when getPoolInfo is called
      totalLoaned: '0', // Will be updated when getPoolDetails is called
      utilizationRate: 0, // Will be updated when getPoolDetails is called
      tvl: '0', // Will be updated when getPoolInfo is called
      supplyAPY: Number(interestRate) / 100,
      activeLenders: 0,
    },
    status: {
      active: Boolean(active),
      loanDisbursed: false, // Will be updated when getPoolDetails is called
      loanRepaid: false,
      defaulted: false,
      fundingComplete: false,
    },
    timeline: {
      createdAt: new Date(),
      loanDisbursedAt: null,
      loanDueDate: null,
      lastActivity: new Date(),
    },
    userSupplied: 0,
    userBorrowed: 0,
    canSupply: Boolean(active),
    canBorrow: Boolean(active),
  };
};

/**
 * Hook untuk mengambil semua pool dari smart contract
 */
export function usePoolsFromContract() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all pool addresses
  const { data: poolAddresses, isLoading: isLoadingAddresses, error: addressesError } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getAllPools',
    args: [],
  });

  // Get detailed pool information
  const { data: poolsInfo, isLoading: isLoadingInfo, error: infoError } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getMultiplePoolsInfo',
    args: poolAddresses ? [poolAddresses] : undefined,
    query: {
      enabled: !!poolAddresses && Array.isArray(poolAddresses) && poolAddresses.length > 0,
    }
  });

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (addressesError) {
      setError(`Failed to fetch pool addresses: ${addressesError.message}`);
      setIsLoading(false);
      return;
    }

    if (infoError) {
      setError(`Failed to fetch pool info: ${infoError.message}`);
      setIsLoading(false);
      return;
    }

    if (isLoadingAddresses || isLoadingInfo) {
      return;
    }

    if (!poolAddresses || !Array.isArray(poolAddresses) || poolAddresses.length === 0) {
      console.log('No pools found from contract');
      setPools([]);
      setIsLoading(false);
      return;
    }

    if (!poolsInfo) {
      console.log('No pool info found from contract');
      setPools([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Pool addresses:', poolAddresses);
      console.log('Pool info:', poolsInfo);

      // Check if poolsInfo is iterable and has the right structure
      if (Array.isArray(poolsInfo)) {
        // Transform contract data to Pool interface
        const transformedPools: Pool[] = poolsInfo.map((poolInfo: any[], index) => {
          console.log(`Processing pool ${index}:`, poolInfo);
          return transformPoolData(poolInfo, index);
        });

        setPools(transformedPools);
        console.log('Successfully loaded pools:', transformedPools.length);
      } else {
        console.error('poolsInfo is not an array:', typeof poolsInfo, poolsInfo);
        setError('Pool info data is not in the expected format');
      }
    } catch (err) {
      console.error('Error transforming pool data:', err);
      console.error('poolsInfo type:', typeof poolsInfo);
      console.error('poolsInfo value:', poolsInfo);
      setError(`Error transforming pool data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [poolAddresses, poolsInfo, isLoadingAddresses, isLoadingInfo, addressesError, infoError]);

  return { pools, isLoading, error };
}

/**
 * Hook untuk mengambil detail pool tertentu
 */
export function usePoolDetails(poolAddress: Address | undefined) {
  const [poolDetails, setPoolDetails] = useState<any>(null);
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get pool details
  const { data: details, isLoading: isLoadingDetails, error: detailsError } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getPoolDetails',
    args: poolAddress ? [poolAddress] : undefined,
    query: {
      enabled: !!poolAddress,
    }
  });

  // Get pool TVL info
  const { data: info, isLoading: isLoadingInfo, error: infoError } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getPoolInfo',
    args: poolAddress ? [poolAddress] : undefined,
    query: {
      enabled: !!poolAddress,
    }
  });

  useEffect(() => {
    if (!poolAddress) return;

    setIsLoading(true);
    setError(null);

    if (detailsError) {
      setError(`Failed to fetch pool details: ${detailsError.message}`);
      setIsLoading(false);
      return;
    }

    if (infoError) {
      setError(`Failed to fetch pool info: ${infoError.message}`);
      setIsLoading(false);
      return;
    }

    if (isLoadingDetails || isLoadingInfo) {
      return;
    }

    setPoolDetails(details);
    setPoolInfo(info);
    setIsLoading(false);
  }, [poolAddress, details, info, isLoadingDetails, isLoadingInfo, detailsError, infoError]);

  return { poolDetails, poolInfo, isLoading, error };
}