"use client"

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Header } from '@/components/Header';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SECTIONS = [
    { id: 'introduction', label: 'Overview', group: 'Introduction' },
    { id: 'how-it-works', label: 'How it works', group: 'Introduction' },
    { id: 'installation', label: 'Installation', group: 'SDK' },
    { id: 'register-site', label: 'Register Site', group: 'Seller' },
    { id: 'withdraw', label: 'Withdraw', group: 'Seller' },
    { id: 'buy-access', label: 'Buy Access', group: 'Buyer' },
    { id: 'x402-flash-start', label: 'Get Started', group: 'x402-flash' },
    { id: 'swap-introduction', label: 'Introduction', group: 'x402 wallet swap' },
    { id: 'swap-amm', label: 'AMM Swaps', group: 'x402 wallet swap' },
    { id: 'swap-layerzero', label: 'LayerZero Bridge', group: 'x402 wallet swap' },
    { id: 'swap-contracts', label: 'Contract Addresses', group: 'x402 wallet swap' },
];

export default function InstructionPage() {
    const [activeSectionId, setActiveSectionId] = useState('introduction');

    const activeIndex = SECTIONS.findIndex(s => s.id === activeSectionId);
    const activeSection = SECTIONS[activeIndex];

    const handleNext = () => {
        if (activeIndex < SECTIONS.length - 1) {
            setActiveSectionId(SECTIONS[activeIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveSectionId(SECTIONS[activeIndex - 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-64px)] top-16 overflow-y-auto hidden md:block">
                    <div className="p-6 space-y-8">

                        {/* Introduction Group */}
                        <div>
                            <h3 className="text-xl font-black text-black mb-3 uppercase tracking-wide">Introduction</h3>
                            <nav className="space-y-1">
                                <SidebarLink
                                    id="introduction"
                                    label="Overview"
                                    active={activeSectionId === 'introduction'}
                                    onClick={setActiveSectionId}
                                />
                                <SidebarLink
                                    id="how-it-works"
                                    label="How it works"
                                    active={activeSectionId === 'how-it-works'}
                                    onClick={setActiveSectionId}
                                />
                            </nav>
                        </div>

                        {/* SDK Group */}
                        <div>
                            <h3 className="text-xl font-black text-black mb-3 uppercase tracking-wide">SDK</h3>
                            <nav className="space-y-1">
                                <SidebarLink
                                    id="installation"
                                    label="Installation"
                                    active={activeSectionId === 'installation'}
                                    onClick={setActiveSectionId}
                                />
                            </nav>
                        </div>

                        {/* Seller Group */}
                        <div>
                            <h3 className="text-xl font-black text-black mb-3 uppercase tracking-wide">Seller</h3>
                            <nav className="space-y-1">
                                <SidebarLink
                                    id="register-site"
                                    label="Register Site"
                                    active={activeSectionId === 'register-site'}
                                    onClick={setActiveSectionId}
                                />
                                <SidebarLink
                                    id="withdraw"
                                    label="Withdraw"
                                    active={activeSectionId === 'withdraw'}
                                    onClick={setActiveSectionId}
                                />
                            </nav>
                        </div>

                        {/* Buyer Group */}
                        <div>
                            <h3 className="text-xl font-black text-black mb-3 uppercase tracking-wide">Buyer</h3>
                            <nav className="space-y-1">
                                <SidebarLink
                                    id="buy-access"
                                    label="Buy Access"
                                    active={activeSectionId === 'buy-access'}
                                    onClick={setActiveSectionId}
                                />
                            </nav>
                        </div>

                        {/* x402-flash Group */}
                        <div>
                            <h3 className="text-xl font-black text-black mb-3 uppercase tracking-wide">x402-flash</h3>
                            <nav className="space-y-1">
                                <SidebarLink
                                    id="x402-flash-start"
                                    label="Get Started"
                                    active={activeSectionId === 'x402-flash-start'}
                                    onClick={setActiveSectionId}
                                />
                            </nav>
                        </div>

                        {/* x402 Wallet Swap Group */}
                        <div>
                            <h3 className="text-xl font-black text-black mb-3 uppercase tracking-wide">x402 wallet swap</h3>
                            <nav className="space-y-1">
                                <SidebarLink
                                    id="swap-introduction"
                                    label="Introduction"
                                    active={activeSectionId === 'swap-introduction'}
                                    onClick={setActiveSectionId}
                                />
                                <SidebarLink
                                    id="swap-amm"
                                    label="AMM Swaps"
                                    active={activeSectionId === 'swap-amm'}
                                    onClick={setActiveSectionId}
                                />
                                <SidebarLink
                                    id="swap-layerzero"
                                    label="LayerZero Bridge"
                                    active={activeSectionId === 'swap-layerzero'}
                                    onClick={setActiveSectionId}
                                />
                                <SidebarLink
                                    id="swap-contracts"
                                    label="Contract Addresses"
                                    active={activeSectionId === 'swap-contracts'}
                                    onClick={setActiveSectionId}
                                />
                            </nav>
                        </div>

                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-8 max-w-4xl mx-auto mt-6">
                    <div className="min-h-[60vh]">
                        {activeSectionId === 'introduction' && (
                            <section>
                                <h1 className="text-4xl font-bold text-gray-900 mb-6">Introduction</h1>
                                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                                    <p className="text-sm text-purple-700 font-medium">
                                        Built for <strong>Polygon Buildathon: From Launch to Fundraising</strong>
                                    </p>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                    Welcome to <strong>PolyGate</strong>, a cutting-edge protocol that redefines how web content is monetized. By leveraging the standard HTTP <code>402 Payment Required</code> status code, we create a seamless, decentralized marketplace connecting data providers with AI agents and users.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    Our platform addresses the critical challenges of real-time payments on the blockchain:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                                    <li><strong>Monetization:</strong> Website owners can easily register endpoints and set prices for content scraping or API access.</li>
                                    <li><strong>Performance:</strong> Our <strong>Flash Payment</strong> system (backed by escrow) eliminates blockchain latency, enabling instant data delivery.</li>
                                    <li><strong>Accessibility:</strong> Integrated <strong>Cross-Chain Swaps & Bridging</strong> (via LayerZero) ensure users can easily acquire the necessary USDC from any network.</li>
                                </ul>
                            </section>
                        )}

                        {activeSectionId === 'how-it-works' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">How it works</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                    The x402 ecosystem connects Content Providers (Sellers) with Data Consumers (Buyers/AI Agents) through a robust set of smart contracts and developer tools on Polygon. Here is the comprehensive workflow:
                                </p>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">1. Monetization via HTTP 402</h3>
                                        <p className="text-gray-600">
                                            Sellers register their websites on-chain using our protocol. When a buyer requests a protected resource, the server responds with a <code>402 Payment Required</code> status, including the price and payment details in the headers.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">2. Seamless Integration</h3>
                                        <p className="text-gray-600">
                                            Using our <code>@polypolygate/x402-sdk</code>, buyers (especially AI agents) automatically handle these 402 responses. The SDK parses the requirement and executes the payment transaction instantly to gain access.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">3. Zero-Latency 'Flash' Payments</h3>
                                        <p className="text-gray-600">
                                            To overcome blockchain block times (which can take seconds), we introduced the <strong>x402 Flash</strong> flow. Users fund an escrow account once. When making requests, the service provider verifies the escrow balance and delivers content <strong>instantly (0-latency)</strong>, while the actual settlement happens in the background.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">4. Cross-Chain Accessibility</h3>
                                        <p className="text-gray-600">
                                            We lower the barrier to entry with <strong>x402 Wallet Swap</strong>. Users can swap native tokens (AMOY/ETH) for USDC or bridge funds from other chains (like Base Sepolia via LayerZero) directly within the application, ensuring they always have the necessary currency to pay for data.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'installation' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">SDK Installation</h2>
                                <p className="text-gray-600 mb-4">
                                    To interact with the x402 smart contracts, simply install our official SDK.
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm">
                                    <SyntaxHighlighter language="bash" style={vscDarkPlus}>
                                        {`npm i @polypolygate/x402-sdk`}
                                    </SyntaxHighlighter>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'register-site' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Register a Site</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    To monetize your content, you must register your website on the Polygon blockchain. This creates an on-chain record that links your domain (Site ID) to your wallet and defines the cost per access.
                                </p>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                    <p className="text-sm text-blue-700">
                                        <strong>Prerequisite:</strong> Ensure your wallet is connected to the <strong>Polygon Amoy</strong> network and has sufficient <strong>POL</strong> for gas fees.
                                    </p>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Site ID</h3>
                                <p className="text-gray-600 mb-4">
                                    The <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">siteId</code> is typically the <strong>hash of your domain name</strong> (e.g., <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">ethers.id('example.com')</code>). This ensures a unique identifier for your site on the blockchain.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Contract Logic</h3>
                                <p className="text-gray-600 mb-4">
                                    Under the hood, your registration interacts with the <code>x402poly.sol</code> smart contract. Here is the Solidity function that handles the registration:
                                </p>

                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="solidity" style={vscDarkPlus}>
                                        {`function registerSite(
    bytes32 siteId,
    uint256 price,
    string memory url
) external {
    require(!sites[siteId].exists, "Site already exists");
    require(price > 0, "Price must be > 0");

    sites[siteId] = Site({
        price: price,
        owner: msg.sender,
        url: url,
        exists: true
    });

    allSiteIds.push(siteId);

    emit SiteRegistered(siteId, price, msg.sender, url);
}`}
                                    </SyntaxHighlighter>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    This function verifies that the site isn't already registered, stores the price and owner address, and emits a <code>SiteRegistered</code> event that the backend listens for.
                                </p>

                                <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-6">Viewing All Sites</h4>
                                <p className="text-gray-600 mb-4">
                                    You can also retrieve all registered sites using the <code>getAllSites</code> function:
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="solidity" style={vscDarkPlus}>
                                        {`function getAllSites() external view returns (Site[] memory) {
    Site[] memory allSites = new Site[](allSiteIds.length);
    for (uint i = 0; i < allSiteIds.length; i++) {
        allSites[i] = sites[allSiteIds[i]];
    }
    return allSites;
}`}
                                    </SyntaxHighlighter>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    This view function returns an array of all registered <code>Site</code> structs, useful for building directories or verifying your registration.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Frontend Integration</h3>
                                <p className="text-gray-600 mb-4">
                                    To call this function from your frontend, use the following code:
                                </p>

                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`import { ethers } from 'ethers';
import { x402polyABI } from './lib/x402polyABI';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x..."; 

const registerSite = async (domainName: string, priceInEth: string) => {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, x402polyABI, signer);

  // 1. Generate Site ID from Domain
  // e.g. "example.com" -> 0x...
  const siteId = ethers.id(domainName); 
  
  // 2. Parse Price
  const priceWei = ethers.parseEther(priceInEth);

  console.log(\`Registering \${domainName} (\${siteId}) for \${priceInEth} POL...\`);

  // 3. Send Transaction
  // Note: We pass the domain name as the 'url' parameter for metadata
  const tx = await contract.registerSite(siteId, priceWei, domainName);
  console.log("Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("Site registered successfully!");
};`}
                                    </SyntaxHighlighter>
                                </div>

                                <p className="text-gray-600 italic">
                                    Once registered, your site is live on the blockchain. Next, you'll need to configure your <strong>Proxy</strong> or <strong>SDK</strong> to enforce payments.
                                </p>
                            </section>
                        )}

                        {activeSectionId === 'withdraw' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Withdraw Earnings</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    Earnings from your content are held in the smart contract's escrow. You can withdraw your accumulated balance to your registered wallet at any time.
                                </p>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                    <p className="text-sm text-blue-700">
                                        <strong>Tip:</strong> Ensure your accumulated earnings are greater than the gas fee required to execute the withdrawal transaction.
                                    </p>
                                </div>

                                {/* <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Contract Logic</h3>
                                <p className="text-gray-600 mb-4">
                                    The withdrawal process is handled by the <code>withdraw</code> function in the smart contract. It checks your pending balance and transfers the funds to your wallet.
                                </p>

                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="solidity" style={vscDarkPlus}>
                                        {`function withdraw() external {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "No funds to withdraw");

    pendingWithdrawals[msg.sender] = 0;

    bool ok = paymentToken.transfer(msg.sender, amount);
    require(ok, "Transfer failed");

    emit Withdraw(msg.sender, amount);
}`}
                                    </SyntaxHighlighter>
                                </div> */}

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Frontend Integration</h3>
                                <p className="text-gray-600 mb-4">
                                    To call this function from your frontend, use the following code:
                                </p>

                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`import { ethers } from 'ethers';
import { x402polyABI } from './lib/x402polyABI';

const withdrawEarnings = async () => {
  if (!window.ethereum) return;
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, x402polyABI, signer);

  // Optional: Check balance first
  // const balance = await contract.payments(await signer.getAddress());
  // console.log("Pending balance:", ethers.formatUnits(balance, 6), "USDC");

  console.log("Initiating withdrawal...");
  
  // Withdraw all funds to your wallet
  const tx = await contract.withdraw();
  console.log("Tx sent:", tx.hash);
  
  await tx.wait();
  console.log("Withdrawal complete!");
};`}
                                    </SyntaxHighlighter>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'buy-access' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Buy Access</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    Users (or AI agents) can purchase access to a registered site by paying the specified price in <strong>USDC</strong>.
                                </p>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                    <h4 className="font-bold text-blue-700"> For AI Agents (Recommended)</h4>
                                    <p className="text-sm text-blue-800 mt-1">
                                        If you are building a bot, use our <strong>x402-fetch</strong> library. It automatically handles the <code className="bg-blue-100 px-1 rounded">402 Payment Required</code> response and executes the payment transaction for you.
                                    </p>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Contract Logic</h3>
                                <p className="text-gray-600 mb-4">
                                    The <code>buyAccess</code> function handles the payment logic. It transfers USDC from the buyer to the contract (escrow) and records the access right.
                                </p>

                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="solidity" style={vscDarkPlus}>
                                        {`function buyAccess(bytes32 siteId) external {
    require(sites[siteId].exists, "Site not found");

    Site memory s = sites[siteId];

    // transfer USDC → escrow (contract)
    bool ok = paymentToken.transferFrom(msg.sender, address(this), s.price);
    require(ok, "Payment failed");

    // record credit for site owner
    pendingWithdrawals[s.owner] += s.price;

    // grant access
    hasAccess[msg.sender][siteId] = true;

    emit AccessPurchased(msg.sender, siteId, s.price);
}`}
                                    </SyntaxHighlighter>
                                </div>

                                <p className="text-gray-600 mb-6">
                                    <strong>Note:</strong> Since this function uses <code>transferFrom</code>, you must approve the contract to spend your USDC <em>before</em> calling this function.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Manual Integration</h3>
                                <p className="text-gray-600 mb-4">
                                    If you are manually integrating the smart contract, you must follow the <strong>ERC20 Approval Pattern</strong>. You cannot send USDC directly to the contract; you must first <em>approve</em> the contract to spend your tokens.
                                </p>

                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`import { ethers } from 'ethers';
import { x402polyABI } from './lib/x402polyABI';

// USDC Address on Polygon Amoy
const PAYMENT_TOKEN = "0x41E94EB019c0762f9cBFCFeE217e8e5252C3fE89"; 
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)"
];

const buyAccess = async (siteId: string, price: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, x402polyABI, signer);
  const token = new ethers.Contract(PAYMENT_TOKEN, ERC20_ABI, signer);

  // 1. Approve Token Spend
  console.log("Approving tokens...");
  const approveTx = await token.approve(CONTRACT_ADDRESS, ethers.parseEther(price));
  await approveTx.wait();

  // 2. Buy Access
  console.log("Buying access...");
  const tx = await contract.buyAccess(ethers.id(siteId));
  await tx.wait();
  
  console.log("Access Granted!");
};`}
                                    </SyntaxHighlighter>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'x402-flash-start' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Started with x402 Flash</h2>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">The Problem: Blockchain Latency</h3>
                                <div className="mb-6">
                                    <img src="/x402problem.png" alt="Blockchain Latency Problem" className="rounded-lg shadow-md max-w-full h-auto" />
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    When performing standard blockchain confirmations, users experience significant latency waiting for blocks to be mined. This delay degrades the user experience for real-time applications.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">The Solution: Escrow-Backed Flash Payments</h3>
                                <div className="mb-6">
                                    <img src="/escrowdrawingg.png" alt="Escrow Solution Diagram" className="rounded-lg shadow-md max-w-full h-auto" />
                                </div>

                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    We propose a new solution using an <strong>Escrow</strong> mechanism. Users perform a one-time fund to top up their escrow balance.
                                </p>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                    <p className="text-sm text-blue-700">
                                        <strong>Why not deduct directly from Escrow?</strong>
                                        <br />
                                        We ensure users maintain control over their assets. Funds in the escrow act as <strong>collateral</strong> to guarantee the service provider gets paid. The actual payment is deducted from the agent's wallet during the transaction, keeping the escrow funds untouched unless a failure occurs. This allows users to freely swap or bridge their wallet assets as demonstrated previously.
                                    </p>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">How it Works</h3>
                                <ul className="list-decimal list-inside space-y-3 text-gray-600 mb-6">
                                    <li>
                                        <strong>Client Initiates Payment:</strong> The client sends a direct payment transaction and passes the payload to the server.
                                    </li>
                                    <li>
                                        <strong>Facilitator Verification:</strong> The facilitator immediately checks the User's <strong>Escrow Balance</strong>.
                                    </li>
                                    <li>
                                        <strong>Instant Delivery (Flash):</strong> If the escrow balance covers the cost, the Seller delivers the service <strong>instantly (0 latency)</strong>, without waiting for the transaction to confirm.
                                    </li>
                                    <li>
                                        <strong>Background Settlement:</strong>
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>If the direct payment <strong>succeeds</strong>, no action is taken (Escrow remains untouched).</li>
                                            <li>If the direct payment <strong>fails</strong>, the Seller triggers the <code>escrow()</code> function to deduct the cost from the User's Escrow balance as a fallback.</li>
                                        </ul>
                                    </li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Performance Comparison</h3>
                                <p className="text-gray-600 mb-4">
                                    By using the Escrow Flash flow, we significantly reduce the time to data delivery compared to the standard flow.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <h4 className="font-bold text-red-800 mb-2">Standard Flow (No Escrow)</h4>
                                        <p className="text-sm text-red-600">User pays → Waits for Block Confirmation (~8s) → Gets Data</p>
                                        <p className="text-2xl font-bold text-red-700 mt-2">~7,880 ms</p>
                                        <div className="mt-3">
                                            <img src="/cliLong1.png" alt="Standard Flow CLI Output" className="rounded border border-red-200 shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <h4 className="font-bold text-green-800 mb-2">Flash Flow (With Escrow)</h4>
                                        <p className="text-sm text-green-600">User pays → Escrow Check (Instant) → Gets Data</p>
                                        <p className="text-2xl font-bold text-green-700 mt-2">~2,650 ms</p>
                                        <div className="mt-3">
                                            <img src="/cliShort.png" alt="Flash Flow CLI Output" className="rounded border border-green-200 shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center font-bold text-gray-700">
                                    Outcome: The Escrow Flash flow is ~3x faster!
                                </p>
                            </section>
                        )}

                        {activeSectionId === 'swap-introduction' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">x402 Wallet Swap Introduction</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    The x402 Wallet Swap feature provides a comprehensive SDK for token swapping and cross-chain bridging.
                                    It includes two main components:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                                    <li><strong>AMM Swaps:</strong> Swap native tokens (AMOY/ETH) for USDC using automated market maker pools on Polygon Amoy and Base Sepolia.</li>
                                    <li><strong>LayerZero Bridge:</strong> Transfer USDC across chains from Base Sepolia to Polygon Amoy using LayerZero's OFT standard.</li>
                                </ul>
                                <p className="text-gray-600">
                                    These hooks are designed to work seamlessly with wagmi and viem, providing type-safe interactions with smart contracts.
                                </p>
                            </section>
                        )}

                        {activeSectionId === 'swap-amm' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">AMM Swaps</h2>
                                <p className="text-gray-600 mb-4">
                                    The <code className="bg-gray-100 px-2 py-1 rounded text-sm">useAMMSwap</code> hook provides functionality to swap native tokens for USDC using AMM exchange contracts.
                                    It supports both Polygon Amoy (AMOY → USDC) and Base Sepolia (ETH → USDC).
                                </p>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Installation</h3>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`import { useAMMSwap } from '@/hooks/useAMMSwap';`}
                                    </SyntaxHighlighter>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting a Swap Quote</h3>
                                <p className="text-gray-600 mb-4">
                                    Before executing a swap, you can get a quote to show users how much USDC they'll receive:
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const { getSwapQuote, quote } = useAMMSwap();

// Get quote for swapping 1 AMOY to USDC on Polygon Amoy
await getSwapQuote('1.0', 'amoy');
console.log('You will receive:', quote, 'USDC');

// Get quote for swapping 0.5 ETH to USDC on Base Sepolia
await getSwapQuote('0.5', 'base-sepolia');
console.log('You will receive:', quote, 'USDC');`}
                                    </SyntaxHighlighter>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Swap and Transfer (Polygon Amoy)</h3>
                                <p className="text-gray-600 mb-4">
                                    On Polygon Amoy, you can swap AMOY for USDC and send it directly to a recipient address in one transaction:
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const { swapAndTransfer, isLoading } = useAMMSwap();

// Swap 2 AMOY for USDC and send to agent wallet
try {
  const txHash = await swapAndTransfer('2.0');
  console.log('Swap successful! Transaction:', txHash);
} catch (error) {
  console.error('Swap failed:', error);
}`}
                                    </SyntaxHighlighter>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Swap to Self (Base Sepolia)</h3>
                                <p className="text-gray-600 mb-4">
                                    On Base Sepolia, swap ETH for USDC to your own wallet (useful before bridging):
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const { swapEthToToken } = useAMMSwap();

// Swap 0.1 ETH for USDC on Base Sepolia
try {
  const txHash = await swapEthToToken('0.1');
  console.log('Swap successful! Transaction:', txHash);
} catch (error) {
  console.error('Swap failed:', error);
}`}
                                    </SyntaxHighlighter>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                                    <p className="text-sm text-blue-700">
                                        <strong>Note:</strong> The swap functions automatically calculate slippage (8%) to protect against price movements.
                                        You can also provide a custom minimum token amount if needed.
                                    </p>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'swap-layerzero' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">LayerZero Bridge</h2>
                                <p className="text-gray-600 mb-4">
                                    The <code className="bg-gray-100 px-2 py-1 rounded text-sm">useLayerZeroBridge</code> hook enables cross-chain USDC transfers from Base Sepolia to Polygon Amoy
                                    using LayerZero's Omnichain Fungible Token (OFT) standard.
                                </p>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Installation</h3>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`import { useLayerZeroBridge } from '@/hooks/useLayerZeroBridge';`}
                                    </SyntaxHighlighter>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quote Bridge Fee</h3>
                                <p className="text-gray-600 mb-4">
                                    Before bridging, get a quote for the LayerZero messaging fee:
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const { quote } = useLayerZeroBridge();

// Get quote for bridging 10 USDC
const result = await quote('10', 6); // 6 decimals for USDC
console.log('Native fee:', result.fee.nativeFee);
console.log('LZ token fee:', result.fee.lzTokenFee);`}
                                    </SyntaxHighlighter>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Approve and Bridge</h3>
                                <p className="text-gray-600 mb-4">
                                    The easiest way to bridge is using the <code className="bg-gray-100 px-2 py-1 rounded text-sm">approveAndBridge</code> function,
                                    which handles both token approval and bridging in one flow:
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const { approveAndBridge, isLoading } = useLayerZeroBridge();

try {
  // This will:
  // 1. Check if approval is needed
  // 2. Approve USDC if necessary
  // 3. Bridge USDC to Polygon Amoy
  const txHash = await approveAndBridge('10', 6);
  console.log('Bridge transaction sent:', txHash);
} catch (error) {
  console.error('Bridge failed:', error);
}`}
                                    </SyntaxHighlighter>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Manual Approval and Bridge</h3>
                                <p className="text-gray-600 mb-4">
                                    For more control, you can handle approval and bridging separately:
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm mb-6">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const { checkAllowance, approve, send } = useLayerZeroBridge();

// 1. Check if approval is needed
const hasAllowance = await checkAllowance('10', 6);

if (!hasAllowance) {
  // 2. Approve USDC
  const approvalHash = await approve('10', 6);
  console.log('Approval sent:', approvalHash);
  // Wait for approval to be mined before bridging
}

// 3. Bridge USDC
const bridgeHash = await send('10', 6);
console.log('Bridge sent:', bridgeHash);`}
                                    </SyntaxHighlighter>
                                </div>

                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Important:</strong> LayerZero bridging requires paying a native fee (in ETH on Base Sepolia).
                                        Make sure your wallet has enough ETH to cover both the gas fees and the LayerZero messaging fee.
                                    </p>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'swap-contracts' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contract Addresses</h2>
                                <p className="text-gray-600 mb-6">
                                    Here are all the smart contract addresses used in the x402 swap SDK:
                                </p>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Polygon Amoy Testnet</h3>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AMM Registry</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0xAc1531A6b130aa3027130F97e33c80698e5cfafc</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AMM Exchange (AMOY/USDC)</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0x55EF26B90F38a6DcB9ea98B1257D4666df60933C</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">USDC Token</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">x402 Protocol</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0xe5E43468bcBd09391bF73d0D43a624537c46bBa9</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Agent Wallet</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0x7dec10140f6a10dbdc0b9b4d8ba4d468b1b8e6e6</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Base Sepolia Testnet</h3>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AMM Registry</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0x03e69a73090A7E8392bC54BC24316a326020B128</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AMM Exchange (ETH/USDC)</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0x94EAb0B573CC7aa3B6C18318511C73FD583F89a2</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">USDC Token</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0x036CbD53842c5426634e7929541eC2318f3dCF7e</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">LayerZero OFT Adapter</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">0xEd7D591BD2Cd36C25D505A68495420c0710fBb14</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">LayerZero Endpoint IDs</h3>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Base Sepolia</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">40245</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Polygon Amoy</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">40267</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                                    <p className="text-sm text-blue-700">
                                        <strong>Tip:</strong> All these addresses are exported from <code className="bg-blue-100 px-2 py-1 rounded">@/lib/networkConfig</code> and
                                        <code className="bg-blue-100 px-2 py-1 rounded ml-1">@/lib/layerzero/config</code> for easy import in your code.
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                        {activeIndex > 0 ? (
                            <button
                                onClick={handlePrev}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous: {SECTIONS[activeIndex - 1].label}
                            </button>
                        ) : (
                            <div></div> // Spacer
                        )}

                        {activeIndex < SECTIONS.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Next: {SECTIONS[activeIndex + 1].label}
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ id, label, active, onClick }: { id: string, label: string, active: boolean, onClick: (id: string) => void }) {
    return (
        <button
            onClick={() => {
                onClick(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            {label}
        </button>
    );
}
