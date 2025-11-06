## Polygate — x402 Micropayments for AI Crawlers (Polygon Amoy)

Polygate is a blockchain-backed payment layer that lets humans browse for free while requiring AI crawlers to make tiny, automated payments per access using the x402 protocol. It restores control and creates transparent revenue for site owners when AI systems learn from their work.

## What it does
- Distinguishes humans vs AI crawlers at a proxy.
- Returns HTTP 402 with x402 terms for bots; allows humans through for free.
- AI agent auto-pays on 402 via `x402-fetch` and re-fetches content.
- Frontend chatbot surfaces normal answers for free sites or prompts on-chain payment for protected sites.
- Solidity contract on Polygon Amoy: site registration, per-access pricing in USDC, purchase access, and owner withdrawals.

## Architecture
- Backend (`backend/`)
  - AI Agent API (`/agent`, `/payment/complete`)
  - x402 Proxy (`proxy-server.js`) with bot detection (`utils/crawlerDetector.js`) and payment enforcement (`x402-express`)
  - Scraper with auto-pay (`functions/scrapeWebsite.js`, `x402-fetch`)
- Frontend (`frontend/`)
  - Next.js app with chatbot (`app/chatbot`) and site registration/dashboard (`app/contract`, `app/register`)
  - Wallet via Wagmi/Viem, custom Polygon Amoy chain config
- Smart contracts (`smartcontract/`)
  - `x402poly.sol` (USDC-based pricing, access purchase, pending withdrawals)
- Demo protected content (`demo-websites/`) served only via the proxy

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



