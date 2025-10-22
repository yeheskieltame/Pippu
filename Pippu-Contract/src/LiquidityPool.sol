// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiquidityPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Core state variables
    IERC20 public immutable collateralAsset;
    IERC20 public immutable loanAsset;
    uint256 public immutable interestRate;
    uint256 public immutable loanDuration;
    uint256 public immutable maxLoanToValue;
    address public immutable borrower;

    uint256 public totalCollateral;
    uint256 public totalLiquidity;
    uint256 public totalLoaned;
    uint256 public totalShares;

    bool public loanActive;
    uint256 public loanStartTime;
    uint256 public loanEndTime;
    uint256 public loanAmount;

    // Mappings
    mapping(address => uint256) public userShares;
    mapping(address => uint256) public userDeposits;

    // Constants
    uint256 private constant BASIS_POINTS = 10000;
    uint256 private constant SECONDS_PER_YEAR = 31536000;

    // Events
    event LiquidityProvided(address indexed provider, uint256 amount, uint256 shares);
    event LiquidityWithdrawn(address indexed provider, uint256 amount, uint256 shares);
    event LoanDisbursed(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 principal, uint256 interest);

    modifier onlyBorrower() {
        require(msg.sender == borrower || msg.sender == owner(), "Only borrower or owner");
        _;
    }

    constructor(
        address _collateralAsset,
        address _loanAsset,
        address _borrower,
        uint256 _interestRate,
        uint256 _loanDuration
    ) Ownable(msg.sender) {
        collateralAsset = IERC20(_collateralAsset);
        loanAsset = IERC20(_loanAsset);
        borrower = _borrower;
        interestRate = _interestRate;
        loanDuration = _loanDuration;
        maxLoanToValue = 7000; // 70%
    }

    function provideLiquidity(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        uint256 shares = totalShares == 0 ? amount : (amount * totalShares) / totalLiquidity;
        require(shares > 0, "Shares must be > 0");

        userShares[msg.sender] += shares;
        userDeposits[msg.sender] += amount;
        totalLiquidity += amount;
        totalShares += shares;

        loanAsset.safeTransferFrom(msg.sender, address(this), amount);

        emit LiquidityProvided(msg.sender, amount, shares);
    }

    function provideLiquidityFromFactory(address provider, uint256 amount) external nonReentrant {
        require(msg.sender == owner(), "Only factory");
        require(amount > 0, "Amount must be > 0");

        uint256 shares = totalShares == 0 ? amount : (amount * totalShares) / totalLiquidity;
        require(shares > 0, "Shares must be > 0");

        userShares[provider] += shares;
        userDeposits[provider] += amount;
        totalLiquidity += amount;
        totalShares += shares;

        // Transfer langsung dari provider ke pool
        loanAsset.safeTransferFrom(provider, address(this), amount);

        emit LiquidityProvided(provider, amount, shares);
    }

    function withdrawLiquidity(uint256 amount) external nonReentrant {
        require(userDeposits[msg.sender] >= amount, "Insufficient balance");
        require(totalLiquidity - amount >= totalLoaned, "Would break solvency");

        uint256 shares = (amount * userShares[msg.sender]) / userDeposits[msg.sender];

        userDeposits[msg.sender] -= amount;
        userShares[msg.sender] -= shares;
        totalLiquidity -= amount;
        totalShares -= shares;

        loanAsset.safeTransfer(msg.sender, amount);

        emit LiquidityWithdrawn(msg.sender, amount, shares);
    }

    function withdrawLiquidityFromFactory(address provider, uint256 amount) external nonReentrant {
        require(msg.sender == owner(), "Only factory");
        require(userDeposits[provider] >= amount, "Insufficient balance");

        // Check actual available liquidity instead of tracked liquidity
        uint256 availableLiquidity = loanAsset.balanceOf(address(this));
        require(availableLiquidity >= amount, "Insufficient available liquidity");

        uint256 shares = (amount * userShares[provider]) / userDeposits[provider];

        userDeposits[provider] -= amount;
        userShares[provider] -= shares;
        totalLiquidity -= amount;
        totalShares -= shares;

        loanAsset.safeTransfer(provider, amount);

        emit LiquidityWithdrawn(provider, amount, shares);
    }

    function depositCollateral(uint256 amount) external onlyBorrower nonReentrant {
        require(!loanActive, "Loan already active");
        require(amount > 0, "Amount must be > 0");

        totalCollateral += amount;
        collateralAsset.safeTransferFrom(msg.sender, address(this), amount);
    }

    function depositCollateralFromFactory(uint256 amount) external nonReentrant {
        require(msg.sender == owner(), "Only factory");
        require(!loanActive, "Loan already active");
        require(amount > 0, "Amount must be > 0");

        totalCollateral += amount;
    }

    function disburseLoan() external onlyBorrower nonReentrant {
        require(!loanActive, "Loan already active");
        require(totalCollateral > 0, "No collateral");

        uint256 maxLoan = (totalCollateral * maxLoanToValue) / BASIS_POINTS;
        require(totalLiquidity >= maxLoan, "Insufficient liquidity");

        loanAmount = maxLoan;
        loanActive = true;
        loanStartTime = block.timestamp;
        loanEndTime = block.timestamp + loanDuration;
        totalLoaned += loanAmount;
        totalLiquidity -= loanAmount;

        loanAsset.safeTransfer(borrower, loanAmount);

        emit LoanDisbursed(borrower, loanAmount);
    }

    function repayLoan() external payable onlyBorrower nonReentrant {
        require(loanActive, "No active loan");
        require(msg.value > 0, "Payment must be > 0");

        uint256 interest = calculateInterest();
        uint256 totalRepayment = loanAmount + interest;

        require(msg.value >= totalRepayment, "Insufficient payment");

        loanActive = false;
        totalLoaned -= loanAmount;
        totalLiquidity += loanAmount;

        collateralAsset.safeTransfer(borrower, totalCollateral);

        if (msg.value > totalRepayment) {
            payable(msg.sender).transfer(msg.value - totalRepayment);
        }

        emit LoanRepaid(borrower, loanAmount, interest);
    }

    function calculateInterest() public view returns (uint256) {
        if (!loanActive) return 0;

        uint256 timeElapsed = block.timestamp > loanEndTime ?
            loanEndTime - loanStartTime : block.timestamp - loanStartTime;

        return (loanAmount * interestRate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
    }

    function isLoanDefaulted() public view returns (bool) {
        return loanActive && block.timestamp > loanEndTime;
    }

    function getTVL() public view returns (uint256) {
        return totalLiquidity;
    }

    function getUtilizationRate() public view returns (uint256) {
        return totalLiquidity == 0 ? 0 : (totalLoaned * BASIS_POINTS) / totalLiquidity;
    }

    function getProviderBalance(address provider) external view returns (uint256) {
        return userDeposits[provider];
    }

    function getPoolInfo() external view returns (
        address _collateralAsset,
        address _loanAsset,
        uint256 _totalCollateral,
        uint256 _totalLiquidity,
        uint256 _totalLoaned,
        uint256 _interestRate,
        bool _loanActive,
        uint256 _loanAmount,
        uint256 _utilizationRate
    ) {
        return (
            address(collateralAsset),
            address(loanAsset),
            totalCollateral,
            totalLiquidity,
            totalLoaned,
            interestRate,
            loanActive,
            loanAmount,
            getUtilizationRate()
        );
    }
}