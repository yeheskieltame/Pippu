// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library LendingMath {
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant SECONDS_PER_YEAR = 31536000;

    function calculateCollateralValue(
        uint256 collateralAmount,
        uint256 collateralPrice
    ) internal pure returns (uint256) {
        return (collateralAmount * collateralPrice) / 1e18;
    }

    function calculateMaxLoanAmount(
        uint256 collateralValue,
        uint256 maxLTV
    ) internal pure returns (uint256) {
        return (collateralValue * maxLTV) / BASIS_POINTS;
    }

    function calculateInterest(
        uint256 principal,
        uint256 rate,
        uint256 timeElapsed
    ) internal pure returns (uint256) {
        return (principal * rate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
    }

    function calculateAPRInterest(
        uint256 principal,
        uint256 aprRate,
        uint256 duration
    ) internal pure returns (uint256) {
        return (principal * aprRate * duration) / (BASIS_POINTS * SECONDS_PER_YEAR);
    }

    function calculateLiquidationPrice(
        uint256 loanAmount,
        uint256 collateralAmount,
        uint256 liquidationThreshold
    ) internal pure returns (uint256) {
        return (loanAmount * BASIS_POINTS) / (collateralAmount * liquidationThreshold);
    }

    function isCollateralSufficient(
        uint256 collateralValue,
        uint256 loanAmount,
        uint256 ltvThreshold
    ) internal pure returns (bool) {
        uint256 requiredCollateral = (loanAmount * BASIS_POINTS) / ltvThreshold;
        return collateralValue >= requiredCollateral;
    }
}