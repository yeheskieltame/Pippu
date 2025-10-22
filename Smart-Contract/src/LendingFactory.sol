// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/ILendingFactory.sol";
import "./interfaces/ILiquidityPool.sol";
import "./LiquidityPool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LendingFactory is ILendingFactory, Ownable, ReentrancyGuard {
    address[] public allPools;
    mapping(address => bool) public poolExists;
    mapping(address => LoanProposal) public poolToProposal;
    mapping(address => address[]) public userPools;

    uint256 public poolCounter;
    address public liquidityPoolImplementation;

    modifier validPool(address pool) {
        require(poolExists[pool], "Pool does not exist");
        _;
    }

    modifier onlyBorrower(address pool) {
        require(poolToProposal[pool].borrower == msg.sender, "Not the borrower");
        _;
    }

    constructor(address _owner) Ownable(_owner) {
        liquidityPoolImplementation = address(new LiquidityPool(
            address(0), address(0), _owner, 0, 0, address(this)
        ));
    }

    function createPool(
        address collateralAsset,
        address loanAsset,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        string calldata description
    ) external override nonReentrant returns (address pool) {
        require(collateralAsset != address(0), "Invalid collateral asset");
        require(loanAsset != address(0), "Invalid loan asset");
        require(collateralAmount > 0, "Invalid collateral amount");
        require(loanAmount > 0, "Invalid loan amount");
        require(interestRate > 0 && interestRate <= 3000, "Invalid interest rate (max 30%)");
        require(loanDuration > 0, "Invalid loan duration");
        require(bytes(description).length > 0, "Description required");

        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp, poolCounter));
        pool = address(new LiquidityPool{salt: salt}(
            collateralAsset,
            loanAsset,
            msg.sender,
            interestRate,
            loanDuration,
            address(this)
        ));

        LoanProposal memory proposal = LoanProposal({
            borrower: msg.sender,
            collateralAsset: collateralAsset,
            loanAsset: loanAsset,
            collateralAmount: collateralAmount,
            loanAmountRequested: loanAmount,
            interestRate: interestRate,
            loanDuration: loanDuration,
            description: description,
            active: true,
            liquidityPool: pool
        });

        allPools.push(pool);
        poolExists[pool] = true;
        poolToProposal[pool] = proposal;
        userPools[msg.sender].push(pool);
        poolCounter++;

        emit PoolCreated(pool, msg.sender, collateralAsset, loanAsset, loanAmount);
        emit ProposalCreated(msg.sender, pool, loanAmount, interestRate);

        return pool;
    }

    function fundPool(address pool, uint256 amount) external validPool(pool) nonReentrant {
        require(poolToProposal[pool].active, "Pool not active");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from caller to pool first
        IERC20(poolToProposal[pool].loanAsset).transferFrom(msg.sender, pool, amount);

        // Then call provideLiquidity with the actual lender as provider
        LiquidityPool(pool).provideLiquidityFor(msg.sender, amount);
    }

    function withdrawFromPool(address pool, uint256 amount) external validPool(pool) nonReentrant {
        require(poolToProposal[pool].active, "Pool not active");

        LiquidityPool(pool).withdrawLiquidity(amount);
    }

    function depositCollateral(address pool, uint256 amount) external validPool(pool) nonReentrant {
        require(poolToProposal[pool].active, "Pool not active");
        require(poolToProposal[pool].borrower == msg.sender, "Not the borrower");

        IERC20(poolToProposal[pool].collateralAsset).transferFrom(msg.sender, pool, amount);
        LiquidityPool(pool).depositCollateralFor(msg.sender, amount);
    }

    function disburseLoan(address pool) external validPool(pool) onlyBorrower(pool) nonReentrant {
        require(poolToProposal[pool].active, "Pool not active");

        LiquidityPool(pool).disburseLoan();
    }

    function liquidateCollateral(address pool) external validPool(pool) nonReentrant {
        require(poolToProposal[pool].active, "Pool not active");

        LiquidityPool(pool).liquidateCollateral();
    }

    function repayLoan(address pool) external payable validPool(pool) nonReentrant {
        require(poolToProposal[pool].borrower == msg.sender, "Not the borrower");

        LiquidityPool(pool).repayLoan{value: msg.value}();
    }

    function closePool(address pool) external validPool(pool) onlyBorrower(pool) nonReentrant {
        require(!LiquidityPool(pool).isLoanDefaulted(), "Loan is defaulted");
        require(!LiquidityPool(pool).getPoolInfo().loanActive, "Loan still active");

        poolToProposal[pool].active = false;
    }

    function getPoolCount() external view override returns (uint256) {
        return allPools.length;
    }

    function getPoolAddress(uint256 index) external view override returns (address) {
        require(index < allPools.length, "Index out of bounds");
        return allPools[index];
    }

    function getProposalByPool(address pool) external view override returns (LoanProposal memory) {
        require(poolExists[pool], "Pool does not exist");
        return poolToProposal[pool];
    }

    function getAllPools() external view override returns (address[] memory) {
        return allPools;
    }

    function getActivePools() external view override returns (address[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allPools.length; i++) {
            if (poolToProposal[allPools[i]].active) {
                activeCount++;
            }
        }

        address[] memory activePools = new address[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allPools.length; i++) {
            if (poolToProposal[allPools[i]].active) {
                activePools[index] = allPools[i];
                index++;
            }
        }

        return activePools;
    }

    function getUserPools(address user) external view override returns (address[] memory) {
        return userPools[user];
    }

    function getPoolTVL(address pool) external view returns (uint256) {
        require(poolExists[pool], "Pool does not exist");
        return LiquidityPool(pool).getTVL();
    }

    function getPoolInfo(address pool) external view returns (ILiquidityPool.PoolInfo memory) {
        require(poolExists[pool], "Pool does not exist");
        return LiquidityPool(pool).getPoolInfo();
    }

    function getProviderBalance(address pool, address provider) external view returns (uint256) {
        require(poolExists[pool], "Pool does not exist");
        return LiquidityPool(pool).getProviderBalance(provider);
    }

    function calculateInterest(address pool) external view returns (uint256) {
        require(poolExists[pool], "Pool does not exist");
        return LiquidityPool(pool).calculateInterest();
    }

    function isLoanDefaulted(address pool) external view returns (bool) {
        require(poolExists[pool], "Pool does not exist");
        return LiquidityPool(pool).isLoanDefaulted();
    }

    function getActivePoolsByAsset(address loanAsset) external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allPools.length; i++) {
            if (poolToProposal[allPools[i]].active &&
                poolToProposal[allPools[i]].loanAsset == loanAsset) {
                count++;
            }
        }

        address[] memory pools = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allPools.length; i++) {
            if (poolToProposal[allPools[i]].active &&
                poolToProposal[allPools[i]].loanAsset == loanAsset) {
                pools[index] = allPools[i];
                index++;
            }
        }

        return pools;
    }

    function getPoolStats() external view returns (
        uint256 totalPools,
        uint256 activePools,
        uint256 totalTVL
    ) {
        totalPools = allPools.length;

        for (uint256 i = 0; i < allPools.length; i++) {
            if (poolToProposal[allPools[i]].active) {
                activePools++;
                totalTVL += LiquidityPool(allPools[i]).getTVL();
            }
        }
    }
}