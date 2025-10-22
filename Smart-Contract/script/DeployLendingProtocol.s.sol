// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/LendingFactory.sol";

contract DeployLendingProtocol is Script {
    LendingFactory public factory;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts with address:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        factory = new LendingFactory(deployer);

        vm.stopBroadcast();

        console.log("LendingFactory deployed at:", address(factory));
        console.log("Deployment completed successfully!");
    }
}