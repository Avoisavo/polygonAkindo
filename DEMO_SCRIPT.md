# POLYGATE – Demo Script (Narrative)

## Problem Statement

Today's AI companies scrape billions of web pages to train their models, often without permission, compensation, or transparency. Website owners lose control over how their content is used, creators see no revenue when models learn from their work, and privacy or licensing terms are frequently ignored. Traditional approaches don't help much: robots.txt can be bypassed, blocking all bots damages SEO and legitimate access, legal remedies are slow and costly, and there's no granular, automated way to monetize. We need a solution that restores control to website owners while keeping the human web free and open.

## Our Solution: POLYGATE (x402 Protocol)

POLYGATE is a blockchain-backed payment layer that distinguishes human visitors from AI crawlers, lets humans browse for free, and requires crawlers to make tiny, automated payments per access via the x402 protocol. Smart contracts on Polygon provide transparent, low-cost settlement and escrow, enabling websites to earn from AI training without hurting the user experience. By combining x402 with smart-contract escrow, POLYGATE delivers a first-of-its-kind path to sustainable, sub-cent monetization of crawler traffic—think payments as low as fractions of a cent—while preserving free access for people.

## How It Works (Architecture)

POLYGATE has three core components:

### 1. Frontend (Next.js + Web3)
- Simple flow for site registration
- Wallet connection via WalletConnect/MetaMask
- Dashboard to view earnings and manage pricing
- Chatbot that can scrape on the user's behalf

### 2. Backend (Node + Express)
- Acts as a reverse proxy that sits between crawlers and your website
- Detects AI crawlers using sophisticated User-Agent analysis
- Enforces x402 payment protocol for crawler access
- Includes an AI agent capable of paying automatically when paywalls are encountered
- Forwards legitimate traffic seamlessly to origin servers

### 3. Smart Contract (Solidity on Polygon)
- Manages on-chain site registration
- Stores pricing information per website
- Handles escrow and automated fund distribution
- Provides transparent, auditable payment records
- Ensures trustless settlement between crawlers and site owners

---

## Post-Registration: Integration Flow

After a website owner successfully registers their site on the blockchain, they need to integrate POLYGATE into their infrastructure. Here's what happens:

### Step 1: Registration Confirmation

Once the transaction is confirmed on Polygon:
- Website is registered with a unique `siteId` (hash of the domain)
- Pricing is stored on-chain (e.g., $0.01 per crawler access)
- Owner's wallet address is linked to the site
- Smart contract begins tracking payments for this site

### Step 2: Choose Your Integration Method

POLYGATE offers **three integration options** to accommodate different infrastructure needs:

---

#### **Option A: DNS-Based Proxy (Recommended for Most Sites)**

**How it works:**
1. Point your domain (or subdomain) DNS to POLYGATE's proxy servers
2. Traffic flows: `Visitor → POLYGATE Proxy → Your Origin Server`
3. POLYGATE inspects each request, detects crawlers, enforces payments
4. Legitimate traffic passes through transparently

**Setup Steps:**
```
1. In POLYGATE dashboard, generate your proxy configuration
2. Update DNS A/AAAA records:
   
   TYPE    NAME              VALUE
   A       @                 [POLYGATE_IP]
   A       www               [POLYGATE_IP]

3. Configure origin server in dashboard:
   - Origin URL: https://your-actual-server.com
   - Proxy authentication secret: [auto-generated]

4. Wait for DNS propagation (5-60 minutes)
5. Test: Visit your domain - humans get free access, crawlers see paywall
```

**Pros:**
- ✅ No code changes required
- ✅ Works with any tech stack (WordPress, React, static sites, etc.)
- ✅ Easy to revert (just change DNS back)
- ✅ POLYGATE handles SSL/TLS termination

**Cons:**
- ⚠️ DNS propagation delay on setup
- ⚠️ All traffic flows through POLYGATE (slight latency)

**Best for:** WordPress sites, blogs, documentation sites, static sites

---

#### **Option B: Subdomain/Path-Based Proxy (Selective Protection)**

**How it works:**
1. Create a subdomain (e.g., `api.yoursite.com` or `content.yoursite.com`)
2. Point only that subdomain to POLYGATE
3. Protect only high-value content (articles, APIs, datasets)

**Setup Steps:**
```
1. Decide what to protect (e.g., /api/*, /premium/*, /content/*)

2. Update DNS for subdomain:
   TYPE    NAME              VALUE
   A       api               [POLYGATE_IP]

3. Configure routing rules in POLYGATE dashboard:
   - Protected paths: /articles/*, /data/*
   - Origin: https://your-main-site.com
   - Pricing: $0.005 per API call

4. Update your main site to link to protected subdomain
```

**Pros:**
- ✅ Protects only valuable content
- ✅ Main site unaffected
- ✅ Lower traffic through proxy = lower latency

**Cons:**
- ⚠️ Requires some link updates on your site

**Best for:** SaaS platforms, API providers, premium content sites

---

#### **Option C: JavaScript Injection (Client-Side Detection)**

**How it works:**
1. Add POLYGATE's JavaScript SDK to your website
2. SDK detects crawler behavior client-side
3. Redirects crawlers to payment page
4. No DNS changes needed

**Setup Steps:**
```
1. Install POLYGATE SDK:
   npm install @polygate/detector

2. Add to your website:
   <script src="https://cdn.polygate.network/detector.js"></script>
   <script>
     Polygate.init({
       siteId: "your-site-id-from-registration",
       network: "polygon-amoy",
       priceUSDC: 0.01
     });
   </script>

3. SDK runs on page load, checks for crawler patterns
4. Crawlers are served a payment modal before content access
```

**Pros:**
- ✅ No DNS changes
- ✅ No infrastructure changes
- ✅ Works with CDNs (Cloudflare, Fastly, etc.)

**Cons:**
- ⚠️ JavaScript can be bypassed by sophisticated crawlers
- ⚠️ Only works for browser-based crawlers
- ⚠️ Not effective against headless crawlers

**Best for:** Sites on managed platforms (Medium, Substack clones), sites with CDNs

---

### Step 3: Configure Origin Server Authentication

To prevent crawlers from bypassing POLYGATE and accessing your origin server directly:

**A. IP Allowlisting**
```nginx
# Nginx example
location / {
    allow [POLYGATE_IP_RANGE];
    deny all;
}
```

**B. Secret Header Validation**
```javascript
// Express.js middleware
app.use((req, res, next) => {
  const proxySecret = req.get('X-Proxy-Auth');
  if (proxySecret !== process.env.POLYGATE_SECRET) {
    return res.status(403).send('Direct access forbidden');
  }
  next();
});
```

**C. Cloudflare/CDN Integration**
```
1. Keep your origin server hidden
2. Route traffic: User → Cloudflare → POLYGATE → Origin
3. Use Cloudflare Workers to validate POLYGATE headers
```

---

### Step 4: Monitor & Optimize

Once integrated, use the POLYGATE dashboard to:

- **View Real-Time Analytics:**
  - Human vs. crawler traffic breakdown
  - Revenue per crawler (GPTBot, Claude, etc.)
  - Most accessed pages/endpoints
  
- **Adjust Pricing:**
  - Set different prices per crawler type (GPTBot: $0.01, Common Crawl: $0.005)
  - Dynamic pricing based on time-of-day or content type
  - Bulk discounts for high-volume crawlers

- **Withdraw Earnings:**
  - View pending balance in smart contract escrow
  - One-click withdrawal to your wallet
  - Gas fees covered by accumulated earnings

---

## Traffic Flow Example

### **When a Human Visits:**
```
1. User visits: https://yourblog.com/article
2. DNS resolves to POLYGATE proxy: 51.20.30.40
3. POLYGATE detects: User-Agent = Chrome/120.0 (Human)
4. ✅ Proxy forwards request to origin: https://origin.yourblog.com
5. User receives content instantly (free)
```

### **When AI Crawler Visits:**
```
1. GPTBot visits: https://yourblog.com/article
2. DNS resolves to POLYGATE proxy: 51.20.30.40
3. POLYGATE detects: User-Agent = GPTBot/1.0 (AI Crawler)
4. ❌ Returns HTTP 402 Payment Required
   Headers:
     X-402-Price: 0.01 USDC
     X-402-Recipient: 0xa6f7df49...
     X-402-Facilitator: https://x402-amoy.polygon.technology
5. GPTBot's payment agent:
   - Reads payment headers
   - Signs USDC transfer transaction
   - Includes X-Payment proof in retry request
6. POLYGATE verifies payment with facilitator
7. ✅ Grants access, forwards to origin
8. Smart contract credits $0.01 to your escrow
```

---

## Security Features

1. **Crawler Detection:** 
   - Advanced fingerprinting (User-Agent, TLS fingerprint, behavioral analysis)
   - Updated database of 500+ known AI crawler signatures
   - Machine learning model to detect new/unknown crawlers

2. **Payment Verification:**
   - Cryptographic proof validation via Polygon facilitator
   - Double-spend prevention
   - Replay attack protection

3. **Origin Protection:**
   - Secret header authentication
   - IP allowlisting
   - Rate limiting per wallet address

4. **Smart Contract Security:**
   - OpenZeppelin audited contracts
   - Escrow-based payments (no direct transfers)
   - Emergency pause functionality

---

## Pricing Recommendations

Based on content type:

| Content Type          | Suggested Price | Reasoning                          |
|-----------------------|----------------|-------------------------------------|
| Blog articles         | $0.001-0.005   | High volume, low individual value   |
| News articles         | $0.005-0.01    | Timely, frequently updated          |
| Documentation         | $0.01-0.05     | High-quality, well-structured       |
| API endpoints         | $0.05-0.10     | Structured data, direct training use|
| Premium research      | $0.10-1.00     | Paywalled, exclusive content        |
| Datasets (per MB)     | $0.50-5.00     | Direct training data                |

**Dynamic Pricing Example:**
```javascript
// Charge more for GPT-4, less for research crawlers
{
  "GPTBot": "$0.01",
  "Claude-Web": "$0.01",
  "Common Crawl": "$0.002",  // Non-profit discount
  "PerplexityBot": "$0.008"
}
```

---

## FAQ

**Q: Will this break my SEO?**  
A: No! Google's regular crawlers (Googlebot, Bingbot) get free access. Only AI training crawlers (GPTBot, Claude-Web, etc.) are charged. Your search rankings remain unchanged.

**Q: What if a crawler refuses to pay?**  
A: They don't get access. It's that simple. They receive HTTP 402 and can retry with payment or skip your site.

**Q: Can crawlers bypass this by spoofing User-Agents?**  
A: POLYGATE uses multi-layered detection (TLS fingerprints, behavioral analysis, IP reputation). Spoofing is detected.

**Q: How much will I actually earn?**  
A: Depends on traffic volume. Example: A blog with 1M monthly pageviews and 5% crawler traffic at $0.005/access = **$250/month passive income**.

**Q: What if I want to allow specific crawlers for free?**  
A: Use the allowlist feature in your dashboard. Example: Allow Common Crawl (non-profit) but charge OpenAI.

**Q: Do I need to know blockchain/crypto?**  
A: No. Connect your wallet once during registration. Withdrawals are one-click. We handle all blockchain complexity.

---

## Live Demo Walkthrough

### Part 1: Registration (2 minutes)
1. Visit [https://polygate.network/register](https://polygate.network/register)
2. Connect wallet (MetaMask)
3. Enter website: `https://example-blog.com`
4. Set price: `$0.01 per access`
5. Confirm transaction → Site registered on Polygon

### Part 2: DNS Setup (1 minute)
1. Copy POLYGATE proxy IP from dashboard
2. Update DNS records (show Cloudflare/GoDaddy interface)
3. Configure origin server URL

### Part 3: Testing (3 minutes)
**Test 1 - Human Access:**
```bash
# Visit in browser
curl https://example-blog.com/article
# Returns: HTML content (free)
```

**Test 2 - AI Crawler (No Payment):**
```bash
curl -H "User-Agent: GPTBot/1.0" https://example-blog.com/article
# Returns: HTTP 402 Payment Required
# Headers show price and payment address
```

**Test 3 - AI Crawler (With Payment):**
```bash
# POLYGATE's AI agent automatically pays
./test_agent.js --url https://example-blog.com/article
# Output: Payment sent → Access granted → Content scraped
```

### Part 4: Dashboard (2 minutes)
1. View real-time analytics:
   - 1,247 human visits (free)
   - 63 crawler visits (paid)
   - Revenue: $0.63 pending
2. Adjust pricing: Lower price for specific bots
3. Withdraw funds: One-click → USDC to wallet

---

## Technical Specifications

**Backend:**
- Node.js 20+, Express
- x402-express middleware
- Polygon Amoy testnet (production: Mainnet)
- USDC payment token

**Frontend:**
- Next.js 14, TypeScript
- wagmi + viem for Web3 interactions
- TailwindCSS

**Smart Contract:**
- Solidity ^0.8.28
- OpenZeppelin ERC20 interface
- Deployed on Polygon (low gas fees: ~$0.0001 per transaction)

**Proxy Server:**
- Express-based reverse proxy
- Advanced crawler detection
- Sub-10ms payment verification
- Horizontal scaling via load balancer

---

## Roadmap

**Q1 2026:**
- [ ] Launch on Polygon Mainnet
- [ ] WordPress plugin (one-click integration)
- [ ] Support for DAI, USDT, ETH payments
- [ ] Public API for custom integrations

**Q2 2026:**
- [ ] AI crawler marketplace (crawlers can discover paywall prices before visiting)
- [ ] Bulk payment plans (monthly subscriptions for crawlers)
- [ ] Analytics API for website owners
- [ ] Browser extension to track your earnings across sites

**Q3 2026:**
- [ ] Multi-chain support (Ethereum, Base, Arbitrum)
- [ ] Dynamic pricing AI (ML-optimized rates)
- [ ] Content fingerprinting (detect scraped content in AI models)
- [ ] Revenue-sharing pools (creators split earnings)

---

## Conclusion

POLYGATE empowers website owners to finally monetize AI crawler traffic without sacrificing user experience, SEO, or accessibility. With transparent blockchain settlement, automated x402 payments, and flexible integration options, we're building the future of fair content compensation on the web.

**The web should remain free for humans, but AI companies should pay for the content that powers their models.**

Join us in building a more equitable internet.

---

## Links

- **Website:** https://polygate.network
- **Dashboard:** https://app.polygate.network
- **Docs:** https://docs.polygate.network
- **GitHub:** https://github.com/polygonAkindo
- **Smart Contract:** [View on Polygonscan](https://amoy.polygonscan.com/)
- **x402 Protocol:** https://www.x402.org/

---

**Questions?** Reach out at support@polygate.network or join our Discord.

