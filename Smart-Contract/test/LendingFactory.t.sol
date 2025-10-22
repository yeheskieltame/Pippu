// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/LendingFactory.sol";
import "../src/LiquidityPool.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract LendingFactoryTest is Test {
    LendingFactory public factory;
    MockERC20 public usdc;
    MockERC20 public weth;

    address public borrower = address(0x1);
    address public lender1 = address(0x2);
    address public lender2 = address(0x3);
    address public liquidator = address(0x4);

    uint256 public constant COLLATERAL_AMOUNT = 10 ether;
    uint256 public constant LOAN_AMOUNT = 700 ether; // 70% of collateral
    uint256 public constant INTEREST_RATE = 1000; // 10% APR
    uint256 public constant LOAN_DURATION = 30 days;

    function setUp() public {
        address owner = vm.addr(1);
        factory = new LendingFactory(owner);
        usdc = new MockERC20("USDC", "USDC");
        weth = new MockERC20("WETH", "WETH");

        // Mint tokens for testing
        usdc.mint(borrower, 1000 ether);
        usdc.mint(lender1, 1000 ether);
        usdc.mint(lender2, 1000 ether);
        weth.mint(borrower, 100 ether);
        weth.mint(liquidator, 100 ether);

        // Approve tokens to factory
        vm.startPrank(borrower);
        usdc.approve(address(factory), 1000 ether);
        weth.approve(address(factory), 100 ether);
        vm.stopPrank();

        vm.startPrank(lender1);
        usdc.approve(address(factory), 1000 ether);
        vm.stopPrank();

        vm.startPrank(lender2);
        usdc.approve(address(factory), 1000 ether);
        vm.stopPrank();
    }

    function testCreatePool() public {
        vm.startPrank(borrower);

        address pool = factory.createPool(
            address(weth),
            address(usdc),
            COLLATERAL_AMOUNT,
            LOAN_AMOUNT,
            INTEREST_RATE,
            LOAN_DURATION,
            "Test loan proposal"
        );

        assertTrue(factory.poolExists(pool));
        assertEq(factory.getPoolCount(), 1);
        assertEq(factory.getPoolAddress(0), pool);

        ILendingFactory.LoanProposal memory proposal = factory.getProposalByPool(pool);
        assertEq(proposal.borrower, borrower);
        assertEq(proposal.collateralAsset, address(weth));
        assertEq(proposal.loanAsset, address(usdc));
        assertEq(proposal.loanAmountRequested, LOAN_AMOUNT);
        assertEq(proposal.interestRate, INTEREST_RATE);
        assertTrue(proposal.active);

        vm.stopPrank();
    }

    function testCreatePoolInvalidParameters() public {
        vm.startPrank(borrower);

        vm.expectRevert("Invalid collateral asset");
        factory.createPool(
            address(0),
            address(usdc),
            COLLATERAL_AMOUNT,
            LOAN_AMOUNT,
            INTEREST_RATE,
            LOAN_DURATION,
            "Test"
        );

        vm.expectRevert("Invalid interest rate (max 30%)");
        factory.createPool(
            address(weth),
            address(usdc),
            COLLATERAL_AMOUNT,
            LOAN_AMOUNT,
            5000, // 50% > 30% max
            LOAN_DURATION,
            "Test"
        );

        vm.stopPrank();
    }

    function testFundPool() public {
        address pool = _createTestPool();

        vm.startPrank(lender1);
        uint256 fundAmount = 800 ether;

        factory.fundPool(pool, fundAmount);

        uint256 balance = factory.getProviderBalance(pool, lender1);
        assertEq(balance, fundAmount);

        uint256 tvl = factory.getPoolTVL(pool);
        assertEq(tvl, fundAmount);

        vm.stopPrank();
    }

    function testDepositCollateralAndDisburseLoan() public {
        address pool = _createTestPool();

        // Fund the pool
        vm.startPrank(lender1);
        factory.fundPool(pool, 800 ether);
        vm.stopPrank();

        // Deposit collateral
        vm.startPrank(borrower);
        weth.approve(pool, COLLATERAL_AMOUNT);
        factory.depositCollateral(pool, COLLATERAL_AMOUNT);

        // Disburse loan
        factory.disburseLoan(pool);

        uint256 borrowerBalance = usdc.balanceOf(borrower);
        assertEq(borrowerBalance, 700 ether); // 70% of collateral value

        ILiquidityPool.PoolInfo memory poolInfo = factory.getPoolInfo(pool);
        assertTrue(poolInfo.loanActive);
        assertEq(poolInfo.loanAmount, 700 ether);

        vm.stopPrank();
    }

    function testRepayLoan() public {
        address pool = _createAndActivatePool();

        vm.startPrank(borrower);

        // Repay loan with interest
        uint256 interest = factory.calculateInterest(pool);
        uint256 totalRepayment = 700 ether + interest;

        // Add extra ETH for repayment
        vm.deal(borrower, totalRepayment);

        factory.repayLoan{value: totalRepayment}(pool);

        // Check collateral returned
        uint256 borrowerWethBalance = weth.balanceOf(borrower);
        assertEq(borrowerWethBalance, COLLATERAL_AMOUNT);

        // Check loan no longer active
        ILiquidityPool.PoolInfo memory poolInfo = factory.getPoolInfo(pool);
        assertFalse(poolInfo.loanActive);

        vm.stopPrank();
    }

    function testLiquidateCollateral() public {
        address pool = _createAndActivatePool();

        // Fast forward past loan duration
        vm.warp(block.timestamp + LOAN_DURATION + 2 days);

        vm.startPrank(liquidator);
        factory.liquidateCollateral(pool);

        uint256 liquidatorBalance = weth.balanceOf(liquidator);
        assertGt(liquidatorBalance, 0);

        ILiquidityPool.PoolInfo memory poolInfo = factory.getPoolInfo(pool);
        assertEq(poolInfo.totalCollateral, 0);
        assertFalse(poolInfo.loanActive);

        vm.stopPrank();
    }

    function testGetActivePools() public {
        address pool1 = _createTestPool();
        address pool2 = _createTestPool();

        address[] memory activePools = factory.getActivePools();
        assertEq(activePools.length, 2);

        // Close one pool
        vm.startPrank(borrower);
        factory.closePool(pool1);
        vm.stopPrank();

        activePools = factory.getActivePools();
        assertEq(activePools.length, 1);
        assertEq(activePools[0], pool2);
    }

    function testGetUserPools() public {
        address pool1 = _createTestPool();
        address pool2 = _createTestPool();

        address[] memory userPools = factory.getUserPools(borrower);
        assertEq(userPools.length, 2);
        assertEq(userPools[0], pool1);
        assertEq(userPools[1], pool2);
    }

    function testGetPoolStats() public {
        _createTestPool();
        _createTestPool();

        (uint256 totalPools, uint256 activePools, uint256 totalTVL) = factory.getPoolStats();
        assertEq(totalPools, 2);
        assertEq(activePools, 2);
        assertEq(totalTVL, 0); // No liquidity provided yet

        address pool = factory.allPools(0);
        vm.startPrank(lender1);
        factory.fundPool(pool, 500 ether);
        vm.stopPrank();

        (, , totalTVL) = factory.getPoolStats();
        assertEq(totalTVL, 500 ether);
    }

    function _createTestPool() internal returns (address) {
        vm.startPrank(borrower);
        address pool = factory.createPool(
            address(weth),
            address(usdc),
            COLLATERAL_AMOUNT,
            LOAN_AMOUNT,
            INTEREST_RATE,
            LOAN_DURATION,
            "Test loan proposal"
        );
        vm.stopPrank();
        return pool;
    }

    function _createAndActivatePool() internal returns (address) {
        address pool = _createTestPool();

        // Fund the pool
        vm.startPrank(lender1);
        factory.fundPool(pool, 800 ether);
        vm.stopPrank();

        // Deposit collateral and disburse loan
        vm.startPrank(borrower);
        weth.approve(pool, COLLATERAL_AMOUNT);
        factory.depositCollateral(pool, COLLATERAL_AMOUNT);
        factory.disburseLoan(pool);
        vm.stopPrank();

        return pool;
    }
}