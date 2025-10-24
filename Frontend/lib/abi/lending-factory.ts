// LendingFactory ABI extracted from contract JSON
export const LENDING_FACTORY_ABI = [
  {
    "type": "function",
    "name": "allPools",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
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
      { "name": "name", "type": "string", "internalType": "string" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
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
    "name": "getActivePools",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "address[]", "internalType": "address[]" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllPools",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "address[]", "internalType": "address[]" }
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
        "internalType": "struct LendingFactory.PoolInfo[]",
        "components": [
          {
            "name": "poolAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "borrower",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "collateralAsset",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "loanAsset",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "interestRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "active", "type": "bool", "internalType": "bool" }
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
    "name": "getPoolDetails",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "collateralAsset",
        "type": "address",
        "internalType": "address"
      },
      { "name": "loanAsset", "type": "address", "internalType": "address" },
      {
        "name": "totalCollateral",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalLiquidity",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "totalLoaned", "type": "uint256", "internalType": "uint256" },
      {
        "name": "interestRate",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "loanActive", "type": "bool", "internalType": "bool" },
      { "name": "loanAmount", "type": "uint256", "internalType": "uint256" },
      {
        "name": "utilizationRate",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPoolInfo",
    "inputs": [
      { "name": "pool", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct LendingFactory.PoolInfo",
        "components": [
          {
            "name": "poolAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "borrower",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "collateralAsset",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "loanAsset",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "interestRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          { "name": "name", "type": "string", "internalType": "string" },
          { "name": "active", "type": "bool", "internalType": "bool" }
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
    "name": "getUserPools",
    "inputs": [
      { "name": "user", "type": "address", "internalType": "address" }
    ],
    "outputs": [
      { "name": "", "type": "address[]", "internalType": "address[]" }
    ],
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
    "name": "isPool",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "poolCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "poolInfos",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [
      { "name": "poolAddress", "type": "address", "internalType": "address" },
      { "name": "borrower", "type": "address", "internalType": "address" },
      {
        "name": "collateralAsset",
        "type": "address",
        "internalType": "address"
      },
      { "name": "loanAsset", "type": "address", "internalType": "address" },
      {
        "name": "interestRate",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "name", "type": "string", "internalType": "string" },
      { "name": "active", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
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
    "name": "transferOwnership",
    "inputs": [
      { "name": "newOwner", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userPools",
    "inputs": [
      { "name": "", "type": "address", "internalType": "address" },
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
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
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PoolCreated",
    "inputs": [
      {
        "name": "pool",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "borrower",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      { "name": "owner", "type": "address", "internalType": "address" }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      { "name": "account", "type": "address", "internalType": "address" }
    ]
  },
  { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      { "name": "token", "type": "address", "internalType": "address" }
    ]
  }
] as const;

// Event signature for PoolCreated: PoolCreated(address indexed pool, address indexed borrower, string name)
// Keccak256 hash of "PoolCreated(address,address,string)"
export const POOL_CREATED_TOPIC = "0x8be80985f28ead440472207dc688e7151a0b906b3ee37d756cb1c22b8d8a37e3";