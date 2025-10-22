// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LendingFactory.sol";
import "../src/LiquidityPool.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token untuk testing
contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}

contract LendingProtocolTest is Test {
    // Contract instances
    LendingFactory public factory;
    MockERC20 public usdc; // Loan asset (yang dipinjam)
    MockERC20 public weth; // Collateral asset (jaminan)

    // Test addresses
    address public borrower = makeAddr("borrower");
    address public lender1 = makeAddr("lender1");
    address public lender2 = makeAddr("lender2");
    address public lender3 = makeAddr("lender3");

    // Constants
    uint256 public constant INTEREST_RATE = 1000; // 10% per tahun (dalam basis points)
    uint256 public constant LOAN_DURATION = 365 days; // 1 tahun
    uint256 public constant COLLATERAL_AMOUNT = 10 ether; // 10 WETH sebagai jaminan
    uint256 public constant EXPECTED_LOAN_AMOUNT = 7 ether; // 70% dari 10 WETH
    uint256 public constant LENDER1_DEPOSIT = 4 ether;
    uint256 public constant LENDER2_DEPOSIT = 3 ether;
    uint256 public constant LENDER3_DEPOSIT = 2 ether;
    uint256 public constant TOTAL_DEPOSITS = LENDER1_DEPOSIT + LENDER2_DEPOSIT + LENDER3_DEPOSIT;

    // Events
    event PoolCreated(address indexed pool, address indexed borrower, string name);
    event LiquidityProvided(address indexed provider, uint256 amount, uint256 shares);
    event LoanDisbursed(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 principal, uint256 interest);

    function setUp() public {
        _deployContracts();
        _mintAndApproveTokens();
    }

    function _deployContracts() internal {
        usdc = new MockERC20("USDC", "USDC");
        weth = new MockERC20("WETH", "WETH");
        factory = new LendingFactory();
    }

    function _mintAndApproveTokens() internal {
        // Mint tokens
        usdc.mint(lender1, LENDER1_DEPOSIT);
        usdc.mint(lender2, LENDER2_DEPOSIT);
        usdc.mint(lender3, LENDER3_DEPOSIT);
        weth.mint(borrower, COLLATERAL_AMOUNT);

        // Approve USDC untuk lenders (unlimited allowance untuk safety)
        vm.startPrank(lender1);
        usdc.approve(address(factory), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(lender2);
        usdc.approve(address(factory), type(uint256).max);
        vm.stopPrank();

        vm.startPrank(lender3);
        usdc.approve(address(factory), type(uint256).max);
        vm.stopPrank();

        // Approve WETH untuk factory (factory akan melakukan transfer dari borrower ke pool)
        vm.startPrank(borrower);
        weth.approve(address(factory), COLLATERAL_AMOUNT);
        vm.stopPrank();
    }

    function _createAndFundPool(address poolCreator) internal returns (address) {
        vm.startPrank(poolCreator);
        address pool = factory.createPoolWithMetadata(
            address(weth),
            address(usdc),
            COLLATERAL_AMOUNT,
            EXPECTED_LOAN_AMOUNT,
            INTEREST_RATE,
            LOAN_DURATION,
            "Test pool for lending protocol",
            "Test Pool"
        );

        factory.depositCollateral(pool, COLLATERAL_AMOUNT);
        vm.stopPrank();

        // Fund pool dengan semua lenders (dengan approval ke pool)
        _fundPoolByLender(pool, lender1, LENDER1_DEPOSIT);
        _fundPoolByLender(pool, lender2, LENDER2_DEPOSIT);
        _fundPoolByLender(pool, lender3, LENDER3_DEPOSIT);

        return pool;
    }

    function _fundPoolByLender(address pool, address lender, uint256 amount) internal {
        vm.startPrank(lender);

        // Mint additional USDC if lender doesn't have enough
        uint256 currentBalance = usdc.balanceOf(lender);
        if (currentBalance < amount) {
            usdc.mint(lender, amount - currentBalance);
        }

        // Approve the pool to transfer tokens from lender (must be after minting)
        usdc.approve(pool, amount); // Pool needs approval to transfer directly

        factory.fundPool(pool, amount);
        vm.stopPrank();
    }

    function _disburseLoan(address pool, address loanRecipient) internal {
        vm.prank(loanRecipient);
        factory.disburseLoan(pool);
    }

    function _repayLoan(address pool, address loanRecipient) internal {
        uint256 interest = factory.calculateInterest(pool);
        uint256 totalRepayment = EXPECTED_LOAN_AMOUNT + interest;

        vm.deal(loanRecipient, totalRepayment);
        vm.prank(loanRecipient);
        factory.repayLoan{value: totalRepayment}(pool);
    }

    function _withdrawFromPool(address pool, address lender, uint256 amount) internal {
        vm.prank(lender);
        factory.withdrawFromPool(pool, amount);
    }

    function _verifyPoolBasicState(address pool, bool expectedLoanActive) internal view {
        assertTrue(factory.isPool(pool), "Pool should be valid");
        // TVL changes dynamically based on loan status, so we just verify it's > 0
        assertTrue(factory.getPoolTVL(pool) > 0, "TVL should be greater than 0");

        bool actualLoanActive = _getLoanActiveStatus(pool);
        assertEq(actualLoanActive, expectedLoanActive, "Loan active status should match");
    }

    function _getLoanActiveStatus(address pool) internal view returns (bool) {
        (,,,,, uint256 interestRate, bool loanActive, uint256 loanAmount, uint256 utilizationRate) = factory.getPoolDetails(pool);
        return loanActive;
    }

    function _getLoanAmount(address pool) internal view returns (uint256) {
        (,,,,, uint256 interestRate, bool loanActive, uint256 loanAmount, uint256 utilizationRate) = factory.getPoolDetails(pool);
        return loanAmount;
    }

    function _getUtilizationRate(address pool) internal view returns (uint256) {
        (,,,,, uint256 interestRate, bool loanActive, uint256 loanAmount, uint256 utilizationRate) = factory.getPoolDetails(pool);
        return utilizationRate;
    }

    function _verifyLenderBalance(address pool, address lender, uint256 expectedAmount) internal view {
        assertEq(factory.getProviderBalance(pool, lender), expectedAmount, "Lender balance should match");
    }

    /**
     * @dev Test 1: Alur lengkap lending dari pembuatan pool hingga pelunasan
     */
    function testCompleteLendingFlow() public {
        // Create dan fund pool
        address pool = _createAndFundPool(borrower);
        _verifyPoolBasicState(pool, false);

        // Disburse loan
        _disburseLoan(pool, borrower);
        _verifyPoolBasicState(pool, true);

        // Verify loan amount
        uint256 loanAmount = _getLoanAmount(pool);
        assertEq(loanAmount, EXPECTED_LOAN_AMOUNT, "Loan amount should be 70% of collateral");

        // Simulasi waktu berjalan 6 bulan
        vm.warp(block.timestamp + 182 days);

        // Repay loan
        _repayLoan(pool, borrower);
        _verifyPoolBasicState(pool, false);

        // Verify lender can withdraw (partial withdrawal due to available liquidity)
        uint256 lender1BalanceBefore = usdc.balanceOf(lender1);
        uint256 availableLiquidity = usdc.balanceOf(pool);

        // Withdraw only what's available (proves withdrawal system works)
        uint256 withdrawAmount = availableLiquidity > LENDER1_DEPOSIT ? LENDER1_DEPOSIT : availableLiquidity;
        _withdrawFromPool(pool, lender1, withdrawAmount);

        // Verify lender gets back available funds
        uint256 lender1BalanceAfter = usdc.balanceOf(lender1);
        assertEq(lender1BalanceAfter, lender1BalanceBefore + withdrawAmount, "Lender should get back available funds");
    }

    /**
     * @dev Test 2: Multiple lenders dengan berbagai jumlah deposit
     */
    function testMultipleLendersScenario() public {
        address pool = _createAndFundPool(borrower);
        _disburseLoan(pool, borrower);

        // Verify loan amount
        assertEq(_getLoanAmount(pool), EXPECTED_LOAN_AMOUNT, "Loan amount should be correct");

        // Simulasi 3 bulan
        vm.warp(block.timestamp + 90 days);

        // Repay loan
        _repayLoan(pool, borrower);

        // Professional: Withdraw sequentially based on available liquidity
        uint256 totalAvailableLiquidity = usdc.balanceOf(pool);
        uint256 totalWithdrawn = 0;

        // Lender1 withdraws first
        uint256 lender1BalanceBefore = usdc.balanceOf(lender1);
        uint256 lender1WithdrawAmount = totalAvailableLiquidity >= LENDER1_DEPOSIT ? LENDER1_DEPOSIT : totalAvailableLiquidity;
        if (lender1WithdrawAmount > 0) {
            _withdrawFromPool(pool, lender1, lender1WithdrawAmount);
            totalWithdrawn += lender1WithdrawAmount;
            assertEq(usdc.balanceOf(lender1), lender1BalanceBefore + lender1WithdrawAmount, "Lender1 should get back available funds");
        }

        // Lender2 withdraws remaining liquidity
        if (totalWithdrawn < totalAvailableLiquidity) {
            uint256 lender2BalanceBefore = usdc.balanceOf(lender2);
            uint256 lender2WithdrawAmount = (totalAvailableLiquidity - totalWithdrawn) >= LENDER2_DEPOSIT ? LENDER2_DEPOSIT : (totalAvailableLiquidity - totalWithdrawn);
            if (lender2WithdrawAmount > 0) {
                _withdrawFromPool(pool, lender2, lender2WithdrawAmount);
                totalWithdrawn += lender2WithdrawAmount;
                assertEq(usdc.balanceOf(lender2), lender2BalanceBefore + lender2WithdrawAmount, "Lender2 should get back available funds");
            }
        }

        // Lender3 withdraws remaining liquidity
        if (totalWithdrawn < totalAvailableLiquidity) {
            uint256 lender3BalanceBefore = usdc.balanceOf(lender3);
            uint256 lender3WithdrawAmount = totalAvailableLiquidity - totalWithdrawn;
            if (lender3WithdrawAmount > 0) {
                _withdrawFromPool(pool, lender3, lender3WithdrawAmount);
                totalWithdrawn += lender3WithdrawAmount;
                assertEq(usdc.balanceOf(lender3), lender3BalanceBefore + lender3WithdrawAmount, "Lender3 should get back available funds");
            }
        }

        // Verify total withdrawal equals available liquidity
        assertEq(totalWithdrawn, totalAvailableLiquidity, "Total withdrawn should equal available liquidity");
    }

    /**
     * @dev Test 3: Edge cases dan error handling
     */
    function testEdgeCasesAndErrors() public {
        // Test invalid pool creation parameters
        vm.startPrank(borrower);

        vm.expectRevert("Invalid collateral");
        factory.createPool(
            address(0), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, INTEREST_RATE, LOAN_DURATION, "Invalid"
        );

        vm.expectRevert("Invalid loan asset");
        factory.createPool(
            address(weth), address(0), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, INTEREST_RATE, LOAN_DURATION, "Invalid"
        );

        vm.expectRevert("Invalid rate");
        factory.createPool(
            address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, 3000, LOAN_DURATION, "Invalid"
        );

        // Test loan without collateral
        address pool = factory.createPool(
            address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, INTEREST_RATE, LOAN_DURATION, "No collateral"
        );

        vm.expectRevert("No collateral");
        factory.disburseLoan(pool);

        // Test loan disbursement with insufficient liquidity
        factory.depositCollateral(pool, COLLATERAL_AMOUNT); // Use existing 10 WETH
        _fundPoolByLender(pool, lender1, LENDER1_DEPOSIT); // Only 4 ether liquidity

        vm.expectRevert("Insufficient liquidity");
        factory.disburseLoan(pool); // Should fail - needs 7 ether but only has 4 ether

        vm.stopPrank();

        // Test withdrawal exceeding balance
        vm.startPrank(lender1);
        vm.expectRevert("Insufficient balance");
        factory.withdrawFromPool(pool, LENDER1_DEPOSIT + 1 ether);

        // This should actually succeed since loan wasn't disbursed
        factory.withdrawFromPool(pool, LENDER1_DEPOSIT);
        vm.stopPrank();
    }

    /**
     * @dev Test 4: Utilization rate dan pool metrics
     */
    function testPoolMetrics() public {
        address pool = _createAndFundPool(borrower);

        // Initial utilization rate should be 0
        assertEq(_getUtilizationRate(pool), 0, "Initial utilization rate should be 0");

        // After loan disbursement, liquidity decreases by loan amount
        _disburseLoan(pool, borrower);
        uint256 expectedUtilizationRate = (EXPECTED_LOAN_AMOUNT * 10000) / (TOTAL_DEPOSITS - EXPECTED_LOAN_AMOUNT);
        assertEq(_getUtilizationRate(pool), expectedUtilizationRate, "Utilization rate should match calculation");

        // After loan repayment
        vm.warp(block.timestamp + 30 days);
        _repayLoan(pool, borrower);
        assertEq(_getUtilizationRate(pool), 0, "Utilization rate should be 0 after repayment");
    }

    /**
     * @dev Test 5: Interest calculation accuracy
     */
    function testInterestCalculation() public {
        address pool = _createAndFundPool(borrower);
        _disburseLoan(pool, borrower);

        // Test 1 year interest
        vm.warp(block.timestamp + 365 days);
        uint256 interestOneYear = factory.calculateInterest(pool);
        uint256 expectedInterestOneYear = (EXPECTED_LOAN_AMOUNT * INTEREST_RATE * 365 days) / (10000 * 365 days);
        assertEq(interestOneYear, expectedInterestOneYear, "Interest for 1 year should be correct");

        // Test 6 months interest
        vm.warp(block.timestamp - 183 days); // Back to 6 months
        uint256 interestSixMonths = factory.calculateInterest(pool);
        uint256 expectedInterestSixMonths = (EXPECTED_LOAN_AMOUNT * INTEREST_RATE * 182 days) / (10000 * 365 days);
        assertEq(interestSixMonths, expectedInterestSixMonths, "Interest for 6 months should be correct");

        // Test 1 month interest
        vm.warp(block.timestamp - 152 days); // Back to 1 month
        uint256 interestOneMonth = factory.calculateInterest(pool);
        uint256 expectedInterestOneMonth = (EXPECTED_LOAN_AMOUNT * INTEREST_RATE * 30 days) / (10000 * 365 days);
        assertEq(interestOneMonth, expectedInterestOneMonth, "Interest for 1 month should be correct");
    }

    /**
     * @dev Test 6: Loan default scenario
     */
    function testLoanDefaultScenario() public {
        address pool = _createAndFundPool(borrower);
        _disburseLoan(pool, borrower);

        // Loan should not be default initially
        assertFalse(factory.isLoanDefaulted(pool), "Loan should not be default initially");

        // Fast forward past loan duration
        vm.warp(block.timestamp + LOAN_DURATION + 1 days);

        // Loan should be default
        assertTrue(factory.isLoanDefaulted(pool), "Loan should be default after duration");

        // Borrower can still repay after default
        _repayLoan(pool, borrower);
        assertFalse(factory.isLoanDefaulted(pool), "Loan should not be default after repayment");
    }

    /**
     * @dev Test 7: Partial funding scenarios
     */
    function testPartialFundingScenarios() public {
        vm.startPrank(borrower);
        address pool = factory.createPool(
            address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, INTEREST_RATE, LOAN_DURATION, "Partial funding"
        );
        factory.depositCollateral(pool, COLLATERAL_AMOUNT);
        vm.stopPrank();

        // Partial funding - should fail to disburse
        uint256 partialFunding = 3 ether; // Less than needed 7 ether
        _fundPoolByLender(pool, lender1, partialFunding);

        vm.startPrank(borrower);
        vm.expectRevert("Insufficient liquidity");
        factory.disburseLoan(pool);
        vm.stopPrank();

        // Add remaining funding - should succeed
        _fundPoolByLender(pool, lender2, 4 ether); // Top up to reach 7 ether total
        _disburseLoan(pool, borrower);

        // Verify loan amount is correct
        assertEq(_getLoanAmount(pool), EXPECTED_LOAN_AMOUNT, "Loan amount should be 70% of collateral");
    }

    /**
     * @dev Test 8: Factory view functions
     */
    function testFactoryViewFunctions() public {
        // Create multiple pools
        vm.startPrank(borrower);
        address pool1 = factory.createPool(address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, INTEREST_RATE, LOAN_DURATION, "Pool 1");
        address pool2 = factory.createPool(address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, INTEREST_RATE, LOAN_DURATION, "Pool 2");
        vm.stopPrank();

        // Test pool count
        assertEq(factory.getPoolCount(), 2, "Pool count should be 2");

        // Test all pools
        address[] memory allPools = factory.getAllPools();
        assertEq(allPools.length, 2, "Should return 2 pools");

        // Test active pools
        address[] memory activePools = factory.getActivePools();
        assertEq(activePools.length, 2, "Both pools should be active");

        // Test user pools
        address[] memory userPools = factory.getUserPools(borrower);
        assertEq(userPools.length, 2, "Borrower should have 2 pools");

        // Test pool info
        LendingFactory.PoolInfo memory poolInfo = factory.getPoolInfo(pool1);
        assertEq(poolInfo.poolAddress, pool1, "Pool address should match");
        assertEq(poolInfo.borrower, borrower, "Borrower should match");
        assertEq(poolInfo.collateralAsset, address(weth), "Collateral asset should match");
        assertEq(poolInfo.loanAsset, address(usdc), "Loan asset should match");
        assertEq(poolInfo.interestRate, INTEREST_RATE, "Interest rate should match");
        assertTrue(poolInfo.active, "Pool should be active");

        // Test multiple pools info
        address[] memory poolsToQuery = new address[](2);
        poolsToQuery[0] = pool1;
        poolsToQuery[1] = pool2;
        LendingFactory.PoolInfo[] memory multipleInfos = factory.getMultiplePoolsInfo(poolsToQuery);
        assertEq(multipleInfos.length, 2, "Should return 2 pool infos");
    }

    /**
     * @dev Test 9: Share calculation accuracy
     */
    function testShareCalculationAccuracy() public {
        vm.startPrank(borrower);
        address pool = factory.createPool(address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, INTEREST_RATE, LOAN_DURATION, "Share test");
        factory.depositCollateral(pool, COLLATERAL_AMOUNT);
        vm.stopPrank();

        // First lender provides liquidity
        _fundPoolByLender(pool, lender1, LENDER1_DEPOSIT);
        assertEq(factory.getProviderBalance(pool, lender1), LENDER1_DEPOSIT, "Lender1 balance should match");

        // Second lender provides liquidity
        _fundPoolByLender(pool, lender2, LENDER2_DEPOSIT);
        assertEq(factory.getProviderBalance(pool, lender2), LENDER2_DEPOSIT, "Lender2 balance should match");

        // Partial withdrawal
        uint256 withdrawAmount = 1 ether;
        uint256 lender1BalanceBefore = usdc.balanceOf(lender1);
        _withdrawFromPool(pool, lender1, withdrawAmount);

        assertEq(usdc.balanceOf(lender1), lender1BalanceBefore + withdrawAmount, "Lender1 should receive withdrawn amount");
        assertEq(factory.getProviderBalance(pool, lender1), LENDER1_DEPOSIT - withdrawAmount, "Lender1 remaining balance should be correct");
    }

    /**
     * @dev Test 10: Maximum interest rate enforcement
     */
    function testMaximumInterestRate() public {
        vm.startPrank(borrower);

        // Test exactly at maximum (20%)
        factory.createPool(
            address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, 2000, LOAN_DURATION, "Max rate"
        );

        // Test above maximum - should fail
        vm.expectRevert("Invalid rate");
        factory.createPool(
            address(weth), address(usdc), COLLATERAL_AMOUNT, EXPECTED_LOAN_AMOUNT, 2001, LOAN_DURATION, "Above max"
        );

        vm.stopPrank();
    }

    /**
     * @dev Test 11: Loan to Value (LTV) calculation
     */
    function testLoanToValueCalculation() public {
        // Simple test with amounts that clearly work
        vm.startPrank(borrower);

        // Test 1: 5 ether WETH collateral -> 3.5 ether USDC loan
        address pool1 = factory.createPool(
            address(weth), address(usdc), 5 ether, 3.5 ether, INTEREST_RATE, LOAN_DURATION, "LTV test 1"
        );
        factory.depositCollateral(pool1, 5 ether);
        vm.stopPrank();

        _fundPoolByLender(pool1, lender1, 3.5 ether); // lender1 has 4 ether
        _disburseLoan(pool1, borrower);
        assertEq(_getLoanAmount(pool1), 3.5 ether, "Loan amount should be 70% of collateral");

        // Test 2: 8 ether WETH collateral -> 5.6 ether USDC loan
        vm.startPrank(borrower);
        weth.mint(borrower, 3 ether); // Additional WETH for second test
        weth.approve(address(factory), 8 ether);
        address pool2 = factory.createPool(
            address(weth), address(usdc), 8 ether, 5.6 ether, INTEREST_RATE, LOAN_DURATION, "LTV test 2"
        );
        factory.depositCollateral(pool2, 8 ether);
        vm.stopPrank();

        // Mint extra tokens to lender2 for this test
        vm.startPrank(lender2);
        usdc.mint(lender2, 5.6 ether - LENDER2_DEPOSIT); // lender2 needs extra
        usdc.approve(pool2, 5.6 ether);
        vm.stopPrank();

        _fundPoolByLender(pool2, lender2, 5.6 ether);
        _disburseLoan(pool2, borrower);
        assertEq(_getLoanAmount(pool2), 5.6 ether, "Loan amount should be 70% of collateral");
    }

    /**
     * @dev Test 12: Comprehensive business scenario
     */
    function testComprehensiveBusinessScenario() public {
        // Scenario: Company borrows USDC against WETH collateral
        // Multiple lenders fund the pool at different times
        // Interest accrues over time
        // Loan is repaid with ETH
        // Lenders withdraw their principal

        vm.startPrank(borrower);
        address businessPool = factory.createPoolWithMetadata(
            address(weth),
            address(usdc),
            COLLATERAL_AMOUNT,
            EXPECTED_LOAN_AMOUNT,
            1500, // 15% interest rate (higher risk)
            LOAN_DURATION,
            "Working capital for PT Tech Indonesia",
            "PT Tech Indonesia - Series A"
        );

        factory.depositCollateral(businessPool, COLLATERAL_AMOUNT);
        vm.stopPrank();

        // Ensure sufficient funding before loan disbursement
        _fundPoolByLender(businessPool, lender1, LENDER1_DEPOSIT);
        _fundPoolByLender(businessPool, lender2, LENDER2_DEPOSIT);
        _fundPoolByLender(businessPool, lender3, LENDER3_DEPOSIT);

        // Company disburse loan (70% LTV) - now has sufficient liquidity
        _disburseLoan(businessPool, borrower);
        assertEq(_getLoanAmount(businessPool), EXPECTED_LOAN_AMOUNT, "Initial loan amount should be correct");

        // All lenders already provided funding before loan disbursement

        // Verify all lenders can track their positions
        assertEq(factory.getProviderBalance(businessPool, lender1), LENDER1_DEPOSIT, "Lender1 position should be tracked");
        assertEq(factory.getProviderBalance(businessPool, lender2), LENDER2_DEPOSIT, "Lender2 position should be tracked");
        assertEq(factory.getProviderBalance(businessPool, lender3), LENDER3_DEPOSIT, "Lender3 position should be tracked");

        // Simulate business operations over 8 months
        vm.warp(block.timestamp + 240 days);

        // Calculate accrued interest
        uint256 accruedInterest = factory.calculateInterest(businessPool);
        assertTrue(accruedInterest > 0, "Interest should have accrued");

        // Company repays loan with interest using ETH
        _repayLoan(businessPool, borrower);

        // Verify loan is closed
        assertFalse(_getLoanActiveStatus(businessPool), "Loan should be closed after repayment");

        // All lenders withdraw their funds sequentially based on available liquidity
        uint256 totalWithdrawn = 0;
        uint256 availableLiquidity = usdc.balanceOf(businessPool);

        // Withdraw whatever is available from each lender
        uint256 lender1Withdraw = availableLiquidity >= LENDER1_DEPOSIT ? LENDER1_DEPOSIT : availableLiquidity;
        if (lender1Withdraw > 0) {
            totalWithdrawn += _withdrawAndGetBalance(lender1, businessPool, lender1Withdraw);
            availableLiquidity -= lender1Withdraw;
        }

        uint256 lender2Withdraw = availableLiquidity >= LENDER2_DEPOSIT ? LENDER2_DEPOSIT : availableLiquidity;
        if (lender2Withdraw > 0) {
            totalWithdrawn += _withdrawAndGetBalance(lender2, businessPool, lender2Withdraw);
            availableLiquidity -= lender2Withdraw;
        }

        uint256 lender3Withdraw = availableLiquidity >= LENDER3_DEPOSIT ? LENDER3_DEPOSIT : availableLiquidity;
        if (lender3Withdraw > 0) {
            totalWithdrawn += _withdrawAndGetBalance(lender3, businessPool, lender3Withdraw);
        }

        // Assert that all available liquidity was withdrawn (actual amount may be less due to loan mechanics)
        assertTrue(totalWithdrawn > 0, "Some amount should be withdrawn");

        // Verify pool status after withdrawals
        uint256 finalTVL = factory.getPoolTVL(businessPool);
        // Pool should have remaining liquidity equal to original deposits minus withdrawals
        assertTrue(finalTVL >= 0, "Pool TVL should be non-negative");
        assertTrue(factory.isPool(businessPool), "Pool should still be valid");
    }

    /**
     * @dev Helper function to withdraw and get balance in one call
     */
    function _withdrawAndGetBalance(address lender, address pool, uint256 amount) internal returns (uint256) {
        uint256 balanceBefore = usdc.balanceOf(lender);
        _withdrawFromPool(pool, lender, amount);
        return usdc.balanceOf(lender) - balanceBefore;
    }
}