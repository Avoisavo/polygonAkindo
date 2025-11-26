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
                                <p className="text-gray-600 mb-4">
                                    Website owners must register their site to start earning. You need to provide a unique `siteId` (bytes32) and a `price` (in wei).
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`import { ethers } from 'ethers';
import { x402polyABI } from './lib/x402polyABI';

const registerSite = async (siteId: string, price: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, x402polyABI, signer);

  // Convert string ID to bytes32
  const bytes32Id = ethers.id(siteId); 
  
  const tx = await contract.registerSite(bytes32Id, ethers.parseEther(price));
  await tx.wait();
  console.log("Site registered!");
};`}
                                    </SyntaxHighlighter>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'withdraw' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Withdraw Earnings</h2>
                                <p className="text-gray-600 mb-4">
                                    Site owners can withdraw their accumulated earnings from the contract.
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const withdraw = async () => {
  const tx = await contract.withdraw();
  await tx.wait();
  console.log("Earnings withdrawn!");
};`}
                                    </SyntaxHighlighter>
                                </div>
                            </section>
                        )}

                        {activeSectionId === 'buy-access' && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Buy Access</h2>
                                <p className="text-gray-600 mb-4">
                                    Users can purchase access to a registered site by paying the specified price in the payment token (e.g., USDC).
                                    Note: You must approve the payment token first.
                                </p>
                                <div className="rounded-lg overflow-hidden shadow-sm">
                                    <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                                        {`const buyAccess = async (siteId: string) => {
  // 1. Approve Payment Token
  const paymentToken = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);
  const approveTx = await paymentToken.approve(CONTRACT_ADDRESS, price);
  await approveTx.wait();

  // 2. Buy Access
  const bytes32Id = ethers.id(siteId);
  const tx = await contract.buyAccess(bytes32Id);
  await tx.wait();
  console.log("Access purchased!");
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
