// SPDX-License-Identifier: MIT
// Contract ABIs for Pippu Lending Protocol
// Updated with actual deployed contract ABIs

export const LENDING_FACTORY_ABI = [
  {
    "type": "function",
    "name": "getAllPools",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address[]", "internalType": "address[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActivePools",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address[]", "internalType": "address[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActivePoolsPaginated",
    "inputs": [
      { "name": "offset", "type": "uint256", "internalType": "uint256" },
      { "name": "limit", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      {
        "name": "pools",
        "type": "tuple[]",
        "internalType": "struct ILendingFactory.PoolSummary[]",
        "components": [
          { "name": "poolAddress", "type": "address", "internalType": "address" },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "tvl", "type": "uint256", "internalType": "uint256" },
          { "name": "totalBorrowed", "type": "uint256", "internalType": "uint256" },
          { "name": "interestRate", "type": "uint256", "internalType": "uint256" },
          { "name": "utilizationRate", "type": "uint256", "internalType": "uint256" },
          { "name": "lendersCount", "type": "uint256", "internalType": "uint256" },
          { "name": "active", "type": "bool", "internalType": "bool" },
          { "name": "riskLevel", "type": "string", "internalType": "string" }
        ]
      },
      { "name": "total", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMultiplePoolsInfo",
    "inputs": [
      { "name": "pools", "type": "address[]", "internalType": "address[]" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct ILendingFactory.PoolSummary[]",
        "components": [
          { "name": "poolAddress", "type": "address", "internalType": "address" },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "tvl", "type": "uint256", "internalType": "uint256" },
          { "name": "totalBorrowed", "type": "uint256", "internalType": "uint256" },
          { "name": "interestRate", "type": "uint256", "internalType": "uint256" },
          { "name": "utilizationRate", "type": "uint256", "internalType": "uint256" },
          { "name": "lendersCount", "type": "uint256", "internalType": "uint256" },
          { "name": "active", "type": "bool", "internalType": "bool" },
          { "name": "riskLevel", "type": "string", "internalType": "string" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolInfo",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "collateralAsset", "type": "address", "internalType": "address" },
      { "name": "loanAsset", "type": "address", "internalType": "address" },
      { "name": "totalCollateral", "type": "uint256", "internalType": "uint256" },
      { "name": "totalLiquidity", "type": "uint256", "internalType": "uint256" },
      { "name": "totalLoaned", "type": "uint256", "internalType": "uint256" },
      { "name": "interestRate", "type": "uint256", "internalType": "uint256" },
      { "name": "loanDuration", "type": "uint256", "internalType": "uint256" },
      { "name": "maxLoanToValue", "type": "uint256", "internalType": "uint256" },
      { "name": "borrower", "type": "address", "internalType": "address" },
      { "name": "loanActive", "type": "bool", "internalType": "bool" },
      { "name": "loanStartTime", "type": "uint256", "internalType": "uint256" },
      { "name": "loanEndTime", "type": "uint256", "internalType": "uint256" },
      { "name": "loanAmount", "type": "uint256", "internalType": "uint256" },
      { "name": "accruedInterest", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolMetrics",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ILendingFactory.PoolMetrics",
        "components": [
          { "name": "tvl", "type": "uint256", "internalType": "uint256" },
          { "name": "utilizationRate", "type": "uint256", "internalType": "uint256" },
          { "name": "lendersCount", "type": "uint256", "internalType": "uint256" },
          { "name": "averageAPY", "type": "uint256", "internalType": "uint256" },
          { "name": "totalInterestPaid", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolTVL",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProposalByPool",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ILendingFactory.LoanProposal",
        "components": [
          { "name": "borrower", "type": "address", "internalType": "address" },
          { "name": "collateralAsset", "type": "address", "internalType": "address" },
          { "name": "loanAsset", "type": "address", "internalType": "address" },
          { "name": "collateralAmount", "type": "uint256", "internalType": "uint256" },
          { "name": "loanAmountRequested", "type": "uint256", "internalType": "uint256" },
          { "name": "interestRate", "type": "uint256", "internalType": "uint256" },
          { "name": "loanDuration", "type": "uint256", "internalType": "uint256" },
          { "name": "description", "type": "string", "internalType": "string" },
          { "name": "active", "type": "bool", "internalType": "bool" },
          { "name": "liquidityPool", "type": "address", "internalType": "address" },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "riskLevel", "type": "string", "internalType": "string" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getProviderBalance",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" },
      { "name": "provider", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserLenderPositions",
    "inputs": [
      { "name": "lender", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct ILendingFactory.LenderPosition[]",
        "components": [
          { "name": "pool", "type": "address", "internalType": "address" },
          { "name": "liquidityProvided", "type": "uint256", "internalType": "uint256" },
          { "name": "shares", "type": "uint256", "internalType": "uint256" },
          { "name": "earningsAccumulated", "type": "uint256", "internalType": "uint256" },
          { "name": "isActive", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserPools",
    "inputs": [
      { "name": "user", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "address[]", "internalType": "address[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateInterest",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateUserRewards",
    "inputs": [
      { "name": "lender", "type": "address", "internalType": "address" },
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isLoanDefaulted",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolHealthMetrics",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ILendingFactory.HealthMetrics",
        "components": [
          { "name": "isHealthy", "type": "bool", "internalType": "bool" },
          { "name": "collateralRatio", "type": "uint256", "internalType": "uint256" },
          { "name": "timeToLiquidation", "type": "uint256", "internalType": "uint256" },
          { "name": "hasDefaultRisk", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createPool",
    "inputs": [
      {
        "name": "collateralAsset",
        "type": "address",
        "internalType": "address"
      },
      { "name": "loanAsset", "type": "address", "internalType": "address" },
      {
        "name": "collateralAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "loanAmount", "type": "uint256", "internalType": "uint256" },
      {
        "name": "interestRate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "loanDuration",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "description", "type": "string", "internalType": "string" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createPoolWithMetadata",
    "inputs": [
      {
        "name": "collateralAsset",
        "type": "address",
        "internalType": "address"
      },
      { "name": "loanAsset", "type": "address", "internalType": "address" },
      {
        "name": "collateralAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "loanAmount", "type": "uint256", "internalType": "uint256" },
      {
        "name": "interestRate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "loanDuration",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "description", "type": "string", "internalType": "string" },
      { "name": "name", "type": "string", "internalType": "string" },
      { "name": "riskLevel", "type": "string", "internalType": "string" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fundPool",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositCollateral",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "disburseLoan",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "liquidateCollateral",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "repayLoan",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdrawFromPool",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "PoolCreated",
    "inputs": [
      { "name": "pool", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "borrower", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "collateralAsset", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "loanAsset", "type": "address", "indexed": false, "internalType": "address" },
      { "name": "loanAmount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "name", "type": "string", "indexed": false, "internalType": "string" },
      { "name": "riskLevel", "type": "string", "indexed": false, "internalType": "string" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolFunded",
    "inputs": [
      { "name": "pool", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "lender", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "totalTVL", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LoanDisbursed",
    "inputs": [
      { "name": "pool", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "borrower", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LoanRepaid",
    "inputs": [
      { "name": "pool", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "borrower", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "principal", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "interest", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LiquidityWithdrawn",
    "inputs": [
      { "name": "pool", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "lender", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" },
      { "name": "sharesBurned", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolUpdated",
    "inputs": [
      { "name": "pool", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  }
] as const;

export const LIQUIDITY_POOL_ABI = [
  {
    type: 'function',
    name: 'borrower',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'calculateInterest',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'collateralAsset',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'depositCollateral',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositCollateralFromFactory',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'disburseLoan',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'getPoolInfo',
    inputs: [],
    outputs: [
      { name: '_collateralAsset', type: 'address', internalType: 'address' },
      { name: '_loanAsset', type: 'address', internalType: 'address' },
      { name: '_totalCollateral', type: 'uint256', internalType: 'uint256' },
      { name: '_totalLiquidity', type: 'uint256', internalType: 'uint256' },
      { name: '_totalLoaned', type: 'uint256', internalType: 'uint256' },
      { name: '_interestRate', type: 'uint256', internalType: 'uint256' },
      { name: '_loanActive', type: 'bool', internalType: 'bool' },
      { name: '_loanAmount', type: 'uint256', internalType: 'uint256' },
      { name: '_utilizationRate', type: 'uint256', internalType: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getProviderBalance',
    inputs: [{ name: 'provider', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTVL',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getUtilizationRate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'interestRate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'isLoanDefaulted',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'loanActive',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'loanAmount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'loanAsset',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'loanDuration',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'loanEndTime',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'loanStartTime',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'maxLoanToValue',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'provideLiquidity',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'provideLiquidityFromFactory',
    inputs: [
      { name: 'provider', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'totalCollateral',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalLiquidity',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalLoaned',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalShares',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'userDeposits',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'userShares',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'withdrawLiquidity',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawLiquidityFromFactory',
    inputs: [
      { name: 'provider', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    name: 'LiquidityProvided',
    inputs: [
      { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'shares', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'LiquidityWithdrawn',
    inputs: [
      { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'shares', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'LoanDisbursed',
    inputs: [
      { name: 'borrower', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'LoanRepaid',
    inputs: [
      { name: 'borrower', type: 'address', indexed: true, internalType: 'address' },
      { name: 'principal', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'interest', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { name: 'previousOwner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'newOwner', type: 'address', indexed: true, internalType: 'address' }
    ],
    anonymous: false
  }
] as const;

// ERC20 ABI for token approvals and transfers
export const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view'
  }
] as const;