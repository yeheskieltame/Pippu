// SPDX-License-Identifier: MIT
// Contract ABIs for Pippu Lending Protocol

export const LENDING_FACTORY_ABI = [
  {
    type: 'function',
    name: 'getAllPools',
    inputs: [],
    outputs: [{ type: 'address[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getActivePools',
    inputs: [],
    outputs: [{ type: 'address[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getPoolCount',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getPoolInfo',
    inputs: [{ name: 'pool', type: 'address' }],
    outputs: [
      { name: 'poolAddress', type: 'address' },
      { name: 'borrower', type: 'address' },
      { name: 'collateralAsset', type: 'address' },
      { name: 'loanAsset', type: 'address' },
      { name: 'interestRate', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'active', type: 'bool' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getPoolDetails',
    inputs: [{ name: 'pool', type: 'address' }],
    outputs: [
      { name: 'collateralAsset', type: 'address' },
      { name: 'loanAsset', type: 'address' },
      { name: 'totalCollateral', type: 'uint256' },
      { name: 'totalLiquidity', type: 'uint256' },
      { name: 'totalLoaned', type: 'uint256' },
      { name: 'interestRate', type: 'uint256' },
      { name: 'loanActive', type: 'bool' },
      { name: 'loanAmount', type: 'uint256' },
      { name: 'utilizationRate', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getUserPools',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'address[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getPoolTVL',
    inputs: [{ name: 'pool', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getProviderBalance',
    inputs: [
      { name: 'pool', type: 'address' },
      { name: 'provider', type: 'address' }
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'calculateInterest',
    inputs: [{ name: 'pool', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'isLoanDefaulted',
    inputs: [{ name: 'pool', type: 'address' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'createPoolWithMetadata',
    inputs: [
      { name: 'collateralAsset', type: 'address' },
      { name: 'loanAsset', type: 'address' },
      { name: 'collateralAmount', type: 'uint256' },
      { name: 'loanAmount', type: 'uint256' },
      { name: 'interestRate', type: 'uint256' },
      { name: 'loanDuration', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'name', type: 'string' }
    ],
    outputs: [{ type: 'address' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'fundPool',
    inputs: [
      { name: 'pool', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawFromPool',
    inputs: [
      { name: 'pool', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositCollateral',
    inputs: [
      { name: 'pool', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'disburseLoan',
    inputs: [{ name: 'pool', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'repayLoan',
    inputs: [{ name: 'pool', type: 'address' }],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'event',
    name: 'PoolCreated',
    inputs: [
      { name: 'pool', type: 'address', indexed: true },
      { name: 'borrower', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false }
    ]
  }
] as const;

export const LIQUIDITY_POOL_ABI = [
  {
    type: 'function',
    name: 'getPoolInfo',
    inputs: [],
    outputs: [
      { name: '_collateralAsset', type: 'address' },
      { name: '_loanAsset', type: 'address' },
      { name: '_totalCollateral', type: 'uint256' },
      { name: '_totalLiquidity', type: 'uint256' },
      { name: '_totalLoaned', type: 'uint256' },
      { name: '_interestRate', type: 'uint256' },
      { name: '_loanActive', type: 'bool' },
      { name: '_loanAmount', type: 'uint256' },
      { name: '_utilizationRate', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getProviderBalance',
    inputs: [{ name: 'provider', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTVL',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'calculateInterest',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'isLoanDefaulted',
    inputs: [],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getUtilizationRate',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'provideLiquidity',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawLiquidity',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositCollateral',
    inputs: [{ name: 'amount', type: 'uint256' }],
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
    name: 'repayLoan',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'event',
    name: 'LiquidityProvided',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'shares', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'LiquidityWithdrawn',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'shares', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'LoanDisbursed',
    inputs: [
      { name: 'borrower', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'LoanRepaid',
    inputs: [
      { name: 'borrower', type: 'address', indexed: true },
      { name: 'principal', type: 'uint256', indexed: false },
      { name: 'interest', type: 'uint256', indexed: false }
    ]
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