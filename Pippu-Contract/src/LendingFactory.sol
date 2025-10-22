// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./LiquidityPool.sol";

contract LendingFactory is Ownable(msg.sender), ReentrancyGuard {
    using SafeERC20 for IERC20;
    struct PoolInfo {
        address poolAddress;
        address borrower;
        address collateralAsset;
        address loanAsset;
        uint256 interestRate;
        string name;
        bool active;
    }

    // State variables
    address[] public allPools;
    mapping(address => bool) public isPool;
    mapping(address => PoolInfo) public poolInfos;
    mapping(address => address[]) public userPools;

    uint256 public poolCount;

    // Constants
    uint256 private constant MAX_INTEREST_RATE = 2000; // 20%

    // Events
    event PoolCreated(address indexed pool, address indexed borrower, string name);

    modifier validPool(address pool) {
        require(isPool[pool], "Invalid pool");
        _;
    }

    function createPool(
        address collateralAsset,
        address loanAsset,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        string calldata description
    ) external nonReentrant returns (address) {
        return _createPool(collateralAsset, loanAsset, collateralAmount, loanAmount, interestRate, loanDuration, description, "Pool");
    }

    function createPoolWithMetadata(
        address collateralAsset,
        address loanAsset,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        string calldata description,
        string calldata name
    ) external nonReentrant returns (address) {
        require(bytes(name).length > 0, "Name required");
        return _createPool(collateralAsset, loanAsset, collateralAmount, loanAmount, interestRate, loanDuration, description, name);
    }

    function _createPool(
        address collateralAsset,
        address loanAsset,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        string memory description,
        string memory name
    ) internal returns (address) {
        // Validation
        require(collateralAsset != address(0), "Invalid collateral");
        require(loanAsset != address(0), "Invalid loan asset");
        require(collateralAmount > 0, "Collateral > 0");
        require(loanAmount > 0, "Loan amount > 0");
        require(interestRate > 0 && interestRate <= MAX_INTEREST_RATE, "Invalid rate");
        require(bytes(description).length > 0, "Description required");

        // Create new pool
        LiquidityPool newPool = new LiquidityPool(
            collateralAsset,
            loanAsset,
            msg.sender,
            interestRate,
            loanDuration
        );

        address poolAddress = address(newPool);

        // Store pool info
        poolInfos[poolAddress] = PoolInfo({
            poolAddress: poolAddress,
            borrower: msg.sender,
            collateralAsset: collateralAsset,
            loanAsset: loanAsset,
            interestRate: interestRate,
            name: name,
            active: true
        });

        // Update tracking
        allPools.push(poolAddress);
        isPool[poolAddress] = true;
        userPools[msg.sender].push(poolAddress);
        poolCount++;

        emit PoolCreated(poolAddress, msg.sender, name);

        return poolAddress;
    }

    function fundPool(address pool, uint256 amount) external nonReentrant validPool(pool) {
        LiquidityPool liquidityPool = LiquidityPool(pool);

        // Catat liquidity di pool (pool akan melakukan transfer langsung)
        liquidityPool.provideLiquidityFromFactory(msg.sender, amount);
    }

    function withdrawFromPool(address pool, uint256 amount) external nonReentrant validPool(pool) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        liquidityPool.withdrawLiquidityFromFactory(msg.sender, amount);
    }

    function depositCollateral(address pool, uint256 amount) external nonReentrant validPool(pool) {
        LiquidityPool liquidityPool = LiquidityPool(pool);

        // Get collateral asset dari pool info
        address collateralAsset = poolInfos[pool].collateralAsset;

        // Transfer dari msg.sender ke factory, lalu factory transfer ke pool
        IERC20(collateralAsset).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(collateralAsset).safeTransfer(address(liquidityPool), amount);

        // Catat collateral di pool
        liquidityPool.depositCollateralFromFactory(amount);
    }

    function disburseLoan(address pool) external nonReentrant validPool(pool) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        liquidityPool.disburseLoan();
    }

    function repayLoan(address pool) external payable nonReentrant validPool(pool) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        liquidityPool.repayLoan{value: msg.value}();
    }

    // View functions
    function getPoolCount() external view returns (uint256) {
        return poolCount;
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    function getActivePools() external view returns (address[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allPools.length; i++) {
            if (poolInfos[allPools[i]].active) {
                activeCount++;
            }
        }

        address[] memory activePools = new address[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allPools.length; i++) {
            if (poolInfos[allPools[i]].active) {
                activePools[index] = allPools[i];
                index++;
            }
        }

        return activePools;
    }

    function getPoolInfo(address pool) external view returns (PoolInfo memory) {
        return poolInfos[pool];
    }

    function getUserPools(address user) external view returns (address[] memory) {
        return userPools[user];
    }

    function getPoolTVL(address pool) external view returns (uint256) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        return liquidityPool.getTVL();
    }

    function getPoolDetails(address pool) external view returns (
        address collateralAsset,
        address loanAsset,
        uint256 totalCollateral,
        uint256 totalLiquidity,
        uint256 totalLoaned,
        uint256 interestRate,
        bool loanActive,
        uint256 loanAmount,
        uint256 utilizationRate
    ) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        return liquidityPool.getPoolInfo();
    }

    function getProviderBalance(address pool, address provider) external view returns (uint256) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        return liquidityPool.getProviderBalance(provider);
    }

    function isLoanDefaulted(address pool) external view returns (bool) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        return liquidityPool.isLoanDefaulted();
    }

    function calculateInterest(address pool) external view returns (uint256) {
        LiquidityPool liquidityPool = LiquidityPool(pool);
        return liquidityPool.calculateInterest();
    }

    function getMultiplePoolsInfo(address[] calldata pools) external view returns (PoolInfo[] memory) {
        PoolInfo[] memory infos = new PoolInfo[](pools.length);
        for (uint256 i = 0; i < pools.length; i++) {
            infos[i] = poolInfos[pools[i]];
        }
        return infos;
    }
}