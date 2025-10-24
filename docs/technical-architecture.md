# Technical Architecture

> **"Layered system designed for security, scalability, and transparency."**

## 🏗️ System Architecture

Pippu follows a layered architecture that prioritizes security, transparency, and user experience. Each layer is designed to be modular, upgradeable, and independently auditable.

**Smart Contract Layer**: Isolated pool system with factory pattern for standardized, secure pool creation.

**Application Layer**: API gateway, data indexing, and event processing for real-time user experience.

**Frontend Layer**: React 19 + Next.js 15 with Farcaster MiniApp SDK for mobile-first experience.

**Blockchain Layer**: Base network with Farcaster protocol for native distribution.

## 🔧 Smart Contract Architecture

### Factory Pattern

**LendingFactory** serves as the central hub for creating and managing isolated pools with consistent parameter validation and security.

**Key Features:**
- Comprehensive input validation
- Centralized pool registry for discovery
- Multi-layered access control and security
- Event logging for complete transparency

### Isolated Pool Design

**LiquidityPool** implements isolated lending pools with operational transparency and multi-layered security mechanisms.

**Security Features:**
- 70% maximum LTV for protection
- Stable fixed interest rates
- Real-time collateralization monitoring
- Automated liquidation protection

## 📱 Frontend Architecture

### Technology Stack

**Core Technologies**: React 19 with Next.js 15 for optimal performance, TypeScript for type safety, and Tailwind CSS for modern design.

**Web3 Integration**: Wagmi v2 and Viem v2 for efficient Ethereum interaction, Coinbase OnchainKit for seamless wallet connections.

**UI/UX**: shadcn/ui built on Radix UI for accessible modern components, Farcaster MiniApp SDK for native social integration.

### Component Architecture

**Component Structure**: Organized hierarchy from layout components to transaction components with clear dependencies.

**State Management**: Data flow from smart contracts through Wagmi hooks to React components with optimal caching.

**Design System**: Consistent design system with playful yet professional approach, mobile-first, and accessibility compliant.

## 🌐 Farcaster Integration

### MiniApp Implementation

**SDK Initialization**: Seamless integration with Farcaster MiniApp SDK for native social experiences.

**Social Features**: Identity verification, social sharing, profile integration, and community context forming a trust layer.

**Distribution Mechanics**: Pool sharing as casts, social proof indicators, and community funding opportunities.

## 📊 Data Architecture

### Event Indexing

**Real-time Updates**: WebSocket connections for live data streaming, event listeners for automatic UI updates.

**Historical Analysis**: Subgraph integration for efficient querying and performance metrics tracking.

### API Architecture

**RESTful Design**: Endpoints for pool management, user operations, and analytics optimized for mobile usage.

**Data Validation**: Input sanitization, CSRF protection, and secure storage for user data security.

## 🔒 Security Architecture

### Smart Contract Security

**Protection Patterns**: Reentrancy guards, access control, input validation, and emergency controls.

**Economic Security**: Conservative parameters, real-time monitoring, and liquidation protection.

### Frontend Security

**Client Protections**: Input sanitization, transaction simulation, and secure storage patterns.

**Web3 Security**: Wallet connection security, transaction validation, and phishing protection.

## 🚀 Performance Optimization

### Smart Contract Optimization

**Gas Efficiency**: Storage optimization, batch operations, and efficient event structures.

**Pattern Examples**: Packed structs to reduce storage usage and optimized loops for gas efficiency.

### Frontend Performance

**Rendering Optimization**: Component memoization, hook optimization, and code splitting.

**Data Optimization**: Intelligent caching, server components, and streaming responses.

---

## 📖 Next

[Smart Contract Overview](smart-contracts.md) → Overview of Pippu's smart contract implementation and security features.