// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/mock/MockWETH.sol";
import "../src/mock/MockUSDC.sol";
import "../src/mock/MockDAI.sol";
import "../src/mock/TokenFaucet.sol";

/**
 * @title DeployMockTokens
 * Script to deploy mock tokens and faucet for testing on Base Sepolia
 */
contract DeployMockTokens is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Mock WETH (18 decimals)
        MockWETH mockWETH = new MockWETH();
        console.log("MockWETH deployed at:", address(mockWETH));

        // Deploy Mock USDC (6 decimals)
        MockUSDC mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed at:", address(mockUSDC));

        // Deploy Mock DAI (18 decimals)
        MockDAI mockDAI = new MockDAI();
        console.log("MockDAI deployed at:", address(mockDAI));

        // Deploy Token Faucet
        TokenFaucet faucet = new TokenFaucet(
            address(mockWETH),
            address(mockUSDC),
            address(mockDAI)
        );
        console.log("TokenFaucet deployed at:", address(faucet));

        // No initial supply needed - users can mint unlimited tokens directly
        console.log("Deployed mock tokens with unlimited minting capability");

        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Base Sepolia");
        console.log("MockWETH:", address(mockWETH));
        console.log("MockUSDC:", address(mockUSDC));
        console.log("MockDAI:", address(mockDAI));
        console.log("TokenFaucet:", address(faucet));
        console.log("========================");

        // Save addresses to .env file (manually)
        console.log("\n=== ADD TO YOUR .env FILE ===");
        console.log("NEXT_PUBLIC_MOCK_WETH=", address(mockWETH));
        console.log("NEXT_PUBLIC_MOCK_USDC=", address(mockUSDC));
        console.log("NEXT_PUBLIC_MOCK_DAI=", address(mockDAI));
        console.log("NEXT_PUBLIC_FAUCET=", address(faucet));
        console.log("============================");
    }

    /**
     * @dev Verify deployment
     */
    function verifyDeployment(
        address weth,
        address usdc,
        address dai,
        address faucet
    ) external view {
        require(weth != address(0), "Invalid WETH address");
        require(usdc != address(0), "Invalid USDC address");
        require(dai != address(0), "Invalid DAI address");
        require(faucet != address(0), "Invalid Faucet address");

        console.log("All contracts deployed successfully!");
    }
}