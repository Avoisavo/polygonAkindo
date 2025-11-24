'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLayerZeroBridge } from '@/hooks/useLayerZeroBridge';
import { usePolygonTransfer } from '@/hooks/usePolygonTransfer';
import { useAMMSwap } from '@/hooks/useAMMSwap';
import { useAccount } from 'wagmi';

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
    const [selectedNetwork, setSelectedNetwork] = useState('polygon-amoy');
    const [selectedCoin, setSelectedCoin] = useState('USDC');
    const [amount, setAmount] = useState('');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Use approveAndBridge from the hook
    const { approveAndBridge, isLoading: isBridgeLoading } = useLayerZeroBridge();
    const { transferUSDC, isLoading: isTransferLoading } = usePolygonTransfer();
    const { getSwapQuote, swapAndTransfer, quote, isLoading: isSwapLoading } = useAMMSwap();
    const { isConnected } = useAccount();

    const resetState = () => {
        setAmount('');
        setTxHash(null);
        setShowSuccess(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const networks = [
        { value: 'polygon-amoy', label: 'Polygon Amoy' },
        { value: 'base-sepolia', label: 'Base Sepolia' },
    ];

    // Dynamic coins based on selected network
    const coinsByNetwork: Record<string, Array<{ value: string; label: string }>> = {
        'polygon-amoy': [
            { value: 'AMOY', label: 'AMOY' },
            { value: 'USDC', label: 'USDC' },
        ],
        'base-sepolia': [
            { value: 'ETH', label: 'ETH' },
            { value: 'USDC', label: 'USDC' },
        ],
    };

    const coins = coinsByNetwork[selectedNetwork] || [];

    // Handle network change
    const handleNetworkChange = (network: string) => {
        setSelectedNetwork(network);
        // Reset coin to first available option when network changes
        const newCoins = coinsByNetwork[network] || [];
        if (newCoins.length > 0) {
            setSelectedCoin(newCoins[0].value);
        }
        setAmount('');
    };

    // Get swap quote when amount changes and AMOY is selected
    useEffect(() => {
        if (selectedNetwork === 'polygon-amoy' && selectedCoin === 'AMOY' && amount) {
            getSwapQuote(amount);
        }
    }, [amount, selectedNetwork, selectedCoin, getSwapQuote]);

    const handleTopUp = async () => {
        if (selectedNetwork === 'base-sepolia' && selectedCoin === 'USDC') {
            try {
                // Use the unified flow
                const hash = await approveAndBridge(amount);
                if (hash) {
                    setTxHash(hash);
                    setShowSuccess(true);
                }
            } catch (error) {
                console.error('Bridge failed:', error);
            }
        } else if (selectedNetwork === 'polygon-amoy' && selectedCoin === 'USDC') {
            try {
                // Direct USDC transfer on Polygon Amoy
                const hash = await transferUSDC(amount);
                if (hash) {
                    setTxHash(hash);
                    setShowSuccess(true);
                }
            } catch (error) {
                console.error('Transfer failed:', error);
            }
        } else if (selectedNetwork === 'polygon-amoy' && selectedCoin === 'AMOY') {
            try {
                // Swap AMOY to USDC via AMM and send to agent wallet
                const hash = await swapAndTransfer(amount);
                if (hash) {
                    setTxHash(hash);
                    setShowSuccess(true);
                }
            } catch (error) {
                console.error('Swap failed:', error);
            }
        } else {
            // TODO: Implement other top-up logic
            console.log('Top Up:', { selectedNetwork, selectedCoin, amount });
            onClose();
        }
    };

    const isBaseUsdc = selectedNetwork === 'base-sepolia' && selectedCoin === 'USDC';
    const isPolygonUsdc = selectedNetwork === 'polygon-amoy' && selectedCoin === 'USDC';
    const isPolygonAmoy = selectedNetwork === 'polygon-amoy' && selectedCoin === 'AMOY';
    const isLoading = isBridgeLoading || isTransferLoading || isSwapLoading;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                    <X className="h-5 w-5" />
                </button>

                {showSuccess ? (
                    <div className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                            Top Up Submitted!
                        </h2>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                            {isBaseUsdc ? 'Your cross-chain transaction is on its way.' : 'Your transaction has been submitted.'}
                        </p>

                        <div className="space-y-4 text-left">
                            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction Details</h3>

                                {isBaseUsdc ? (
                                    <>
                                        {/* Base Sepolia Hash */}
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Base Sepolia (Source)</p>
                                            <a
                                                href={`https://sepolia.basescan.org/tx/${txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="break-all text-xs text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {txHash}
                                            </a>
                                        </div>

                                        {/* LayerZero Scan */}
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">LayerZero Status</p>
                                            <a
                                                href={`https://testnet.layerzeroscan.com/tx/${txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                View on LayerZero Scan
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>

                                        {/* Polygon Amoy Note */}
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Polygon Amoy (Destination)</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                                                The destination transaction hash will appear on LayerZero Scan once the message is delivered.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Polygon Amoy Hash */}
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Polygon Amoy</p>
                                            <a
                                                href={`https://amoy.polygonscan.com/tx/${txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="break-all text-xs text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {txHash}
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Top Up Wallet
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Add funds to your agent wallet
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Network Selection */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Network
                                </label>
                                <select
                                    value={selectedNetwork}
                                    onChange={(e) => handleNetworkChange(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white/20"
                                >
                                    {networks.map((network) => (
                                        <option key={network.value} value={network.value}>
                                            {network.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Coin Selection */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Coin
                                </label>
                                <select
                                    value={selectedCoin}
                                    onChange={(e) => setSelectedCoin(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white/20"
                                >
                                    {coins.map((coin) => (
                                        <option key={coin.value} value={coin.value}>
                                            {coin.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white dark:focus:ring-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-gray-500 dark:text-gray-400">
                                        {selectedCoin}
                                    </div>
                                </div>
                            </div>

                            {/* Swap Preview for AMOY */}
                            {isPolygonAmoy && quote && amount && parseFloat(amount) > 0 && (
                                <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">You will receive:</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">~{quote} USDC</span>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Swapped via AMM • 1% fee included
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleTopUp}
                                disabled={isLoading || !amount || parseFloat(amount) <= 0}
                                className="flex-1 rounded-lg bg-gradient-to-r from-gray-800 to-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:from-gray-700 hover:to-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:from-white dark:to-gray-200 dark:text-black dark:hover:from-gray-200 dark:hover:to-gray-300"
                            >
                                {isLoading ? 'Processing...' : (isBaseUsdc ? 'Bridge to Agent' : isPolygonAmoy ? 'Swap & Send to Agent' : 'Top Up')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
