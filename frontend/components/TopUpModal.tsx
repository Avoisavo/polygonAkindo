'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
    const [selectedNetwork, setSelectedNetwork] = useState('polygon-amoy');
    const [selectedCoin, setSelectedCoin] = useState('USDC');
    const [amount, setAmount] = useState('');

    if (!isOpen) return null;

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
            { value: 'PYUSD', label: 'PYUSD' },
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
    };

    const handleTopUp = () => {
        // TODO: Implement top-up logic
        console.log('Top Up:', { selectedNetwork, selectedCoin, amount });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                    <X className="h-5 w-5" />
                </button>

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
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTopUp}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className="flex-1 rounded-lg bg-gradient-to-r from-gray-800 to-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:from-gray-700 hover:to-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:from-white dark:to-gray-200 dark:text-black dark:hover:from-gray-200 dark:hover:to-gray-300"
                    >
                        Top Up
                    </button>
                </div>
            </div>
        </div>
    );
}
