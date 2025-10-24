import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { Address } from 'viem'
import { CONTRACT_ADDRESSES } from '@/lib/constants'
import { LENDING_FACTORY_ABI } from '@/lib/abi/lending-factory'

// Create public client for Base Sepolia
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

export async function POST(request: NextRequest) {
  try {
    const { poolAddress } = await request.json()

    if (!poolAddress) {
      return NextResponse.json({ error: 'Pool address is required' }, { status: 400 })
    }

    console.log('Fetching pool details for:', poolAddress)

    // Get pool info from factory
    const poolInfo = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getPoolInfo',
      args: [poolAddress as Address],
    })

    console.log('Pool info:', poolInfo)

    // Get pool details
    const poolDetails = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.LENDING_FACTORY,
      abi: LENDING_FACTORY_ABI,
      functionName: 'getPoolDetails',
      args: [poolAddress as Address],
    })

    console.log('Pool details:', poolDetails)

    return NextResponse.json({
      ...poolInfo,
      totalCollateral: poolDetails[0]?.toString() || '0',
      totalLiquidity: poolDetails[1]?.toString() || '0',
      totalLoaned: poolDetails[2]?.toString() || '0',
      interestRate: Number(poolDetails[3] || 0),
      loanActive: poolDetails[4] || false,
      loanAmount: poolDetails[5]?.toString() || '0',
      utilizationRate: Number(poolDetails[6] || 0),
    })
  } catch (error) {
    console.error('Failed to fetch pool details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pool details', details: error?.message },
      { status: 500 }
    )
  }
}