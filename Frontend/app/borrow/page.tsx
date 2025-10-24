"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useReadContract } from "wagmi"
import { type Address } from "viem"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { BorrowHeader } from "@/components/borrow/header"
import { PoolCard } from "@/components/borrow/pool-card"
import { DepositModal } from "@/components/borrow/deposit-modal"
import { BorrowModal } from "@/components/borrow/borrow-modal"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { CONTRACT_ADDRESSES } from "@/lib/constants"

export default function BorrowPage() {
  const { isConnected, address } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [selectedPool, setSelectedPool] = useState<Address | null>(null)
  const [depositModalPool, setDepositModalPool] = useState<{ poolAddress: Address; collateralToken: Address } | null>(null)
  const [borrowModalPool, setBorrowModalPool] = useState<{ poolAddress: Address; availableToBorrow: number; interestRate: number } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user pools using getUserPools function
  const { data: userPoolAddresses, isLoading: isLoadingPools } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getUserPools',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  })

  if (!mounted) {
    return (
      <LayoutWrapper>
        <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4">
          <div className="animate-pulse">
            <div className="h-8 bg-pink-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 rounded-3xl p-6 border-2 border-pink-200 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!isConnected) {
    return (
      <LayoutWrapper>
        <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4">
          <BorrowHeader />
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border-2 border-pink-200 shadow-lg text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to view and manage your borrowing pools
            </p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (isLoadingPools) {
    return (
      <LayoutWrapper>
        <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4">
          <BorrowHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 rounded-3xl p-6 border-2 border-pink-200 shadow-lg animate-pulse">
                <div className="h-4 bg-pink-200 rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  const pools = userPoolAddresses || []

  if (pools.length === 0) {
    return (
      <LayoutWrapper>
        <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4">
          <BorrowHeader />
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border-2 border-pink-200 shadow-lg text-center">
            <div className="text-6xl mb-4">🏊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
              No Borrowing Pools Found
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have any active borrowing pools. Create a pool first to lock collateral and get access to borrowing.
            </p>
            <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200 max-w-md mx-auto">
              <h3 className="font-semibold text-pink-900 mb-2" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                How to Get Started
              </h3>
              <ul className="text-sm text-pink-800 space-y-1 text-left" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                <li>1. Create a new borrowing pool</li>
                <li>2. Deposit ETH as collateral</li>
                <li>3. Borrow USDC against your collateral</li>
                <li>4. Repay loan with interest to reclaim collateral</li>
              </ul>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4">
        <BorrowHeader />

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((poolAddress, index) => (
            <div
              key={poolAddress.toString()}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PoolCard
                poolAddress={poolAddress as Address}
                isSelected={selectedPool === poolAddress}
                onSelect={(address) => setSelectedPool(address)}
                onDepositClick={(poolAddress, collateralToken) => {
                  setDepositModalPool({ poolAddress, collateralToken })
                }}
                onBorrowClick={(poolAddress, availableToBorrow, interestRate) => {
                  setBorrowModalPool({ poolAddress, availableToBorrow, interestRate })
                }}
              />
            </div>
          ))}
        </div>

        {/* Modals */}
        {depositModalPool && (
          <DepositModal
            isOpen={true}
            onClose={() => setDepositModalPool(null)}
            poolAddress={depositModalPool.poolAddress}
            collateralToken={depositModalPool.collateralToken}
            onSuccess={(txHash) => {
              console.log('Deposit successful:', txHash)
              setDepositModalPool(null)
            }}
            onError={(error) => {
              console.error('Deposit error:', error)
            }}
          />
        )}

        {borrowModalPool && (
          <BorrowModal
            isOpen={true}
            onClose={() => setBorrowModalPool(null)}
            poolAddress={borrowModalPool.poolAddress}
            availableToBorrow={borrowModalPool.availableToBorrow}
            interestRate={borrowModalPool.interestRate}
            onSuccess={(txHash) => {
              console.log('Borrow successful:', txHash)
              setBorrowModalPool(null)
            }}
            onError={(error) => {
              console.error('Borrow error:', error)
            }}
          />
        )}
      </div>
    </LayoutWrapper>
  )
}
