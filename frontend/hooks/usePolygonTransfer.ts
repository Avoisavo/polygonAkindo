import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseUnits } from 'viem';

const POLYGON_AMOY_USDC = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582';
const AGENT_WALLET = '0x7dec10140f6a10dbdc0b9b4d8ba4d468b1b8e6e6';

const ERC20_TRANSFER_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

export function usePolygonTransfer() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);

    const transferUSDC = useCallback(async (amount: string, decimals: number = 6) => {
        if (!address || !walletClient) return;

        setIsLoading(true);
        try {
            const amountToTransfer = parseUnits(amount, decimals);

            const hash = await walletClient.writeContract({
                address: POLYGON_AMOY_USDC,
                abi: ERC20_TRANSFER_ABI,
                functionName: 'transfer',
                args: [AGENT_WALLET, amountToTransfer],
            });

            console.log('Transfer transaction sent:', hash);
            return hash;
        } catch (error) {
            console.error('Error transferring USDC:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [address, walletClient]);

    return {
        transferUSDC,
        isLoading
    };
}
