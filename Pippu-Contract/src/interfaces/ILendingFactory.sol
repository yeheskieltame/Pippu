// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILendingFactory {
    struct LoanProposal {
        address borrower;
        address collateralAsset;
        address loanAsset;
        uint256 collateralAmount;
        uint256 loanAmountRequested;
        uint256 interestRate;
        uint256 loanDuration;
        string description;
        bool active;
        address liquidityPool;
        string name;
        string riskLevel;
    }

    struct PoolSummary {
        address poolAddress;
        string name;
        string description;
        uint256 tvl;
        uint256 totalBorrowed;
        uint256 interestRate;
        uint256 utilizationRate;
        uint256 lendersCount;
        bool active;
        string riskLevel;
    }

    struct LenderPosition {
        address pool;
        uint256 liquidityProvided;
        uint256 shares;
        uint256 earningsAccumulated;
        bool isActive;
    }

    struct PoolMetrics {
        uint256 tvl;
        uint256 utilizationRate;
        uint256 lendersCount;
        uint256 averageAPY;
        uint256 totalInterestPaid;
    }

    struct HealthMetrics {
        bool isHealthy;
        uint256 collateralRatio;
        uint256 timeToLiquidation;
        bool hasDefaultRisk;
    }

    // Pool creation functions
    function createPool(
        address collateralAsset,
        address loanAsset,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        string calldata description
    ) external returns (address);

    function createPoolWithMetadata(
        address collateralAsset,
        address loanAsset,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        string calldata description,
        string calldata name,
        string calldata riskLevel
    ) external returns (address);

    // Pool interaction functions
    function fundPool(address pool, uint256 amount) external;
    function withdrawFromPool(address pool, uint256 amount) external;
    function depositCollateral(address pool, uint256 amount) external;
    function disburseLoan(address pool) external;
    function repayLoan(address pool) external payable;
    function liquidateCollateral(address pool) external;

    // Basic view functions
    function getPoolCount() external view returns (uint256);
    function getAllPools() external view returns (address[] memory);
    function getActivePools() external view returns (address[] memory);
    function getProposalByPool(address pool) external view returns (LoanProposal memory);
    function getUserPools(address user) external view returns (address[] memory);
    function getPoolTVL(address pool) external view returns (uint256);
    function getPoolInfo(address pool) external view returns (address collateralAsset, address loanAsset, uint256 totalCollateral, uint256 totalLiquidity, uint256 totalLoaned, uint256 interestRate, uint256 loanDuration, uint256 maxLoanToValue, address borrower, bool loanActive, uint256 loanStartTime, uint256 loanEndTime, uint256 loanAmount, uint256 accruedInterest);
    function getProviderBalance(address pool, address provider) external view returns (uint256);
    function calculateInterest(address pool) external view returns (uint256);
    function isLoanDefaulted(address pool) external view returns (bool);

    // Enhanced frontend functions
    function getMultiplePoolsInfo(address[] calldata pools) external view returns (PoolSummary[] memory);
    function getActivePoolsPaginated(uint256 offset, uint256 limit) external view returns (PoolSummary[] memory pools, uint256 total);
    function getUserLenderPositions(address lender) external view returns (LenderPosition[] memory);
    function getPoolMetrics(address pool) external view returns (PoolMetrics memory);
    function calculateUserRewards(address lender, address pool) external view returns (uint256);
    function getPoolHealthMetrics(address pool) external view returns (HealthMetrics memory);

    // Events
    event PoolCreated(address indexed pool, address indexed borrower, address collateralAsset, address loanAsset, uint256 loanAmount, string name, string riskLevel);
    event PoolFunded(address indexed pool, address indexed lender, uint256 amount, uint256 totalTVL);
    event LiquidityWithdrawn(address indexed pool, address indexed lender, uint256 amount, uint256 sharesBurned);
    event LoanDisbursed(address indexed pool, address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed pool, address indexed borrower, uint256 principal, uint256 interest);
    event PoolUpdated(address indexed pool);
}