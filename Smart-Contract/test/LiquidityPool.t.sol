// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/LiquidityPool.sol";
import "../src/libraries/LendingMath.sol";
import "./MockFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract LiquidityPoolTest is Test {
    LiquidityPool public pool;
    MockFactory public factory;
    MockERC20 public usdc;
    MockERC20 public weth;

    address public borrower = address(0x1);
    address public lender1 = address(0x2);
    address public lender2 = address(0x3);
    address public poolOwner = address(0x5);

    uint256 public constant INTEREST_RATE = 1000; // 10% APR
    uint256 public constant LOAN_DURATION = 30 days;

    function setUp() public {
        usdc = new MockERC20("USDC", "USDC");
        weth = new MockERC20("WETH", "WETH");
        factory = new MockFactory();

        // Mint tokens for testing
        usdc.mint(lender1, 1000 ether);
        usdc.mint(lender2, 1000 ether);
        weth.mint(borrower, 100 ether);
        weth.mint(poolOwner, 100 ether);

        pool = factory.createPool(
            address(weth),
            address(usdc),
            poolOwner,
            INTEREST_RATE,
            LOAN_DURATION
        );

        // Approve tokens
        vm.startPrank(lender1);
        usdc.approve(address(pool), 1000 ether);
        vm.stopPrank();

        vm.startPrank(lender2);
        usdc.approve(address(pool), 1000 ether);
        vm.stopPrank();

        vm.startPrank(borrower);
        weth.approve(address(pool), 100 ether);
        vm.stopPrank();

        vm.startPrank(poolOwner);
        weth.approve(address(pool), 100 ether);
        vm.stopPrank();
    }

    function testProvideLiquidity() public {
        vm.startPrank(lender1);
        uint256 amount = 500 ether;

        pool.provideLiquidity(amount);

        uint256 balance = pool.getProviderBalance(lender1);
        assertEq(balance, amount);

        uint256 tvl = pool.getTVL();
        assertEq(tvl, amount);

        ILiquidityPool.PoolInfo memory poolInfo = pool.getPoolInfo();
        assertEq(poolInfo.totalLiquidity, amount);

        vm.stopPrank();
    }

    function testProvideLiquidityMultipleProviders() public {
        vm.startPrank(lender1);
        pool.provideLiquidity(500 ether);
        vm.stopPrank();

        vm.startPrank(lender2);
        pool.provideLiquidity(300 ether);

        uint256 balance1 = pool.getProviderBalance(lender1);
        uint256 balance2 = pool.getProviderBalance(lender2);
        uint256 tvl = pool.getTVL();

        assertEq(balance1, 500 ether);
        assertEq(balance2, 300 ether);
        assertEq(tvl, 800 ether);

        vm.stopPrank();
    }

    function testWithdrawLiquidity() public {
        // Get initial balance and check provider balance is 0
        uint256 initialBalance = usdc.balanceOf(lender1);
        uint256 initialProviderBalance = pool.getProviderBalance(lender1);
        assertEq(initialProviderBalance, 0);

        vm.startPrank(lender1);
        pool.provideLiquidity(500 ether);
        vm.stopPrank();

        // Check balance after providing liquidity
        uint256 midBalance = usdc.balanceOf(lender1);
        assertEq(midBalance, initialBalance - 500 ether);

        vm.startPrank(lender1);
        pool.withdrawLiquidity(200 ether);
        vm.stopPrank();

        uint256 balance = pool.getProviderBalance(lender1);
        assertEq(balance, 300 ether);

        uint256 finalBalance = usdc.balanceOf(lender1);
        assertEq(finalBalance, initialBalance - 300 ether); // Should be initial minus remaining liquidity
    }

    function testCannotWithdrawAfterLoanStarts() public {
        // Provide liquidity and activate loan
        vm.startPrank(lender1);
        pool.provideLiquidity(1000 ether);
        vm.stopPrank();

        vm.startPrank(poolOwner);
        pool.depositCollateral(10 ether);
        vm.stopPrank();

        factory.disburseLoan(address(pool));

        vm.expectRevert("Cannot withdraw while loan active");
        vm.startPrank(lender1);
        pool.withdrawLiquidity(100 ether);
        vm.stopPrank();
    }

    function testDepositCollateral() public {
        vm.startPrank(poolOwner);
        uint256 amount = 10 ether;

        pool.depositCollateral(amount);

        ILiquidityPool.PoolInfo memory poolInfo = pool.getPoolInfo();
        assertEq(poolInfo.totalCollateral, amount);

        vm.stopPrank();
    }

    function testDisburseLoan() public {
        // Provide liquidity
        vm.startPrank(lender1);
        pool.provideLiquidity(1000 ether);
        vm.stopPrank();

        // Deposit collateral
        vm.startPrank(poolOwner);
        pool.depositCollateral(10 ether);
        vm.stopPrank();

        factory.disburseLoan(address(pool));

        uint256 borrowerBalance = usdc.balanceOf(poolOwner);
        assertEq(borrowerBalance, 7 ether); // 70% LTV: 10 ether * 70% = 7 ether

        ILiquidityPool.PoolInfo memory poolInfo = pool.getPoolInfo();
        assertTrue(poolInfo.loanActive);
        assertEq(poolInfo.loanAmount, 7 ether);
    }

    function testCalculateInterest() public {
        // Activate loan
        _activateLoan();

        // Fast forward 15 days
        vm.warp(block.timestamp + 15 days);

        uint256 interest = pool.getInterestAccrued();
        assertGt(interest, 0); // Just check that interest is calculated
    }

    function testRepayLoan() public {
        _activateLoan();

        // Fast forward full loan duration
        vm.warp(block.timestamp + LOAN_DURATION);

        uint256 interest = pool.getInterestAccrued();
        uint256 totalRepayment = 7 ether + interest;

        // Add ETH for repayment
        vm.deal(poolOwner, totalRepayment);

        vm.startPrank(poolOwner);
        pool.repayLoan{value: totalRepayment}();

        // Check collateral returned (should be 10 ether + original 90 ether from setup)
        uint256 borrowerWethBalance = weth.balanceOf(poolOwner);
        assertEq(borrowerWethBalance, 100 ether);

        // Check loan no longer active
        ILiquidityPool.PoolInfo memory poolInfo = pool.getPoolInfo();
        assertFalse(poolInfo.loanActive);

        vm.stopPrank();
    }

    function testLoanDefault() public {
        _activateLoan();

        // Fast forward past grace period
        vm.warp(block.timestamp + LOAN_DURATION + 2 days);

        assertTrue(pool.isLoanDefaulted());
    }

    function testLiquidateCollateral() public {
        _activateLoan();

        // Fast forward past loan duration
        vm.warp(block.timestamp + LOAN_DURATION + 2 days);

        address liquidator = address(0x6);
        vm.startPrank(liquidator);
        pool.liquidateCollateral();

        uint256 liquidatorBalance = weth.balanceOf(liquidator);
        assertGt(liquidatorBalance, 0);

        ILiquidityPool.PoolInfo memory poolInfo = pool.getPoolInfo();
        assertEq(poolInfo.totalCollateral, 0);
        assertFalse(poolInfo.loanActive);

        vm.stopPrank();
    }

    function testLendingMathLibrary() public {
        uint256 collateralValue = LendingMath.calculateCollateralValue(10 ether, 2000e18); // 10 ETH * $2000
        assertEq(collateralValue, 20000e18); // $20,000

        uint256 maxLoan = LendingMath.calculateMaxLoanAmount(collateralValue, 7000); // 70% LTV
        assertEq(maxLoan, 14000e18); // $14,000

        uint256 interest = LendingMath.calculateAPRInterest(1000 ether, 1000, 30 days);
        assertGt(interest, 0); // Just check that interest is calculated
        assertLt(interest, 100 ether); // Reasonable upper bound
    }

    function _activateLoan() internal {
        // Provide liquidity
        vm.startPrank(lender1);
        pool.provideLiquidity(1000 ether);
        vm.stopPrank();

        // Deposit collateral and disburse loan
        vm.startPrank(poolOwner);
        pool.depositCollateral(10 ether);
        vm.stopPrank();

        factory.disburseLoan(address(pool));
    }
}