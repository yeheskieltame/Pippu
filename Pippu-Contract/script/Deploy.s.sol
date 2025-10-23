// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/LendingFactory.sol";
import "../src/LiquidityPool.sol";

contract DeployScript is Script {
    // Base Sepolia token addresses
    address constant WETH = 0x4200000000000000000000000000000000000006;
    address constant USDC = 0x036CBD5429286c61B3596927D7A3A475f7b3EE9c;
    address constant USDbC = 0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying to Base Sepolia");
        console.log("Deployer address:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy LendingFactory
        console.log("\n1. Deploying LendingFactory...");
        LendingFactory factory = new LendingFactory();
        console.log("LendingFactory deployed at:", address(factory));

        // Create sample pool
        console.log("\n2. Creating sample pool...");
        address samplePool = factory.createPoolWithMetadata(
            WETH,                                          // collateralAsset
            USDC,                                          // loanAsset
            1 ether,                                       // collateralAmount
            2000 * 1e6,                                   // loanAmount (2000 USDC)
            500,                                           // interestRate (5%)
            30 days,                                       // loanDuration
            "Sample WETH-USDC lending pool",              // description
            "WETH-USDC Pool"                               // name
        );
        console.log("Sample pool created at:", samplePool);

        vm.stopBroadcast();

        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Network: Base Sepolia");
        console.log("LendingFactory:", address(factory));
        console.log("Sample Pool:", samplePool);
        console.log("Explorer: https://sepolia.basescan.org/address/", address(factory));
    }
}