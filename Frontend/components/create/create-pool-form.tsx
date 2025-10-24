"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { formatCurrency } from "@/lib/utils/format"
import { formatTokenAmount } from "@/lib/utils"
import { TokenSelect } from "@/components/common/token-select"
import { Web3ErrorBoundary } from "@/components/common/web3-error-boundary"
import { CreatePoolTransaction } from "@/components/create/create-pool-transaction"
import { MOCK_TOKEN_CONFIG, MOCK_TOKEN_METADATA } from "@/lib/constants/mock-tokens"
import { type Address, parseUnits } from "viem"
import { useReadContract } from "wagmi"

export function CreatePoolForm() {
  const { isConnected, address } = useAccount()

  // Fix hydration by using useEffect for client-side only state
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    collateralToken: MOCK_TOKEN_CONFIG.mWETH as Address,
    loanToken: MOCK_TOKEN_CONFIG.mUSDC as Address,
    collateralAmount: 1,
    loanAmountRequested: 2000,
    interestRate: 12, // 12% annually
    loanDuration: 30, // 30 days
    riskLevel: "Medium" as "Low" | "Medium" | "High"
  })

  const [poolCreated, setPoolCreated] = useState(false)
  const [createdPoolAddress, setCreatedPoolAddress] = useState<Address | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get user balance for collateral token using useReadContract (working version)
  const { data: collateralBalance } = useReadContract({
    address: formData.collateralToken,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 3
    }
  })

  
  // Get token decimals from metadata - using mock tokens
  const getTokenDecimals = (tokenAddress: Address) => {
    const tokenMetadata = {
      [MOCK_TOKEN_CONFIG.mWETH]: 18,
      [MOCK_TOKEN_CONFIG.mUSDC]: 6,
      [MOCK_TOKEN_CONFIG.mDAI]: 18,
    }
    return tokenMetadata[tokenAddress] || 18
  }

  // Get token metadata for display
  const getTokenMetadata = (tokenAddress: Address) => {
    return MOCK_TOKEN_METADATA[tokenAddress] || {
      symbol: "UNKNOWN",
      name: "Unknown Token",
      decimals: 18,
      color: "#gray",
      icon: ""
    }
  }

  
  // ETH price will be fetched from oracle in production
  // For MVP, using temporary price - TODO: Replace with price oracle
  const getETHPrice = () => 3835.61; // Temporary fallback
  const MAX_LTV = 0.7 // 70%

  const collateralValue = formData.collateralAmount * getETHPrice()
  const maxLoanAmount = collateralValue * MAX_LTV
  const isValidLoanAmount = formData.loanAmountRequested <= maxLoanAmount

  // Proper balance checking with decimal precision using parseUnits
  const collateralDecimals = getTokenDecimals(formData.collateralToken)
  const hasSufficientBalance = collateralBalance
    ? collateralBalance >= parseUnits(formData.collateralAmount.toString(), collateralDecimals)
    : false

  // Form validation
  const isFormValid =
    formData.name &&
    formData.description &&
    isValidLoanAmount &&
    hasSufficientBalance

  // Handle pool creation success
  const handlePoolCreated = (poolAddress: Address) => {
    setPoolCreated(true)
    setCreatedPoolAddress(poolAddress)
    setError(null)
  }

  // Handle pool creation error
  const handlePoolError = (error: Error) => {
    setError(error.message)
    setPoolCreated(false)
    setCreatedPoolAddress(null)
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      collateralToken: MOCK_TOKEN_CONFIG.mWETH,
      loanToken: MOCK_TOKEN_CONFIG.mUSDC,
      collateralAmount: 1,
      loanAmountRequested: 2000,
      interestRate: 12,
      loanDuration: 30,
      riskLevel: "Medium"
    })
    setPoolCreated(false)
    setCreatedPoolAddress(null)
    setError(null)
  }

  
  if (!isConnected) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Create Pool</h3>
        <p className="text-center text-neutral-600">Please connect your wallet to create a pool</p>
      </div>
    )
  }

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) {
    return null // Return null instead of skeleton to avoid hydration mismatch
  }

  return (
    <Web3ErrorBoundary>
      <div className="card-glass animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-6">Create Pool</h3>

      <div className="space-y-6">
        {/* Pool Information */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Pool Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              placeholder="e.g., My Home Renovation Loan"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              placeholder="Describe the purpose of your loan..."
              rows={3}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Risk Level
            </label>
            <select
              value={formData.riskLevel}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                riskLevel: e.target.value as "Low" | "Medium" | "High"
              }))}
              className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>

        {/* Collateral Information */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
          <h4
            className="text-sm font-semibold text-purple-900 mb-4"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Collateral Information
          </h4>
          <div className="space-y-3">
            <TokenSelect
              selectedToken={formData.collateralToken}
              onTokenSelect={(token) => setFormData(prev => ({ ...prev, collateralToken: token }))}
              label="Collateral Asset"
            />
            <div>
              <label className="block text-xs text-purple-800 mb-1">Collateral Amount</label>
              <input
                type="number"
                value={formData.collateralAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, collateralAmount: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/70 rounded-xl border border-purple-200 focus:border-purple-400 focus:outline-none"
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-purple-800">
                Collateral Value: {formatCurrency(collateralValue)}
              </div>
              <div className="text-xs text-purple-800">
                Your Balance: {collateralBalance ? formatTokenAmount(collateralBalance, getTokenDecimals(formData.collateralToken)) : '0.00'} {getTokenMetadata(formData.collateralToken).symbol}
              </div>
              {!hasSufficientBalance && (
                <div className="text-xs text-red-600 font-medium">
                  ⚠️ Insufficient balance
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loan Terms */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
          <h4
            className="text-sm font-semibold text-green-900 mb-4"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Loan Terms
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-green-800 mb-1">Loan Amount (USDC)</label>
              <input
                type="number"
                value={formData.loanAmountRequested}
                onChange={(e) => setFormData(prev => ({ ...prev, loanAmountRequested: Number(e.target.value) }))}
                className={`w-full px-3 py-2 bg-white/70 rounded-xl border ${
                  isValidLoanAmount ? 'border-green-200' : 'border-red-300 focus:border-red-400'
                } focus:outline-none`}
                min="100"
                max={maxLoanAmount}
                required
              />
              {!isValidLoanAmount && (
                <p className="text-xs text-red-600 mt-1">
                  Maximum: {formatCurrency(maxLoanAmount)} (70% of collateral)
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs text-green-800 mb-1">Interest Rate (Annual)</label>
              <input
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/70 rounded-xl border border-green-200 focus:border-green-400 focus:outline-none"
                min="1"
                max="20"
                step="0.1"
                required
              />
              <span className="text-xs text-green-800">{formData.interestRate}% per year</span>
            </div>
            <div>
              <label className="block text-xs text-green-800 mb-1">Loan Duration</label>
              <select
                value={formData.loanDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, loanDuration: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/70 rounded-xl border border-green-200 focus:border-green-400 focus:outline-none"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <h4
            className="text-sm font-semibold text-blue-900 mb-3"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Pool Summary
          </h4>
          <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            <div className="flex justify-between">
              <span className="text-blue-800">Collateral:</span>
              <span className="font-bold text-blue-600">
                {formData.collateralAmount} {getTokenMetadata(formData.collateralToken).symbol} ({formatCurrency(collateralValue)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Loan Amount:</span>
              <span className="font-bold text-blue-600">
                {formData.loanAmountRequested} {getTokenMetadata(formData.loanToken).symbol} ({formatCurrency(formData.loanAmountRequested)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">LTV Ratio:</span>
              <span className="font-bold text-blue-600">
                {((formData.loanAmountRequested / collateralValue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Interest Rate:</span>
              <span className="font-bold text-blue-600">{formData.interestRate}% APY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Total Repayment:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(formData.loanAmountRequested * (1 + (formData.interestRate / 100) * (formData.loanDuration / 365)))}
              </span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <h4
            className="text-xs font-semibold text-yellow-900 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Important Terms
          </h4>
          <ul className="text-xs text-yellow-800 space-y-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            <li>• Your {getTokenMetadata(formData.collateralToken).symbol} will be locked as collateral until loan repayment</li>
            <li>• Maximum loan is 70% of collateral value</li>
            <li>• Interest accrues daily based on annual rate</li>
            <li>• Late payments may result in collateral liquidation</li>
            <li>• Pool must be funded by investors before you can borrow</li>
          </ul>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Error:</span> {error}
            </p>
            <button
              onClick={handleReset}
              className="mt-3 w-full px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {poolCreated && createdPoolAddress && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800 font-medium">
              🎉 Pool created successfully!
            </p>
            <div className="mt-2 space-y-2">
              <p className="text-xs text-green-700">
                <strong>Pool Address:</strong> {createdPoolAddress}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-green-700">
                  <strong>Network:</strong> Base Sepolia Testnet
                </p>
                <a
                  href={`https://sepolia.basescan.org/address/${createdPoolAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:text-green-800 underline"
                >
                  View on Explorer
                </a>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Create Another Pool
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!poolCreated && (
          <CreatePoolTransaction
            params={{
              name: formData.name,
              description: formData.description,
              collateralToken: formData.collateralToken,
              loanToken: formData.loanToken,
              collateralAmount: formData.collateralAmount,
              loanAmountRequested: formData.loanAmountRequested,
              interestRate: formData.interestRate,
              loanDuration: formData.loanDuration,
              riskLevel: formData.riskLevel
            }}
            onSuccess={handlePoolCreated}
            onError={handlePoolError}
            disabled={!isFormValid}
          />
        )}
      </div>
      </div>
    </Web3ErrorBoundary>
  )
}