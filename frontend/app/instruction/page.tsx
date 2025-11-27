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
