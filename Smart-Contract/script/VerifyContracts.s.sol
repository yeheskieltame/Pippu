// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/LendingFactory.sol";
import "../src/LiquidityPool.sol";

contract VerifyContracts is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory etherscanApiKey = vm.envString("BASESCAN_API_KEY");

        address factoryAddress = vm.envAddress("FACTORY_ADDRESS");

        console.log("Verifying contracts...");
        console.log("Factory address:", factoryAddress);

        // Verify LendingFactory
        vm.startBroadcast(deployerPrivateKey);

        // The verification command will be executed after deployment
        // This script structure allows for easy verification with forge verify-contract

        vm.stopBroadcast();

        console.log("Contract verification setup completed!");
        console.log("Run the following commands to verify:");
        console.log("forge verify-contract --chain-id 84532 --etherscan-api-key $BASESCAN_API_KEY", factoryAddress, "src/LendingFactory.sol:LendingFactory");
    }
}