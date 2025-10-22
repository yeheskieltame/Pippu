// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILendingFactory {
    struct LoanProposal {
        address borrower;
        address collateralAsset;
        address loanAsset;
        uint256 collateralAmount;
        uint256 loanAmountRequested;
        uint256 interestRate; // in basis points (10000 = 100%)
        uint256 loanDuration; // in seconds
        string description;
        bool active;
        address liquidityPool;
    }

    event PoolCreated(
        address indexed pool,
        address indexed borrower,
        address collateralAsset,
        address loanAsset,
        uint256 loanAmount
    );

    event ProposalCreated(
        address indexed borrower,
        address indexed pool,
        uint256 loanAmount,
        uint256 interestRate
    );

    function createPool(
        address collateralAsset,
        address loanAsset,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        string calldata description
    ) external returns (address pool);

    function getPoolCount() external view returns (uint256);
    function getPoolAddress(uint256 index) external view returns (address);
    function getProposalByPool(address pool) external view returns (LoanProposal memory);
    function getAllPools() external view returns (address[] memory);
    function getActivePools() external view returns (address[] memory);
    function getUserPools(address user) external view returns (address[] memory);
}