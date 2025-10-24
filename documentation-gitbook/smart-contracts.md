# Smart Contract Overview

> **"Security-first design with built-in economic safety mechanisms."**

## 🏗️ Contract Architecture

Pippu's smart contract system consists of three main components designed for maximum security and transparency.

**LendingFactory**: Central contract for creating and managing isolated pools with consistent parameter validation and security.

**LiquidityPool**: Individual lending pool contracts with multi-layered security mechanisms and real-time monitoring.

**Interface Contracts**: Standardized contracts for frontend integration ensuring consistent API behavior.

## 🔗 Contract Addresses

### Testnet Contracts (Base Sepolia)

**Lending Factory**:
- **Address**: `0x977C91fEed2d4FF77AEeeD1bFb2a6f51b2A518F5`
- **Network**: Base Sepolia Testnet
- **Function**: Creates and manages isolated lending pools
- **Status**: Currently in testing phase

### Supported Tokens

**Base Sepolia Testnet Tokens:**
- **WETH**: `0x77c4a1cD22005b67Eb9CcEaE7E9577188d7Bca82`
- **USDC**: `0x08dfA087a14906B37e2F358E3Dc5180538e7c303`
- **USDBC**: `0xfDe8EFD598DC3Dc24FBD830f37fD646141dD662B`

## 🏭 LendingFactory Contract

### Purpose & Features

**Core Function**: Creates isolated lending pools with standardized parameters and comprehensive security validation.

**Security**: Implements access control, comprehensive input validation, and emergency controls for maximum protection.

**Registry**: Maintains records of all active pools for easy discovery and ecosystem monitoring.

### Key Functions

**Pool Creation**: Creates new isolated lending pools with borrower-specific parameters and collateral requirements.

**Pool Management**: Provides administrative functions for pool oversight and emergency interventions.

**Registry Services**: Maintains comprehensive records of all active pools for ecosystem transparency.

### Pool Creation Mechanism

Each pool undergoes strict validation including zero address checks, positive amount requirements, interest rate limits, and required field validation.

Comprehensive event logging ensures complete transparency for every pool creation and modification.

## 💧 LiquidityPool Contract

### Security Design

**Immutable Parameters**: Critical values like maximum LTV and collateral assets set once at deployment to prevent manipulation.

**State Management**: Dynamic state tracking with real-time monitoring for solvency and utilization rates.

**Access Control**: Role-based permissions with borrower-only modifier and owner controls for critical operations.

### Pool Operations

**Liquidity Provision**: Share-based system for proportional ownership with withdrawals that maintain solvency.

**Collateral Management**: Time-locked collateral with automatic release upon successful loan repayment.

**Loan Operations**: Disbursement and repayment with accurate interest calculation and default detection.

## 🔒 Security Mechanisms

### Smart Contract Protections

**Reentrancy Protection**: All state-changing functions protected with reentrancy guards.

**Access Control**: OpenZeppelin Ownable implementation with role-based access patterns.

**Input Validation**: Comprehensive parameter checking with descriptive error messages.

### Economic Security

**Conservative Parameters**: Maximum 70% LTV, fixed interest rates, and time-locked collateral.

**Real-time Monitoring**: Continuous health checks with liquidation protection mechanisms.

**Oracle Integration**: Reliable price feeds with stale price detection and circuit breakers.

## 📊 Gas Optimization

### Storage Efficiency

**Packed Structs**: Storage optimization with packed structs to reduce storage slots usage.

**Loop Optimization**: Pre-sized arrays and efficient iteration patterns for gas savings.

**Batch Operations**: Multiple actions in single transactions to reduce overhead.

### Implementation Patterns

Efficient calculation patterns, minimal external calls, and optimized event structures for optimal performance.

## 🚀 Deployment Strategy

### Deployment Process

**Testnet Phase**: Comprehensive testing on Base Sepolia with community beta testing.

**Security Audit**: Coordination with reputable audit firms and bug bounty program setup.

**Mainnet Launch**: Timelocked deployment for transparency and liquidity bootstrapping.

### Upgrade Patterns

**Proxy Pattern**: OpenZeppelin upgradeable contracts with transparent proxy implementation.

**Emergency Controls**: Circuit breaker mechanisms with time-locked admin actions.

## 🔍 Contract Verification

All contracts are verified on blockchain explorers:

- **Base Sepolia**: [Sepolia Basescan](https://sepolia.basescan.org/address/0x977C91fEed2d4FF77AEeeD1bFb2a6f51b2A518F5)

Contract verification ensures transparency and allows community audit of the codebase.

**Note**: Pippu is currently in testnet phase on Base Sepolia. Mainnet deployment is planned for Q1 2026 according to our roadmap.

---

## 📖 Next

[Frontend Architecture](frontend.md) → How Pippu's React frontend integrates with smart contracts and Farcaster.