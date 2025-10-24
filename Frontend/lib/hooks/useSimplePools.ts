"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"
import { Address } from "viem"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"

export interface SimplePool {
  id: string
  address: Address
  name: string
  borrower: Address
  totalCollateral: string
  totalLiquidity: string
  totalLoaned: string
  interestRate: number
  loanActive: boolean
  loanAmount: string
  utilizationRate: number
}

/**
 * Simple pool data hook for debugging
 */
export function useSimplePools() {
  const { isConnected, address } = useAccount()
  const [pools, setPools] = useState<SimplePool[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get all pools
  const { data: allPools } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getAllPools',
    query: {
      enabled: isConnected,
    },
  })

  // Get pool info for each pool
  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (!allPools || !Array.isArray(allPools)) {
        console.log('No pools found or invalid format:', allPools)
        setIsLoading(false)
        return
      }

      console.log('Found pools:', allPools.length, allPools)

      const poolDetails: SimplePool[] = []

      for (let i = 0; i < allPools.length; i++) {
        try {
          const poolAddress = allPools[i] as Address

          // Get pool info
          const response = await fetch('/api/pools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ poolAddress })
          })

          if (response.ok) {
            const poolData = await response.json()
            poolDetails.push({
              id: poolAddress,
              address: poolAddress,
              name: poolData.name || `Pool ${i + 1}`,
              borrower: poolData.borrower || '0x0000000000000000000000000000000000000000000',
              totalCollateral: poolData.totalCollateral || '0',
              totalLiquidity: poolData.totalLiquidity || '0',
              totalLoaned: poolData.totalLoaned || '0',
              interestRate: poolData.interestRate || 0,
              loanActive: poolData.loanActive || false,
              loanAmount: poolData.loanAmount || '0',
              utilizationRate: poolData.utilizationRate || 0,
            })
          }
        } catch (error) {
          console.error(`Failed to fetch details for pool ${i}:`, error)
        }
      }

      setPools(poolDetails)
      setIsLoading(false)
    }

    if (allPools && Array.isArray(allPools)) {
      fetchPoolDetails()
    } else {
      setIsLoading(false)
    }
  }, [allPools])

  return {
    pools,
    isLoading,
    refetch: () => {
      setIsLoading(true)
      setPools([])
    }
  }
}