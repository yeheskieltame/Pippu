# Technical Architecture

> **"Sistem berlapis yang dirancang untuk keamanan, skalabilitas, dan transparansi."**

## 🏗️ Arsitektur Sistem

Pippu mengikuti arsitektur berlapis yang memprioritaskan keamanan, transparansi, dan pengalaman pengguna. Setiap lapisan dirancang modular, dapat diupgrade, dan diaudit secara independen.

**Lapisan Smart Contract**: Sistem isolated pool dengan factory pattern untuk penciptaan pool yang standar dan aman.

**Lapisan Aplikasi**: API gateway, indexing data, dan pemrosesan event untuk pengalaman pengguna yang real-time.

**Lapisan Frontend**: React 19 + Next.js 15 dengan integrasi Farcaster MiniApp SDK untuk pengalaman mobile-first.

**Lapisan Blockchain**: Jaringan Base dengan protokol Farcaster untuk distribusi native.

## 🔧 Arsitektur Smart Contract

### Factory Pattern

**LendingFactory** berfungsi sebagai pusat penciptaan dan manajemen pool terisolasi. Setiap pool adalah kontrak terpisah dengan parameter keamanan yang konsisten.

**Fitur Utama:**
- Validasi input komprehensif
- Registry pool terpusat untuk discovery
- Access control dan keamanan berlapis
- Event logging untuk transparansi

### Isolated Pool Design

**LiquidityPool** mengimplementasikan pool pinjaman terisolasi dengan transparansi operasional dan mekanisme keamanan.

**Fitur Keamanan:**
- Maksimum LTV 70% untuk perlindungan
- Suku bunga fixed yang stabil
- Pemantauan collateralisasi real-time
- Perlindungan liquidasi otomatis

## 📱 Arsitektur Frontend

### Technology Stack

**Teknologi Inti**: React 19 dengan Next.js 15 untuk performa optimal, TypeScript untuk type safety, dan Tailwind CSS untuk desain modern.

**Web3 Integration**: Wagmi v2 dan Viem v2 untuk interaksi Ethereum yang efisien, Coinbase OnchainKit untuk koneksi wallet.

**UI/UX**: shadcn/ui untuk komponen modern yang accessible, Farcaster MiniApp SDK untuk integrasi sosial native.

### Komponen Arsitektur

**Struktur Komponen**: Terorganisir dengan hierarki yang jelas dari layout components hingga transaction components.

**State Management**: Aliran data dari smart contracts melalui Wagmi hooks ke React components dengan caching yang optimal.

**Design System**: Sistem desain yang konsisten dengan playful approach yang professional, mobile-first, dan accessibility compliant.

## 🌐 Integrasi Farcaster

### MiniApp Implementation

**Inisialisasi SDK**: Integrasi seamless dengan Farcaster MiniApp SDK untuk pengalaman sosial native.

**Social Features**: Identity verification, social sharing, profile integration, dan community context untuk membentuk trust layer.

**Distribution Mechanics**: Pool sharing sebagai casts, social proof indicators, dan community funding opportunities.

## 📊 Arsitektur Data

### Event Indexing

**Real-time Updates**: WebSocket connections untuk live data streaming, event listeners untuk UI updates otomatis.

**Historical Analysis**: Subgraph integration untuk efficient querying dan performance metrics tracking.

### API Architecture

**RESTful Design**: Endpoint untuk pool management, user operations, dan analytics yang dioptimasi untuk mobile.

**Data Validation**: Input sanitization, CSRF protection, dan secure storage untuk keamanan data pengguna.

## 🔒 Arsitektur Keamanan

### Smart Contract Security

**Protection Patterns**: Reentrancy guards, access control, input validation, dan emergency controls.

**Economic Security**: Parameter konservatif, real-time monitoring, dan liquidation protection.

### Frontend Security

**Client Protections**: Input sanitization, transaction simulation, dan secure storage patterns.

**Web3 Security**: Wallet connection security, transaction validation, dan phishing protection.

## 🚀 Optimasi Performa

### Smart Contract Optimization

**Gas Efficiency**: Storage optimization, batch operations, dan efficient event structures.

**Pattern Examples**: Packed structs untuk mengurangi storage usage dan optimized loops untuk gas efficiency.

### Frontend Performance

**Rendering Optimization**: Component memoization, hook optimization, dan code splitting.

**Data Optimization**: Intelligent caching, server components, dan streaming responses.

---

## 📖 Next

[Smart Contract Overview](smart-contracts.md) → Gambaran umum implementasi smart contract Pippu dan fitur keamanan.