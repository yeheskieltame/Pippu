// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/LiquidityPool.sol";

contract MockFactory {
    mapping(address => LiquidityPool) public pools;

    function createPool(
        address collateralAsset,
        address loanAsset,
        address borrower,
        uint256 interestRate,
        uint256 loanDuration
    ) external returns (LiquidityPool pool) {
        pool = new LiquidityPool(
            collateralAsset,
            loanAsset,
            borrower,
            interestRate,
            loanDuration,
            address(this)
        );
        pools[address(pool)] = pool;
    }

    function disburseLoan(address pool) external {
        require(address(pools[pool]) != address(0), "Pool does not exist");
        pools[pool].disburseLoan();
    }

    // Allow anyone to call functions for testing
    function testDisburseLoan(address pool) external {
        require(address(pools[pool]) != address(0), "Pool does not exist");
        pools[pool].disburseLoan();
    }

    function testRepayLoan(address pool) external payable {
        require(address(pools[pool]) != address(0), "Pool does not exist");
        pools[pool].repayLoan{value: msg.value}();
    }

    function testLiquidateCollateral(address pool) external {
        require(address(pools[pool]) != address(0), "Pool does not exist");
        pools[pool].liquidateCollateral();
    }
}