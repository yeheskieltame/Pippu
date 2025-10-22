// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILiquidityPool {
    struct PoolInfo {
        address collateralAsset;
        address loanAsset;
        uint256 totalCollateral;
        uint256 totalLiquidity;
        uint256 totalLoaned;
        uint256 interestRate;
        uint256 loanDuration;
        uint256 maxLoanToValue; // in basis points (7000 = 70%)
        address borrower;
        bool loanActive;
        uint256 loanStartTime;
        uint256 loanEndTime;
        uint256 loanAmount;
        uint256 accruedInterest;
    }

    event LiquidityProvided(address indexed provider, uint256 amount);
    event LiquidityWithdrawn(address indexed provider, uint256 amount);
    event LoanDisbursed(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 principal, uint256 interest);
    event CollateralClaimed(address indexed liquidator, uint256 amount);

    function provideLiquidity(uint256 amount) external;
    function withdrawLiquidity(uint256 amount) external;
    function disburseLoan() external;
    function repayLoan() external payable;
    function liquidateCollateral() external;
    function calculateInterest() external view returns (uint256);
    function isLoanDefaulted() external view returns (bool);
    function getPoolInfo() external view returns (PoolInfo memory);
    function getProviderBalance(address provider) external view returns (uint256);
    function getTVL() external view returns (uint256);
}