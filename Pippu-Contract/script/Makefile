# Makefile for Base Sepolia Deployment

.PHONY: help setup build deploy verify clean

help:
	@echo "Base Sepolia Deployment Commands:"
	@echo "  setup  - Install dependencies"
	@echo "  build  - Build contracts"
	@echo "  deploy - Deploy to Base Sepolia with verification"
	@echo "  verify - Verify contracts manually"
	@echo "  clean  - Clean build artifacts"

setup:
	@echo "Installing dependencies..."
	forge install OpenZeppelin/openzeppelin-contracts --no-commit
	forge install foundry-rs/forge-std --no-commit

build:
	@echo "Building contracts..."
	forge build

deploy:
	@echo "Deploying to Base Sepolia..."
	forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify

verify:
	@echo "Manual verification (if needed)..."
	@echo "forge verify-contract <address> <contract-name> --chain-id 84532"

clean:
	forge clean