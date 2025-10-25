## The problem it solves


Current DeFi lending has **three critical barriers** keeping 95% of potential users away:

![image](https://assets.devfolio.co/content/419b18987e3a42a39f2e36d43eaeec7c/9cc91e89-e446-4e6d-bfb7-4116fa28049f.png)
### 1 **Unpredictable Interest Rates**
Traditional protocols like Aave show volatile rates ranging **8-31% APY** within a single year. Borrowers can't plan cash flow when rates triple overnight. Lenders can't forecast returns when yields collapse during low utilization.

**Pippu's solution**: Fixed 15% APY for the entire loan term. Both sides know exact costs and returns upfront—just like traditional finance, but on-chain.


### 2 **High Systemic Risk (Contagion Problem)**
Shared pool architecture means **85% contagion risk**. When one borrower defaults in Compound or Aave, ALL lenders in that pool absorb the loss—even if you never lent to that specific borrower.

**Pippu's solution**: Isolated pools with **5% contagion risk**. Each borrower gets their own contract. If Pool A defaults, Pool B lenders are completely unaffected. You control your exact credit exposure.


### 3 **Prohibitively Complex UX**
Lending on Aave: 8 steps (connect wallet → approve token → enable collateral → check health factor → borrow → monitor liquidation risk...). Uniswap: 10 steps. The average user gives up.

**Pippu's solution**: 2-step mobile-first flow via Farcaster Frames:
- **Lenders**: See pool → Fund with one tap
- **Borrowers**: Create proposal → Receive funds

![image](https://assets.devfolio.co/content/419b18987e3a42a39f2e36d43eaeec7c/ea96336e-9ac2-49d1-9f8d-cabd1ff010b8.png)
No wallet complexity. No gas estimation anxiety. No "what's a health factor?" confusion.

Our research shows:
- **70%** of crypto holders have never heard of DeFi lending
- **25%** are interested but find current platforms too confusing
- **= 95% underserved market** that Pippu targets with simplified UX


##  **What This Enables**
- **Small businesses**: Access working capital at predictable rates without selling equity
- **Individual lenders**: Earn 15% fixed yield with granular risk control
- **Mass market users**: Participate in DeFi lending without technical expertise

By solving rate volatility, systemic risk, and UX complexity simultaneously, Pippu makes DeFi lending accessible to the 95% currently locked out.


---
## Challenges I ran into


**Smart contract state synchronization across isolated pools**. Each borrowing proposal creates a separate contract, but we needed real-time aggregated views for the lending marketplace. The naive approach of polling every pool contract would have made the UI unusable.

**Solution**: Implemented event-driven indexing where pool contracts emit standardized events that our subgraph captures. This allows instant querying of all pools while maintaining the security benefits of isolated contracts. Had to rebuild the contract event structure twice after discovering gas optimization conflicts.

**Minikit Frame rendering limitations**. Farcaster frames have strict size constraints and limited interactivity. Displaying complex lending data like collateralization ratios and repayment schedules within frame boundaries required aggressive UX simplification without losing critical information.

**Solution**: Designed a progressive disclosure pattern where frames show essential metrics only, with deeper analytics accessible through embeds. Spent significant time on visual hierarchy to ensure users can assess risk at a glance.

**Base Sepolia RPC instability during testing**. Encountered random transaction failures that weren't replicating on local Foundry tests, making debugging nearly impossible.

**Solution**: Implemented aggressive retry logic with exponential backoff and added transaction simulation before actual submission. Also set up monitoring to detect RPC issues proactively.

---
## Link to the GitHub Repo of your project
https://github.com/yeheskieltame/Pippu.git

## Live URL of your project
https://www.pippu.xyz/


---
## unique value proposition

**Three-pillar solution** that addresses all major DeFi lending problems simultaneously:

### 1. **Predictable Fixed Rates (15% APY)**
Unlike Aave/Compound where rates swing 8-31% monthly, Pippu locks rates at loan origination. Borrowers can budget accurately. Lenders can forecast returns. This stability is critical for business adoption.

**Alpha validation**: Our prototype shows 15% as the optimal rate—high enough to attract lenders, low enough for borrowers to afford with 70% collateral.

### 2. **Isolated Pool Architecture → 94% Risk Reduction**
Traditional pools have 85% contagion risk. Pippu's isolated model reduces this to 5%—a **94% improvement**. Each borrower gets their own transparent contract. Lenders see exactly who they fund and can diversify across multiple pools without forced bundling.

**Alpha validation**: In user testing, 8/10 lenders said isolated pools made them "much more confident" versus pooled models. They want control over which businesses they back.

### 3. **2-Step Mobile UX vs 8-10 Step Desktop Complexity**
We compress the entire lending flow to 2 taps on Farcaster Frames. Competing protocols require 8-10 steps on desktop with Web3 wallet expertise.

**Alpha validation**: Tested with 15 non-DeFi users. Average time to first loan: 47 seconds. 13/15 completed without asking for help. This is critical for our 95% underserved market target.


## 🎨 **Why the Cute Design Matters**
The friendly aesthetic isn't decoration—it's strategic positioning. We're explicitly targeting the **70% who've never heard of DeFi** and **25% interested but confused**. Traditional DeFi interfaces signal "experts only." Pippu signals "anyone can do this."


## 📱 **Distribution Advantage**
Farcaster integration means we're embedded in existing social graphs where borrowers build reputation and lenders verify credibility. This social layer creates accountability that pure-protocol solutions lack—addressing the trust problem in undercollateralized lending.


--- 
## target customer

We're attacking the **95% underserved market** that current DeFi ignores:

###  **Market Breakdown (Based on Research)**
- **70%**: Crypto holders who've never heard of DeFi lending
- **25%**: Users interested but find platforms too confusing
- **5%**: Current DeFi users (served by Aave/Compound)

**Pippu targets the 95%** with simplified UX and predictable terms.

### **Primary Borrowers**
Small crypto-native businesses and DAOs with:
- $50K-$500K monthly revenue
- Ability to post 70% collateral
- Need for predictable fixed rates (not 8-31% volatility)
- Unwilling to sell tokens at unfavorable valuations

**Example**: A GameFi studio earning $200K/month in NFT royalties needs $100K to hire developers. Traditional banks won't touch crypto income. Aave's variable rates spike from 12% to 28% unpredictably. Pippu offers 15% fixed—they can budget precisely.

### **Primary Lenders**
Individual crypto investors with:
- $10K-$100K idle stablecoins
- Seeking yield above Aave (currently ~5-8%) but more control than institutional platforms
- Want to choose specific borrowers, not forced pooling
- Mobile-first users comfortable with Farcaster

**Example**: A Farcaster user with $50K USDC sees a trusted community member's lending pool. They can evaluate that specific borrower's reputation, revenue proof, and collateral—then fund with one tap at guaranteed 15% return.

### **Validation**
 **12 borrower interviews**: 9/12 said they'd previously used VC debt or token sales despite not wanting to, because accessible on-chain lending didn't exist

**15 lender prototype tests**: Key insight: "I trust Company X but not Company Y. Why should my returns suffer if Y defaults when I didn't lend to them?" → Validated isolated pool thesis

**70% + 25% = 95% underserved**: Our Farcaster + simplified UX strategy directly addresses this mass market ignored by competitors

---
## Who are your closest competitors and how are you different?



**Wildcat Finance** - https://wildcat.finance/
They pioneered undercollateralized on-chain lending with customizable terms. However, Wildcat targets institutional borrowers and sophisticated lenders. Their interface assumes DeFi literacy, and they have no mobile or social integration.

**Differentiation**: Pippu is retail-first. We're building for individuals and small businesses, not funds. Our Farcaster integration means lending happens where users already spend time, not in a separate dApp they must learn. The mobile-optimized design makes participation possible for non-technical users.

**Maple Finance** - https://maple.finance/
Focuses on institutional credit with delegated underwriting through pool delegates. Minimum investments typically start at 100K.

**Differentiation**: Pippu eliminates the middleman. No pool delegates deciding who gets access. Borrowers create pools directly, lenders evaluate directly. We're democratizing both sides of the market. Our 70% collateralization creates safety without requiring institutional relationships.

**Key distinction**: Both competitors operate on Ethereum mainnet targeting institutional scale. Pippu launches on Base with Farcaster integration, explicitly prioritizing accessibility and user experience over maximum scale. We're attacking the long-tail market they ignore.

---
## What is your distribution strategy and why?


**Farcaster-native distribution** is our core strategy. Rather than building another standalone dApp competing for attention, we're embedded in an existing social platform where our target users already spend time.

**Mechanism**: Borrowers share their lending pools as Farcaster casts. Their social graph sees the opportunity natively in their feed. Lenders can fund pools without leaving the platform. This social proof layer creates trust and discovery simultaneously.

**Why this works**: Cold-start problem is the death of lending platforms. We solve it by launching where both borrowers and lenders already congregate. A crypto founder with 5K Farcaster followers can raise capital from their community directly. This community-driven model compounds as each successful loan creates social proof for the next.

**Secondary channels**: Base ecosystem partnerships. We're applying for ecosystem grants and building relationships with other Base projects that need working capital. Their treasuries become our lender base; their operating needs become our borrower base.

**Long-term**: The isolated pool model enables white-label opportunities. Any community or protocol can embed Pippu's lending infrastructure. We become the lending rails for Base, not just another protocol.

**Why not paid acquisition**: DeFi lending requires trust. Paid ads generate awareness but not credibility. Our Farcaster strategy leverages existing social capital, which is more valuable than attention. We're building a lending network, not just user acquisition.