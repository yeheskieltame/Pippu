"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useReadContract } from "wagmi"
import { type Address } from "viem"
import { MOCK_TOKEN_CONFIG, MOCK_TOKEN_METADATA } from "@/lib/constants/mock-tokens"
import { formatTokenAmount } from "@/lib/utils"
import { TokenIcon } from "./token-icon"

// ERC20 ABI for approve
const ERC20_ABI = [
  {
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const

interface TokenSelectProps {
  selectedToken?: Address
  onTokenSelect: (token: Address) => void
  spenderAddress?: Address
  requiredAmount?: bigint
  disabled?: boolean
  label?: string
}

export function TokenSelect({
  selectedToken,
  onTokenSelect,
  spenderAddress,
  requiredAmount,
  disabled = false,
  label = "Select Token"
}: TokenSelectProps) {
  const { address, isConnected } = useAccount()
  const [isApproving, setIsApproving] = useState(false)
  const { writeContract: approveToken } = useWriteContract()

  const tokens = [
    { address: MOCK_TOKEN_CONFIG.mWETH, ...MOCK_TOKEN_METADATA[MOCK_TOKEN_CONFIG.mWETH] },
    { address: MOCK_TOKEN_CONFIG.mUSDC, ...MOCK_TOKEN_METADATA[MOCK_TOKEN_CONFIG.mUSDC] },
    { address: MOCK_TOKEN_CONFIG.mDAI, ...MOCK_TOKEN_METADATA[MOCK_TOKEN_CONFIG.mDAI] },
  ]

  // Check allowance if spender and amount provided
  const { data: allowance } = useReadContract({
    address: selectedToken,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address as Address, spenderAddress as Address],
    query: {
      enabled: !!(isConnected && selectedToken && spenderAddress),
    }
  })

  const hasEnoughAllowance = allowance && requiredAmount
    ? allowance >= requiredAmount
    : false

  const handleApprove = async (tokenAddress: Address) => {
    if (!isConnected || !spenderAddress) return

    try {
      setIsApproving(true)
      await approveToken({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")],
      })
    } catch (error) {
      console.error("Error approving token:", error)
    } finally {
      setIsApproving(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="card-glass p-4">
        <p className="text-center text-neutral-600">Connect wallet to select tokens</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-heading">
        {label}
      </label>

      <div className="grid grid-cols-1 gap-3">
        {tokens.map((token) => {
          const isSelected = selectedToken === token.address
          const needsApproval = spenderAddress && selectedToken === token.address && !hasEnoughAllowance

          return (
            <div
              key={token.address}
              className={`card-glass p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-blue-300 bg-blue-50"
                  : "border-neutral-200 hover:border-neutral-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !disabled && onTokenSelect(token.address)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TokenIcon
                    icon={token.icon}
                    symbol={token.symbol}
                    color={token.color}
                  />
                  <div>
                    <div className="font-semibold text-heading">{token.symbol}</div>
                    <div className="text-xs text-neutral-600">{token.name}</div>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-2">
                    {needsApproval ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApprove(token.address)
                        }}
                        disabled={isApproving}
                        className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isApproving ? 'Approving...' : 'Approve'}
                      </button>
                    ) : (
                      <div className="text-xs text-green-600 font-medium">
                        {hasEnoughAllowance ? 'Approved' : 'Selected'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedToken && spenderAddress && !hasEnoughAllowance && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">⚠️ Approval Required:</span> Please approve the contract to use this token.
          </p>
        </div>
      )}
    </div>
  )
}