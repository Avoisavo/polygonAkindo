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
    { id: 'swap-introduction', label: 'Introduction', group: 'x402 wallet swap' },
    { id: 'swap-quick-start', label: 'Quick Start', group: 'x402 wallet swap' },
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
                                    id="swap-quick-start"
                                    label="Quick Start"
                                    active={activeSectionId === 'swap-quick-start'}
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
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Welcome to the x402 SDK documentation. This guide will help you integrate your application with the x402 protocol on Polygon.
                                    The protocol allows website owners to monetize their content by registering their sites and setting a price for scraping access.
                                </p>
                            </section>
                        )}

                        {activeSectionId === 'how-it-works' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">How it works</h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                                    The x402 protocol operates as a decentralized marketplace for content access. Here is the high-level flow:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li><strong>Registration:</strong> Content providers register their websites on the blockchain, setting a price per access.</li>
                                    <li><strong>Payment:</strong> Data consumers (like AI agents or scrapers) pay the specified fee in tokens to access the content.</li>
                                    <li><strong>Access:</strong> Upon successful payment, the smart contract records the access right on-chain.</li>
                                    <li><strong>Withdrawal:</strong> Providers can withdraw their earnings from the contract at any time.</li>
                                </ul>
                            </section>
                        )}

                        {activeSectionId === 'installation' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">SDK Installation</h2>
                                <p className="text-gray-600 mb-4">
                                    To interact with the x402 smart contracts, you can use standard libraries like `ethers` or `viem`.
                                    We also provide a helper ABI file for easier integration.
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm">
                                    <SyntaxHighlighter language="bash" style={vscDarkPlus}>
                                        {`npm install ethers # or viem`}
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

                        {activeSectionId === 'swap-introduction' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">x402 Wallet Swap Introduction</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    The x402 Wallet Swap feature allows users to seamlessly swap tokens directly within the application.
                                    It leverages the underlying AMM contracts to provide liquidity and efficient token exchange.
                                </p>
                            </section>
                        )}

                        {activeSectionId === 'swap-quick-start' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start: Swapping Tokens</h2>
                                <p className="text-gray-600 mb-4">
                                    Here is a quick example of how to initiate a token swap using the SDK.
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`import { swapTokens } from 'x402-sdk';

const performSwap = async (amountIn: string, tokenIn: string, tokenOut: string) => {
  const tx = await swapTokens({
    amountIn: ethers.parseEther(amountIn),
    tokenInAddress: tokenIn,
    tokenOutAddress: tokenOut,
    slippage: 0.5 // 0.5%
  });
  await tx.wait();
  console.log("Swap complete!");
};`}
                                    </SyntaxHighlighter>
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
