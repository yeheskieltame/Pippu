// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILiquidityPool {
    struct PoolInfo {
        address collateralAsset;
        address loanAsset;
        uint256 totalCollateral;
        uint256 totalLiquidity;
        uint256 totalLoaned;
        uint256 interestRate;
        uint256 loanDuration;
        uint256 maxLoanToValue;
        address borrower;
        bool loanActive;
        uint256 loanStartTime;
        uint256 loanEndTime;
        uint256 loanAmount;
        uint256 accruedInterest;
    }

    struct LenderInfo {
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 currentDeposit;
        uint256 shares;
        uint256 earningsAccumulated;
        uint256 lastActivityTimestamp;
        bool isActive;
    }

    struct PoolMetrics {
        uint256 totalLenders;
        uint256 totalDeposits;
        uint256 totalWithdrawals;
        uint256 totalInterestEarned;
        uint256 averageDepositSize;
        uint24 utilizationRate;
    }

    // Basic operations
    function provideLiquidity(uint256 amount) external;
    function withdrawLiquidity(uint256 amount) external;
    function depositCollateral(uint256 amount) external;
    function disburseLoan() external;
    function repayLoan() external payable;
    function liquidateCollateral() external;

    // View functions
    function calculateInterest() external view returns (uint256);
    function isLoanDefaulted() external view returns (bool);
    function getPoolInfo() external view returns (PoolInfo memory);
    function getProviderBalance(address provider) external view returns (uint256);
    function getTVL() external view returns (uint256);

    // Frontend-specific functions
    function getPoolMetrics() external view returns (PoolMetrics memory);
    function getLenderInfo(address lender) external view returns (LenderInfo memory);
    function calculateUserRewards(address lender) external view returns (uint256);
    function getHealthMetrics() external view returns (bool isHealthy, uint256 collateralRatio, uint256 timeToLiquidation, bool hasDefaultRisk);

    // Events
    event LiquidityProvided(address indexed provider, uint256 amount, uint256 shares, uint256 totalTVL, uint24 utilizationRate);
    event LiquidityWithdrawn(address indexed provider, uint256 amount, uint256 shares, uint256 totalTVL, uint24 utilizationRate);
    event LoanDisbursed(address indexed borrower, uint256 amount, uint256 interestRate, uint256 duration, uint256 totalCollateral);
    event LoanRepaid(address indexed borrower, uint256 principal, uint256 interest, uint256 totalRepayment, uint256 collateralReturned);
    event CollateralLiquidated(address indexed liquidator, uint256 collateralAmount, uint256 liquidationValue);
    event PoolMetricsUpdated(uint256 totalTVL, uint24 utilizationRate, uint256 totalLenders, uint256 totalInterestEarned);
}