"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useReadContract } from "wagmi"
import { type Address } from "viem"
import { LENDING_FACTORY_ABI } from "@/lib/abi/lending-factory"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { formatCurrency, formatPercent } from "@/lib/utils/format"
import { Web3ErrorBoundary } from "@/components/common/web3-error-boundary"
import { MOCK_TOKEN_METADATA } from "@/lib/constants/mock-tokens"
import { TokenIcon } from "@/components/common/token-icon"

// Get token metadata helper
function getTokenMetadata(tokenAddress: Address) {
  return MOCK_TOKEN_METADATA[tokenAddress] || {
    symbol: "UNKNOWN",
    name: "Unknown Token",
    decimals: 18,
    color: "#gray",
    icon: ""
  }
}

interface PoolCardProps {
  poolAddress: Address
  onSelect?: (poolAddress: Address) => void
  isSelected?: boolean
  onDepositClick?: (poolAddress: Address, collateralToken: Address) => void
  onBorrowClick?: (poolAddress: Address, availableToBorrow: number, interestRate: number) => void
}

export function PoolCard({ poolAddress, onSelect, isSelected, onDepositClick, onBorrowClick }: PoolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Read pool details from contract
  const { data: poolDetails, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'getPoolDetails',
    args: [poolAddress],
    query: {
      enabled: !!poolAddress
    }
  })

  // Read pool info to get pool name
  const { data: poolInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.LENDING_FACTORY,
    abi: LENDING_FACTORY_ABI,
    functionName: 'poolInfos',
    args: [poolAddress],
    query: {
      enabled: !!poolAddress
    }
  })

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-pink-200 shadow-lg animate-pulse">
        <div className="h-4 bg-pink-200 rounded w-1/3 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (!poolDetails) {
    return null
  }

  // Extract pool details from response
  const [
    collateralAsset,
    loanAsset,
    totalCollateral,
    totalLiquidity,
    totalLoaned,
    interestRate,
    loanActive,
    loanAmount,
    utilizationRate
  ] = poolDetails as [
    Address,
    Address,
    bigint,
    bigint,
    bigint,
    bigint,
    boolean,
    bigint,
    bigint
  ]

  // ETH price assumption for MVP
  const ETH_PRICE = 3835.61
  const MAX_LTV = 0.7

  // Calculate values
  const collateralValue = (Number(totalCollateral) / Math.pow(10, 18)) * ETH_PRICE
  const maxBorrow = collateralValue * MAX_LTV
  const availableLiquidity = Number(totalLiquidity) / Math.pow(10, 6)
  const borrowCapacity = maxBorrow - (Number(totalLoaned) / Math.pow(10, 6))
  const available = Math.min(availableLiquidity, borrowCapacity)
  const interestRatePercent = Number(interestRate) / 100
  const utilizationPercent = Number(utilizationRate) / 100

  // Get token metadata
  const collateralMetadata = getTokenMetadata(collateralAsset)
  const loanMetadata = getTokenMetadata(loanAsset)

  // Get pool name from poolInfo
  const poolName = poolInfo && poolInfo[5] ? poolInfo[5] as string : `${collateralMetadata.symbol} Pool`

  const handleCardClick = () => {
    setIsExpanded(!isExpanded)
    onSelect?.(poolAddress)
  }

  return (
    <Web3ErrorBoundary>
      <div
        className={`
          bg-white/80 backdrop-blur-sm rounded-3xl border-2 shadow-lg transition-all duration-300 cursor-pointer
          hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
          ${isExpanded
            ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 min-h-[400px]'
            : 'border-pink-200 hover:border-pink-300'
          }
          ${isSelected ? 'ring-4 ring-pink-300 ring-opacity-50' : ''}
        `}
        onClick={handleCardClick}
      >
        {/* Compact View */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <TokenIcon
                  icon={collateralMetadata.icon}
                  symbol={collateralMetadata.symbol}
                  color={collateralMetadata.color}
                  size="large"
                />
                <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                  {poolName}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                  {formatPercent(interestRatePercent)} APR
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Collateral Value</p>
              <p className="text-lg font-bold text-pink-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                {formatCurrency(collateralValue)}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-pink-50 rounded-2xl p-3">
              <p className="text-xs text-pink-600 mb-1">Available to Borrow</p>
              <p className="text-sm font-bold text-pink-700" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                {formatCurrency(available)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-3">
              <p className="text-xs text-purple-600 mb-1">Utilization</p>
              <p className="text-sm font-bold text-purple-700" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                {formatPercent(utilizationPercent)}
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${loanActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-gray-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                {loanActive ? 'Loan Active' : 'No Active Loan'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TokenIcon
                  icon={loanMetadata.icon}
                  symbol={loanMetadata.symbol}
                  color={loanMetadata.color}
                  size="small"
                />
              <span className="text-xs text-gray-600">{loanMetadata.symbol}</span>
            </div>
          </div>

          {/* Expand/Collapse Indicator */}
          <div className="flex justify-center mt-4">
            <svg
              className={`w-5 h-5 text-pink-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="border-t border-pink-200 p-6 animate-fade-in">
            <div className="space-y-6">
              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-2xl p-4">
                  <p className="text-xs text-gray-600 mb-2">Total Collateral</p>
                  <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    {(Number(totalCollateral) / Math.pow(10, 18)).toFixed(4)} ETH
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(collateralValue)}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4">
                  <p className="text-xs text-gray-600 mb-2">Max Borrowing Power</p>
                  <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    {formatCurrency(maxBorrow)}
                  </p>
                  <p className="text-xs text-gray-500">70% LTV</p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4">
                  <p className="text-xs text-gray-600 mb-2">Total Liquidity</p>
                  <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    {(Number(totalLiquidity) / Math.pow(10, 6)).toFixed(2)} USDC
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4">
                  <p className="text-xs text-gray-600 mb-2">Total Loaned</p>
                  <p className="text-lg font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    {(Number(totalLoaned) / Math.pow(10, 6)).toFixed(2)} USDC
                  </p>
                </div>
              </div>

              {/* Loan Details */}
              {loanActive && (
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 border border-pink-200">
                  <h4 className="font-bold text-sm text-pink-900 mb-3" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    Active Loan Details
                  </h4>
                  <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                    <div className="flex justify-between">
                      <span className="text-pink-800">Loan Amount:</span>
                      <span className="font-bold text-pink-700">
                        {(Number(loanAmount) / Math.pow(10, 6)).toFixed(2)} USDC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-800">Interest Rate:</span>
                      <span className="font-bold text-pink-700">
                        {formatPercent(interestRatePercent)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDepositClick?.(poolAddress, collateralAsset)
                  }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-pink-600 hover:to-rose-600"
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  💝 Deposit Collateral
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onBorrowClick?.(poolAddress, available, interestRatePercent)
                  }}
                  disabled={available <= 0}
                  className={`
                    py-3 px-4 rounded-2xl font-semibold shadow-lg transform transition-all duration-200
                    ${available > 0
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-xl hover:-translate-y-0.5 hover:from-purple-600 hover:to-indigo-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
                >
                  💰 Borrow Funds
                </button>
              </div>

              {/* Pool Info */}
              <div className="bg-gray-50 rounded-2xl p-3">
                <p className="text-xs text-gray-500 text-center" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
                  Pool Address: {poolAddress.slice(0, 8)}...{poolAddress.slice(-6)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Web3ErrorBoundary>
  )
}