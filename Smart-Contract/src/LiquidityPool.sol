// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/ILiquidityPool.sol";
import "./libraries/LendingMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityPool is ILiquidityPool, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    PoolInfo public poolInfo;
    mapping(address => uint256) public liquidityProviders;

    uint256 public totalLiquidityShares;
    mapping(address => uint256) public providerShares;

    IERC20 public collateralAsset;
    IERC20 public loanAsset;

    address public factory;
    uint256 private constant MAX_LTV = 7000; // 70%
    uint256 private constant LIQUIDATION_THRESHOLD = 8000; // 80%
    uint256 private constant GRACE_PERIOD = 86400; // 24 hours

    event LiquidityProvided(address indexed provider, uint256 amount, uint256 shares);
    event LiquidityWithdrawn(address indexed provider, uint256 amount, uint256 shares);

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call");
        _;
    }

    modifier onlyBorrower() {
        require(msg.sender == poolInfo.borrower, "Only borrower can call");
        _;
    }

    modifier loanNotActive() {
        require(!poolInfo.loanActive, "Loan already active");
        _;
    }

    modifier loanActive() {
        require(poolInfo.loanActive, "No active loan");
        _;
    }

    constructor(
        address _collateralAsset,
        address _loanAsset,
        address _borrower,
        uint256 _interestRate,
        uint256 _loanDuration,
        address _factory
    ) Ownable(_borrower) {
        collateralAsset = IERC20(_collateralAsset);
        loanAsset = IERC20(_loanAsset);
        factory = _factory;

        poolInfo = PoolInfo({
            collateralAsset: _collateralAsset,
            loanAsset: _loanAsset,
            totalCollateral: 0,
            totalLiquidity: 0,
            totalLoaned: 0,
            interestRate: _interestRate,
            loanDuration: _loanDuration,
            maxLoanToValue: MAX_LTV,
            borrower: _borrower,
            loanActive: false,
            loanStartTime: 0,
            loanEndTime: 0,
            loanAmount: 0,
            accruedInterest: 0
        });
    }

    function provideLiquidity(uint256 amount) external override nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(!poolInfo.loanActive, "Cannot provide liquidity after loan starts");

        uint256 shares;
        if (totalLiquidityShares == 0) {
            shares = amount;
        } else {
            shares = (amount * totalLiquidityShares) / poolInfo.totalLiquidity;
        }

        // Check if tokens are already in the pool (called by factory) or need to be transferred
        if (loanAsset.balanceOf(address(this)) >= poolInfo.totalLiquidity + amount) {
            // Tokens already transferred to pool (factory case)
        } else {
            // Need to transfer from caller (direct call case)
            loanAsset.safeTransferFrom(msg.sender, address(this), amount);
        }

        liquidityProviders[msg.sender] += amount;
        providerShares[msg.sender] += shares;
        totalLiquidityShares += shares;
        poolInfo.totalLiquidity += amount;

        emit LiquidityProvided(msg.sender, amount, shares);
    }

    function withdrawLiquidity(uint256 amount) external override nonReentrant {
        require(liquidityProviders[msg.sender] >= amount, "Insufficient liquidity");
        require(!poolInfo.loanActive, "Cannot withdraw while loan active");

        uint256 sharesToBurn = (amount * totalLiquidityShares) / poolInfo.totalLiquidity;
        require(providerShares[msg.sender] >= sharesToBurn, "Insufficient shares");

        liquidityProviders[msg.sender] -= amount;
        providerShares[msg.sender] -= sharesToBurn;
        totalLiquidityShares -= sharesToBurn;
        poolInfo.totalLiquidity -= amount;

        loanAsset.safeTransfer(msg.sender, amount);

        emit LiquidityWithdrawn(msg.sender, amount, sharesToBurn);
    }

    function depositCollateral(uint256 amount) external onlyBorrower loanNotActive nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Check if tokens are already in the pool (called by factory) or need to be transferred
        if (collateralAsset.balanceOf(address(this)) >= poolInfo.totalCollateral + amount) {
            // Tokens already transferred to pool (factory case)
        } else {
            // Need to transfer from caller (direct call case)
            collateralAsset.safeTransferFrom(msg.sender, address(this), amount);
        }

        poolInfo.totalCollateral += amount;
    }

    // Factory-only function to deposit collateral on behalf of borrower
    function depositCollateralFor(address borrower, uint256 amount) external onlyFactory loanNotActive nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(borrower == poolInfo.borrower, "Not the borrower");
        require(collateralAsset.balanceOf(address(this)) >= poolInfo.totalCollateral + amount, "Insufficient collateral in pool");

        poolInfo.totalCollateral += amount;
    }

    function disburseLoan() external onlyFactory loanNotActive nonReentrant {
        require(poolInfo.totalCollateral > 0, "No collateral deposited");

        // For simplicity, we calculate max loan as 70% of collateral amount directly
        // In production, this would use price oracles
        uint256 maxLoan = (poolInfo.totalCollateral * poolInfo.maxLoanToValue) / 10000;
        require(poolInfo.totalLiquidity >= maxLoan, "Insufficient liquidity");

        poolInfo.loanActive = true;
        poolInfo.loanStartTime = block.timestamp;
        poolInfo.loanEndTime = block.timestamp + poolInfo.loanDuration;
        poolInfo.loanAmount = maxLoan;
        poolInfo.totalLoaned = maxLoan;
        poolInfo.accruedInterest = LendingMath.calculateAPRInterest(
            maxLoan,
            poolInfo.interestRate,
            poolInfo.loanDuration
        );

        loanAsset.safeTransfer(poolInfo.borrower, maxLoan);

        emit LoanDisbursed(poolInfo.borrower, maxLoan);
    }

    function repayLoan() external payable override onlyBorrower loanActive nonReentrant {
        require(block.timestamp <= poolInfo.loanEndTime + GRACE_PERIOD, "Loan period ended");

        uint256 totalRepayment = poolInfo.loanAmount + calculateInterest();
        require(msg.value >= totalRepayment, "Insufficient repayment amount");

        poolInfo.loanActive = false;

        // Calculate liquidity provider rewards
        uint256 liquidityRewards = (msg.value * poolInfo.totalLiquidity) / totalLiquidityShares;

        // Return collateral
        collateralAsset.safeTransfer(poolInfo.borrower, poolInfo.totalCollateral);

        // Distribute rewards to liquidity providers
        if (liquidityRewards > 0) {
            poolInfo.totalLiquidity += liquidityRewards;
        }

        emit LoanRepaid(poolInfo.borrower, poolInfo.loanAmount, msg.value - poolInfo.loanAmount);
    }

    function liquidateCollateral() external override nonReentrant {
        require(isLoanDefaulted(), "Loan not defaulted");
        require(poolInfo.totalCollateral > 0, "No collateral to claim");

        uint256 liquidationBonus = (poolInfo.totalCollateral * 105) / 100; // 5% bonus
        uint256 collateralToClaim = liquidationBonus > poolInfo.totalCollateral ?
            poolInfo.totalCollateral : liquidationBonus;

        collateralAsset.safeTransfer(msg.sender, collateralToClaim);
        poolInfo.totalCollateral = 0;
        poolInfo.loanActive = false;

        emit CollateralClaimed(msg.sender, collateralToClaim);
    }

    function calculateInterest() public view override returns (uint256) {
        if (!poolInfo.loanActive) return 0;

        uint256 timeElapsed = block.timestamp > poolInfo.loanEndTime ?
            poolInfo.loanDuration : block.timestamp - poolInfo.loanStartTime;

        return LendingMath.calculateInterest(
            poolInfo.loanAmount,
            poolInfo.interestRate,
            timeElapsed
        );
    }

    // Public view function for testing
    function getInterestAccrued() external view returns (uint256) {
        return calculateInterest();
    }

    function isLoanDefaulted() public view override returns (bool) {
        return poolInfo.loanActive && block.timestamp > poolInfo.loanEndTime + GRACE_PERIOD;
    }

    function getPoolInfo() external view override returns (PoolInfo memory) {
        return poolInfo;
    }

    function getProviderBalance(address provider) external view override returns (uint256) {
        return liquidityProviders[provider];
    }

    function getTVL() external view override returns (uint256) {
        return poolInfo.totalLiquidity + poolInfo.totalLoaned;
    }

    // Factory-only function to provide liquidity on behalf of someone else
    function provideLiquidityFor(address provider, uint256 amount) external onlyFactory nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(!poolInfo.loanActive, "Cannot provide liquidity after loan starts");
        require(loanAsset.balanceOf(address(this)) >= poolInfo.totalLiquidity + amount, "Insufficient tokens in pool");

        uint256 shares;
        if (totalLiquidityShares == 0) {
            shares = amount;
        } else {
            shares = (amount * totalLiquidityShares) / poolInfo.totalLiquidity;
        }

        liquidityProviders[provider] += amount;
        providerShares[provider] += shares;
        totalLiquidityShares += shares;
        poolInfo.totalLiquidity += amount;

        emit LiquidityProvided(provider, amount, shares);
    }
}