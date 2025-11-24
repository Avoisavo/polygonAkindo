import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { parseEther, formatUnits } from 'viem';
import { AMM_EXCHANGE_CONTRACT, BASE_SEPOLIA_EXCHANGE, AGENT_WALLET } from '@/lib/networkConfig';

const EXCHANGE_ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_ethSold", "type": "uint256" }],
        "name": "getTokenAmount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_minTokens", "type": "uint256" },
            { "internalType": "address", "name": "_recipient", "type": "address" }
        ],
        "name": "ethToTokenTransfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_minTokens", "type": "uint256" }
        ],
        "name": "ethToTokenSwap",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getReserve",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export function useAMMSwap() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const [isLoading, setIsLoading] = useState(false);
    const [quote, setQuote] = useState<string | null>(null);

    const getSwapQuote = useCallback(async (ethAmount: string, network: 'amoy' | 'base-sepolia' = 'amoy') => {
        if (!publicClient || !ethAmount || parseFloat(ethAmount) <= 0) {
            setQuote(null);
            return null;
        }

        const exchangeAddress = network === 'base-sepolia' ? BASE_SEPOLIA_EXCHANGE : AMM_EXCHANGE_CONTRACT;

        try {
            const ethAmountWei = parseEther(ethAmount);

            // Get current reserves
            const ethReserve = await publicClient.getBalance({
                address: exchangeAddress,
            });

            const tokenReserve = await publicClient.readContract({
                address: exchangeAddress,
                abi: EXCHANGE_ABI,
                functionName: 'getReserve',
            }) as bigint;

            // Calculate swap amount manually (matching contract logic)
            // This matches the ethToToken function which uses (balance - msg.value)
            const fee = BigInt(99); // 1% fee
            const inputAmountWithFee = ethAmountWei * fee;
            const numerator = inputAmountWithFee * tokenReserve;
            const denominator = (ethReserve * BigInt(100)) + inputAmountWithFee;
            const tokenAmount = numerator / denominator;

            // USDC has 6 decimals
            const formattedAmount = formatUnits(tokenAmount, 6);
            setQuote(formattedAmount);
            return formattedAmount;
        } catch (error) {
            console.error('Error getting swap quote:', error);
            setQuote(null);
            return null;
        }
    }, [publicClient]);

    // Swap and transfer to agent (for Amoy)
    const swapAndTransfer = useCallback(async (ethAmount: string, minTokens?: string) => {
        if (!address || !walletClient || !ethAmount) {
            throw new Error('Wallet not connected or invalid amount');
        }

        setIsLoading(true);
        try {
            const ethAmountWei = parseEther(ethAmount);

            // Calculate minimum tokens with 8% slippage if not provided
            let minTokensWei: bigint;
            if (minTokens) {
                // minTokens is in USDC (6 decimals)
                minTokensWei = BigInt(Math.floor(parseFloat(minTokens) * 1e6));
            } else {
                // Get quote and apply 8% slippage
                const quoteAmount = await getSwapQuote(ethAmount, 'amoy');
                if (!quoteAmount) {
                    throw new Error('Failed to get swap quote');
                }
                const minAmount = parseFloat(quoteAmount) * 0.92; // 8% slippage
                minTokensWei = BigInt(Math.floor(minAmount * 1e6));
            }

            // Execute swap and transfer directly to agent wallet
            const hash = await walletClient.writeContract({
                address: AMM_EXCHANGE_CONTRACT,
                abi: EXCHANGE_ABI,
                functionName: 'ethToTokenTransfer',
                args: [minTokensWei, AGENT_WALLET],
                value: ethAmountWei,
            });

            console.log('Swap transaction sent:', hash);
            return hash;
        } catch (error) {
            console.error('Error swapping and transferring:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [address, walletClient, getSwapQuote]);

    // Swap to self (for Base Sepolia before bridging)
    const swapEthToToken = useCallback(async (ethAmount: string, minTokens?: string) => {
        if (!address || !walletClient || !ethAmount) {
            throw new Error('Wallet not connected or invalid amount');
        }

        setIsLoading(true);
        try {
            const ethAmountWei = parseEther(ethAmount);

            // Calculate minimum tokens with 8% slippage if not provided
            let minTokensWei: bigint;
            if (minTokens) {
                minTokensWei = BigInt(Math.floor(parseFloat(minTokens) * 1e6));
            } else {
                const quoteAmount = await getSwapQuote(ethAmount, 'base-sepolia');
                if (!quoteAmount) {
                    throw new Error('Failed to get swap quote');
                }
                const minAmount = parseFloat(quoteAmount) * 0.92; // 8% slippage
                minTokensWei = BigInt(Math.floor(minAmount * 1e6));
            }

            // Execute swap to self
            const hash = await walletClient.writeContract({
                address: BASE_SEPOLIA_EXCHANGE,
                abi: EXCHANGE_ABI,
                functionName: 'ethToTokenSwap',
                args: [minTokensWei],
                value: ethAmountWei,
            });

            console.log('Swap to self transaction sent:', hash);
            return hash;
        } catch (error) {
            console.error('Error swapping to self:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [address, walletClient, getSwapQuote]);

    return {
        getSwapQuote,
        swapAndTransfer,
        swapEthToToken,
        quote,
        isLoading
    };
}
