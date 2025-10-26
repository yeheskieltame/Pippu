"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract } from "wagmi"
import { useReadContract } from "wagmi"
import { formatTokenAmount } from "@/lib/utils"
import { MOCK_TOKEN_CONFIG, MOCK_TOKEN_METADATA } from "@/lib/constants/mock-tokens"
import { type Address } from "viem"
import { TokenIcon } from "@/components/common/token-icon"

// Token metadata interface
interface TokenInfo {
  symbol: string
  name: string
  decimals: number
  color: string
  icon: string
  isMock: boolean
  claimAmount: string
  tokenAddress: Address
}

interface TokenState {
  canClaim: boolean
  remainingCooldown: number
  balance: bigint
}


export function FaucetCard() {
  const { address, isConnected } = useAccount()
  const [tokenStates, setTokenStates] = useState<TokenState[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const { writeContract: mintTokens } = useWriteContract()

  // Read token balances for each token using useReadContract (the working approach)
  const mWETHBalance = useReadContract({
    address: MOCK_TOKEN_CONFIG.mWETH,
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
      enabled: isConnected && !!address && mounted,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 3
    }
  })

  const mUSDCBalance = useReadContract({
    address: MOCK_TOKEN_CONFIG.mUSDC,
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
      enabled: isConnected && !!address && mounted,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 3
    }
  })

  const mDAIBalance = useReadContract({
    address: MOCK_TOKEN_CONFIG.mDAI,
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
      enabled: isConnected && !!address && mounted,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 3
    }
  })

  // Build token states from all queries
  useEffect(() => {
    if (isConnected && mounted) {
      const states: TokenState[] = [
        {
          canClaim: true, // Always can claim since using publicMint
          remainingCooldown: 0,
          balance: mWETHBalance.data || BigInt(0),
        },
        {
          canClaim: true,
          remainingCooldown: 0,
          balance: mUSDCBalance.data || BigInt(0),
        },
        {
          canClaim: true,
          remainingCooldown: 0,
          balance: mDAIBalance.data || BigInt(0),
        },
      ]
      setTokenStates(states)
    }
  }, [
    isConnected,
    mounted,
    mWETHBalance.data,
    mUSDCBalance.data,
    mDAIBalance.data,
  ])

  const handleClaimToken = async (tokenIndex: number) => {
    if (!isConnected || !address) return

    try {
      setIsLoading(true)

      // Get token address for the index
      const tokenAddresses = [
        MOCK_TOKEN_CONFIG.mWETH,
        MOCK_TOKEN_CONFIG.mUSDC,
        MOCK_TOKEN_CONFIG.mDAI,
      ]
      const tokenAddress = tokenAddresses[tokenIndex] as Address

      // Get claim amount based on token type
      const claimAmounts = [
        BigInt(100) * BigInt(10 ** 18), // 100 mWETH
        BigInt(10000) * BigInt(10 ** 6),  // 10,000 mUSDC
        BigInt(10000) * BigInt(10 ** 18), // 10,000 mDAI
      ]
      const claimAmount = claimAmounts[tokenIndex]

      // Use publicMint directly instead of faucet
      mintTokens({
        address: tokenAddress,
        abi: [
          {
            inputs: [
              {
                name: "amount",
                type: "uint256"
              }
            ],
            name: "publicMint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        functionName: 'publicMint',
        args: [claimAmount],
      })
    } catch (error) {
      console.error("Error claiming tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMintTokens = async (tokenAddress: Address) => {
    if (!isConnected || !address) return

    try {
      setIsLoading(true)
      mintTokens({
        address: tokenAddress,
        abi: [
          {
            inputs: [
              {
                name: "to",
                type: "address"
              },
              {
                name: "amount",
                type: "uint256"
              }
            ],
            name: "publicMint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        functionName: 'publicMint',
        args: [address, BigInt(1000) * BigInt(10 ** 18)], // Mint 1000 tokens
      })
    } catch (error) {
      console.error("Error minting tokens:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="card-glass p-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="card-glass p-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">💧</div>
          <h3 className="text-xl font-bold text-heading mb-2">
            Token Faucet
          </h3>
          <p className="text-sm text-neutral-600">
            Connect your wallet to claim free test tokens
          </p>
        </div>
      </div>
    )
  }

  if (MOCK_TOKEN_CONFIG.faucet === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="card-glass p-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">💧</div>
          <h3 className="text-xl font-bold text-heading mb-2">
            Token Faucet
          </h3>
          <p className="text-sm text-neutral-600">
            Deploy the faucet contract to enable token claiming
          </p>
        </div>
      </div>
    )
  }

  // Create token list with addresses
  const tokenList: TokenInfo[] = [
    {
      ...MOCK_TOKEN_METADATA[MOCK_TOKEN_CONFIG.mWETH],
      tokenAddress: MOCK_TOKEN_CONFIG.mWETH
    },
    {
      ...MOCK_TOKEN_METADATA[MOCK_TOKEN_CONFIG.mUSDC],
      tokenAddress: MOCK_TOKEN_CONFIG.mUSDC
    },
    {
      ...MOCK_TOKEN_METADATA[MOCK_TOKEN_CONFIG.mDAI],
      tokenAddress: MOCK_TOKEN_CONFIG.mDAI
    }
  ]

  return (
    <div className="card-glass p-6 animate-bounce-in" style={{ animationDelay: "0.1s" }}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">💧</div>
        <h3 className="text-2xl font-bold text-heading mb-1">
          Token Faucet
        </h3>
        <p className="text-sm text-neutral-600">
          Claim free test tokens every hour
        </p>
      </div>

  
      {/* Token Cards */}
      <div className="space-y-4 mb-6">
        {tokenList.map((token, index) => {
          const state = tokenStates[index] || { canClaim: false, remainingCooldown: 0, balance: BigInt(0) }
          const isReady = state.canClaim && state.remainingCooldown === 0

          return (
            <div
              key={token.symbol}
              className={`card-glass p-4 border-2 transition-all duration-300 ${
                isReady
                  ? "border-green-200 bg-green-50"
                  : "border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-xl flex items-center justify-center p-2">
                    <TokenIcon
                      icon={token.icon}
                      symbol={token.symbol}
                      color={token.color}
                      fallback="💧"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-heading">{token.symbol}</h4>
                    <p className="text-xs text-neutral-600">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-neutral-700">
                    {formatTokenAmount(state.balance, token.decimals)}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Balance
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-600">Claim Amount:</span>
                  <span className="text-xs font-medium text-green-600">
                    {token.claimAmount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-600">Status:</span>
                  <span className="text-xs font-medium text-green-600">
                    Ready to claim
                  </span>
                </div>
              </div>

              {/* Single claim button */}
              <div className="mt-3">
                <button
                  className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                    !isReady || isLoading
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600 active:scale-95"
                  }`}
                  disabled={!isReady || isLoading}
                  onClick={() => handleClaimToken(index)}
                >
                  {isLoading ? 'Claiming...' : 'Claim Tokens'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      
      {/* Mint Tokens Section */}
      <div className="border-t border-neutral-200 pt-4">
        <h4 className="text-sm font-semibold text-heading mb-3">
          Need More Tokens?
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {tokenList.map((token) => (
            <button
              key={token.symbol}
              className="p-2 text-center border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-all duration-300"
              onClick={() => handleMintTokens(token.tokenAddress)}
            >
              <div className="flex justify-center mb-1">
                <TokenIcon
                  icon={token.icon}
                  symbol={token.symbol}
                  color={token.color}
                  size="small"
                  fallback="💧"
                />
              </div>
              <div className="text-xs font-medium">{token.symbol}</div>
              <div className="text-xs text-neutral-600">Mint</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-3 mt-4 border border-blue-200">
        <p className="text-xs text-blue-800 text-center">
          <span className="font-semibold">💡 Tip:</span> Direct claim using publicMint - no approval required! Or use "Mint" for custom amounts.
        </p>
      </div>
    </div>
  )
}