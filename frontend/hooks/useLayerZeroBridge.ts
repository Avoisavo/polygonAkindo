import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { Address, parseUnits, encodeAbiParameters, parseAbiParameters, pad } from 'viem';
import { LAYERZERO_CONFIG, OFT_ADAPTER_ABI, ERC20_ABI } from '@/lib/layerzero/config';

export function useLayerZeroBridge() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const [isLoading, setIsLoading] = useState(false);

    // Quote the fee for sending tokens
    const quote = useCallback(async (amount: string, decimals: number = 6) => {
        if (!address || !publicClient) return null;

        try {
            const amountLD = parseUnits(amount, decimals);
            const minAmountLD = amountLD; // For simplicity, setting min amount same as amount

            // Default Agent Wallet Address
            const agentAddress = '0x7dec10140f6a10dbdc0b9b4d8ba4d468b1b8e6e6';
            const toAddress = pad(agentAddress as Address);

            // Construct SendParam struct
            const sendParam = {
                dstEid: LAYERZERO_CONFIG.polygonAmoy.eid,
                to: toAddress,
                amountLD: amountLD,
                minAmountLD: minAmountLD,
                extraOptions: '0x' as `0x${string}`, // Empty bytes for default options
                composeMsg: '0x' as `0x${string}`,   // Empty bytes for no composition
                oftCmd: '0x' as `0x${string}`        // Empty bytes for default OFT command
            };

            const fee = await publicClient.readContract({
                address: LAYERZERO_CONFIG.baseSepolia.oftAdapterAddress,
                abi: OFT_ADAPTER_ABI,
                functionName: 'quoteSend',
                args: [sendParam, false], // false for _payInLzToken
            });

            return { fee, sendParam };
        } catch (error) {
            console.error('Error quoting fee:', error);
            throw error;
        }
    }, [address, publicClient]);

    // Send tokens across chain
    const send = useCallback(async (amount: string, decimals: number = 6) => {
        if (!address || !walletClient || !publicClient) return;

        setIsLoading(true);
        try {
            // 1. Get Quote
            const quoteResult = await quote(amount, decimals);
            if (!quoteResult) throw new Error('Failed to get quote');

            const { fee, sendParam } = quoteResult;

            // 2. Send Transaction
            const hash = await walletClient.writeContract({
                address: LAYERZERO_CONFIG.baseSepolia.oftAdapterAddress,
                abi: OFT_ADAPTER_ABI,
                functionName: 'send',
                args: [
                    sendParam,
                    fee,
                    address // Refund address
                ],
                value: fee.nativeFee, // Send native fee
            });

            console.log('Bridge transaction sent:', hash);
            return hash;
        } catch (error) {
            console.error('Error sending bridge transaction:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [address, walletClient, publicClient, quote]);

    // Check allowance
    const checkAllowance = useCallback(async (amount: string, decimals: number = 6) => {
        if (!address || !publicClient) return false;

        try {
            const allowance = await publicClient.readContract({
                address: LAYERZERO_CONFIG.baseSepolia.usdcAddress,
                abi: ERC20_ABI,
                functionName: 'allowance',
                args: [address, LAYERZERO_CONFIG.baseSepolia.oftAdapterAddress],
            });

            const requiredAmount = parseUnits(amount, decimals);
            return allowance >= requiredAmount;
        } catch (error) {
            console.error('Error checking allowance:', error);
            return false;
        }
    }, [address, publicClient]);

    // Approve tokens
    const approve = useCallback(async (amount: string, decimals: number = 6) => {
        if (!address || !walletClient) return;

        setIsLoading(true);
        try {
            const amountToApprove = parseUnits(amount, decimals);

            const hash = await walletClient.writeContract({
                address: LAYERZERO_CONFIG.baseSepolia.usdcAddress,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [LAYERZERO_CONFIG.baseSepolia.oftAdapterAddress, amountToApprove],
            });

            console.log('Approval transaction sent:', hash);
            return hash;
        } catch (error) {
            console.error('Error approving tokens:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [address, walletClient]);

    return {
        quote,
        send,
        checkAllowance,
        approve,
        isLoading
    };
}
