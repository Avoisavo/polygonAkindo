## Polygate — x402 Micropayments for AI Crawlers 

Polygate is a blockchain-backed payment layer that lets humans browse for free while requiring AI crawlers to make tiny, automated payments per access using the x402 protocol. It restores control and creates transparent revenue for site owners when AI systems learn from their work.

## What it does
Polygate (x402) adds a native payment layer to the web specifically for the AI era. While humans browse freely, AI crawlers and agents must pay tiny per-request fees enforced by the x402 protocol. It includes: 
- **Smart Proxy**: Detects AI crawlers by User-Agent and returns `HTTP 402 Payment Required` with x402 payment terms.
- **Flash Payments**: An escrow-backed system that allows instant (0-latency) data delivery for agents. It verifies funds off-chain and settles on-chain in the background, eliminating blockchain wait times.
- **Developer SDK**: A TypeScript library (`@polypolygate/x402-sdk`) that allows developers to easily integrate x402 payments into their AI agents or scrapers. It handles 402 detection, wallet management, and transaction execution.
- **Cross-Chain Swaps**: Integrated AMM and LayerZero bridging allow agents to pay using assets from any chain (e.g., Base Sepolia).
- **AI Agent**: An autonomous agent that auto-pays via `x402-fetch` when a 402 is encountered, then scrapes the page.
- **Chatbot UI**: Shows normal results for free sites or requests on-chain payment to unlock content for protected sites.
- **Smart Contract**: A Polygon Amoy contract where site owners register URLs and prices, users buy access in USDC, and owners withdraw earnings.

## The problem it solves
- **Restores control** for website owners over AI model training and scraping.
- **Creates transparent, auditable, per-access revenue** for creators.
- **Preserves user experience** by keeping human browsing free while monetizing non-human access.

## Challenges I ran into
- **Orchestrating the Flow**: Managing the 402 → pay → retry flow between proxy, agent, and frontend.
- **Blockchain Latency**: Real-time HTTP requests cannot wait 5-10 seconds for block confirmations. We overcame this by designing the **Escrow Flash** mechanism, which optimistically delivers content based on escrow collateral while the transaction confirms in the background.
- **Cross-Chain Complexity**: Making it easy for an agent on Base Sepolia to pay a service on Polygon Amoy. We solved this by integrating LayerZero bridging directly into the SDK.
- **Bot vs. Human**: Designing a reliable gate that distinguishes AI traffic without impacting legitimate human users (User-Agent heuristics vs more advanced signals).

## Technologies I used
- **Backend**: Node.js, Express, x402-express, x402-fetch, Cheerio.
- **AI**: OpenAI SDK (function calling) to trigger scraping.
- **Frontend**: Next.js/React, Wagmi + Viem, custom Polygon Amoy chain config.
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin (ERC20 interface), Polygon Amoy testnet (USDC).
- **Infra/other**: Polygon Amoy (USDC), LayerZero (Cross-chain), Uniswap V2 (AMM).

## How we built it
- **Smart Contracts**:
  - `x402poly`: Handles site registration (URL hashing) and access purchasing.
  - `Escrow`: Manages user collateral to enable zero-latency "Flash" payments.
  - `AMM & Bridge`: Custom exchange contracts for swapping native tokens to USDC and bridging via LayerZero.
- **Proxy Server**: Middleware that intercepts requests, checks for payments, and serves 402 errors to unpaid bots. It implements the "Flash" logic by verifying escrow balances off-chain.
- **Agent Service**: A specialized scraper using `x402-fetch` that holds a wallet, manages gas, and autonomously pays for access.
- **Frontend**: A dashboard for site owners to register URLs and for users to manage their escrow balance and bridge funds.

## What we learned
- **HTTP 402 + x402** is a clean, web-native way to price bot access without harming human UX.
- **HTTP 402 is Powerful**: It provides a standardized, web-native way to negotiate value exchange between AI and servers.
- **Optimism is Key**: To make blockchain viable for web requests, "Optimistic" patterns (verify collateral, deliver now, settle later) are essential.

## What's next for PolyGate:
- **Smart Wallet Integration**: Integrate x402flash directly into wallets.
- **Anti-Spoofing**: Using Zero-Knowledge Proofs (like TLSNotary) to prevent AI agents from spoofing human User-Agents.
- **Analytics**: Providing site owners with detailed reports on AI traffic sources and earnings.

## Contract Addresses

**Polygon Amoy (Chain ID: 80002)**
- **x402 Protocol**: `0xe5E43468bcBd09391bF73d0D43a624537c46bBa9`
- **USDC Token**: `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`
- **AMM Registry**: `0xAc1531A6b130aa3027130F97e33c80698e5cfafc`
- **AMM Exchange (MATIC/USDC)**: `0x55EF26B90F38a6DcB9ea98B1257D4666df60933C`
- **Escrow Contract**: `0x1EB9544fE102CE9545e5B1bB96741148D75cB01a`

**Base Sepolia (Chain ID: 84532)**
- **AMM Registry**: `0x03e69a73090A7E8392bC54BC24316a326020B128`
- **AMM Exchange (ETH/USDC)**: `0x94EAb0B573CC7aa3B6C18318511C73FD583F89a2`
- **USDC Token**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

**Other**
- **Agent Wallet**: `0x7dec10140f6a10dbdc0b9b4d8ba4d468b1b8e6e6`

## Prerequisites
- Node.js 18+
- Funded Polygon Amoy wallet (POL for gas). Get test POL from Amoy faucet.
- Optional: Polygonscan API key (for contract verification)

## Quick start
Install dependencies in each workspace:

```bash
cd backend && npm i
cd ../frontend && npm i
cd ../demo-websites && npm i
cd ../smartcontract && npm i
```

### Environment variables
Create `.env` files as needed.

backend/.env:
```bash
OPENAI_API_KEY=sk-...
AGENT_PRIVATE_KEY=0xYOUR_AGENT_PRIVATE_KEY
AGENT_WALLET_ADDRESS=0xAgentAddress # optional helper endpoint
PAYMENT_ADDRESS=0xa6f7df49e2d4b48bc1eea0886fb8798fb51046d7 # or your recipient
FACILITATOR_URL=https://x402-amoy.polygon.technology
PROXY_PORT=4022
DEMO_SITE_URL=http://localhost:3002
PROXY_SECRET=dev-secret-key-change-in-production
PORT=5001
```

frontend/.env.local:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
```

smartcontract/.env:
```bash
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY
POLYGONSCAN_API_KEY=YOUR_KEY
PAYMENT_TOKEN_ADDRESS=0x41E94EB019c0762f9cBFCFeE217e8e5252C3fE89 # USDC on Amoy
```

### Run services (3 terminals)
1) Demo sites (content origin):
```bash
cd demo-websites
npm start
```

2) Backend API and x402 proxy:
```bash
cd backend
npm start  # starts agent server and proxy together
```

3) Frontend:
```bash
cd frontend
npm run dev
```

Open:
- Proxy home: http://localhost:4022
- Frontend: http://localhost:3000

### Test the proxy
Human (free): open http://localhost:4022/blog in a browser.

AI crawler (paid):
```bash
curl -i -H "User-Agent: GPTBot/1.0" http://localhost:4022/blog
```
You should see HTTP 402 with x402 headers (price, network, recipient, facilitator). The agent or a paying client can comply to access.

## Smart contract (Polygon Amoy)
Contract: `smartcontract/contracts/x402poly.sol`

Compile and deploy:
```bash
cd smartcontract
npx hardhat compile
npx hardhat run deploy/deploy-x402poly.js --network amoy
```

Verify (replace <ADDR>):
```bash
npx hardhat verify --network amoy <ADDR> "0x41E94EB019c0762f9cBFCFeE217e8e5252C3fE89"
```

Update frontend to your deployed address:
- Edit `frontend/lib/networkConfig.ts` `X402POLY_CONTRACT`

## Chatbot payment flow
1) User asks the chatbot to summarize/scrape a URL.
2) Backend agent calls `scrapeWebsite` with `x402-fetch` (AI User-Agent).
3) If 402, it auto-pays using the agent wallet, retries, and returns content plus tx hash (Amoy Polygonscan link).
4) If the agent didn’t pay (e.g., demo flow), the frontend shows a payment request card; on user approval, it notifies the backend to retry and display content.

## Key packages
- `x402-express` (proxy-side enforcement)
- `x402-fetch` (client/agent auto-payment and header handling)
- `wagmi`, `viem`, `@rainbow-me/rainbowkit` (wallet UX)
- `hardhat`, `ethers` (contracts)

## Troubleshooting
- HH303 (Unrecognized task 'deploy'): use Hardhat run, not hardhat-deploy:
  ```bash
  npx hardhat run deploy/deploy-x402poly.js --network amoy
  ```
- 402 persists on retry: ensure `AGENT_PRIVATE_KEY` is funded on Amoy and `FACILITATOR_URL` is set.
- Proxy 403 to demo sites: confirm `PROXY_SECRET` matches in both proxy and `demo-websites`.

## Security notes
- Demo bot detection is User-Agent based; production should add behavioral/IP reputation, rate limits, and TLS/device signals.
- Store secrets in a secure secret manager; rotate keys regularly.


