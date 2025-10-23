// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MockWETH.sol";
import "./MockUSDC.sol";
import "./MockDAI.sol";

/**
 * @title TokenFaucet
 * Faucet contract for distributing mock tokens to users
 * Users can claim tokens once per cooldown period
 */
contract TokenFaucet is Ownable {
    struct TokenInfo {
        address tokenAddress;
        string symbol;
        uint256 claimAmount;
        uint256 decimals;
    }

    // Token configurations
    TokenInfo[] public tokens;

    // Mapping to track last claim time for each user and token
    mapping(address => mapping(address => uint256)) public lastClaimTime;

    // Cooldown period in seconds (default: 1 hour)
    uint256 public claimCooldown = 3600;

    // Event for token claims
    event TokensClaimed(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    constructor(
        address mockWETH,
        address mockUSDC,
        address mockDAI
    ) Ownable(msg.sender) {
        // Initialize token configurations
        tokens.push(TokenInfo({
            tokenAddress: mockWETH,
            symbol: "mWETH",
            claimAmount: 100 * 10**18, // 100 mWETH
            decimals: 18
        }));

        tokens.push(TokenInfo({
            tokenAddress: mockUSDC,
            symbol: "mUSDC",
            claimAmount: 10000 * 10**6, // 10,000 mUSDC
            decimals: 6
        }));

        tokens.push(TokenInfo({
            tokenAddress: mockDAI,
            symbol: "mDAI",
            claimAmount: 10000 * 10**18, // 10,000 mDAI
            decimals: 18
        }));
    }

    /**
     * @dev Claim tokens from the faucet
     * @param tokenIndex Index of the token in the tokens array
     */
    function claimTokens(uint256 tokenIndex) external {
        require(tokenIndex < tokens.length, "Invalid token index");

        TokenInfo memory token = tokens[tokenIndex];
        address user = msg.sender;
        uint256 currentTime = block.timestamp;

        // Check cooldown
        require(
            currentTime - lastClaimTime[user][token.tokenAddress] >= claimCooldown,
            string(abi.encodePacked("Claim cooldown not met. Next claim in ",
            (claimCooldown - (currentTime - lastClaimTime[user][token.tokenAddress])), " seconds"))
        );

        // Update last claim time
        lastClaimTime[user][token.tokenAddress] = currentTime;

        // Mint tokens directly to user
        _mintTokens(token.tokenAddress, user, token.claimAmount);

        // Emit event
        emit TokensClaimed(user, token.tokenAddress, token.claimAmount, currentTime);
    }

    /**
     * @dev Claim all tokens at once
     */
    function claimAllTokens() external {
        address user = msg.sender;
        uint256 currentTime = block.timestamp;

        for (uint256 i = 0; i < tokens.length; i++) {
            TokenInfo memory token = tokens[i];

            // Check cooldown for each token
            if (currentTime - lastClaimTime[user][token.tokenAddress] >= claimCooldown) {
                lastClaimTime[user][token.tokenAddress] = currentTime;
                _mintTokens(token.tokenAddress, user, token.claimAmount);
                emit TokensClaimed(user, token.tokenAddress, token.claimAmount, currentTime);
            }
        }
    }

    /**
     * @dev Get available tokens count
     */
    function getTokensCount() external view returns (uint256) {
        return tokens.length;
    }

    /**
     * @dev Get token info by index
     */
    function getTokenInfo(uint256 index) external view returns (TokenInfo memory) {
        require(index < tokens.length, "Invalid token index");
        return tokens[index];
    }

    /**
     * @dev Check if user can claim token
     */
    function canClaim(address user, uint256 tokenIndex) external view returns (bool) {
        require(tokenIndex < tokens.length, "Invalid token index");
        TokenInfo memory token = tokens[tokenIndex];
        return (block.timestamp - lastClaimTime[user][token.tokenAddress] >= claimCooldown);
    }

    /**
     * @dev Get remaining cooldown time
     */
    function getRemainingCooldown(address user, uint256 tokenIndex) external view returns (uint256) {
        require(tokenIndex < tokens.length, "Invalid token index");
        TokenInfo memory token = tokens[tokenIndex];
        uint256 lastClaim = lastClaimTime[user][token.tokenAddress];
        uint256 cooldownEnd = lastClaim + claimCooldown;

        if (block.timestamp >= cooldownEnd) {
            return 0;
        }
        return cooldownEnd - block.timestamp;
    }

    /**
     * @dev Set claim cooldown (only owner)
     */
    function setClaimCooldown(uint256 newCooldown) external onlyOwner {
        require(newCooldown > 0, "Cooldown must be greater than 0");
        claimCooldown = newCooldown;
    }

    /**
     * @dev Add new token (only owner)
     */
    function addToken(
        address tokenAddress,
        string memory symbol,
        uint256 claimAmount,
        uint256 decimals
    ) external onlyOwner {
        tokens.push(TokenInfo({
            tokenAddress: tokenAddress,
            symbol: symbol,
            claimAmount: claimAmount,
            decimals: decimals
        }));
    }

    /**
     * @dev Update token claim amount (only owner)
     */
    function updateClaimAmount(uint256 tokenIndex, uint256 newAmount) external onlyOwner {
        require(tokenIndex < tokens.length, "Invalid token index");
        tokens[tokenIndex].claimAmount = newAmount;
    }

    /**
     * @dev Withdraw tokens from faucet (only owner)
     */
    function withdrawTokens(address tokenAddress, uint256 amount) external onlyOwner {
        _transferTokens(tokenAddress, msg.sender, amount);
    }

    /**
     * @dev Internal function to mint tokens directly
     */
    function _mintTokens(address tokenAddress, address to, uint256 amount) internal {
        // Use interface to call mint function directly
        (bool success,) = tokenAddress.call(
            abi.encodeWithSignature("mint(address,uint256)", to, amount)
        );
        require(success, "Token mint failed");
    }
}