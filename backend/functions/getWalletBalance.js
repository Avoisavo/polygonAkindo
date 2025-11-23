import { createPublicClient, http, formatEther, getContract, formatUnits } from 'viem';
import { polygonAmoy } from 'viem/chains';

/**
 * Get wallet balance for a given address
 * @param {string} address - The wallet address to check
 * @returns {Promise<Object>} - Balance information
 */
async function getWalletBalance(address = '0x7dec10140f6a10dbdc0b9b4d8ba4d468b1b8e6e6') {
    try {
        const network = 'polygon-amoy';

        if (address === '0x7dec10140f6a10dbdc0b9b4d8ba4d468b1b8e6e6') {
            console.log('🤖 Using default Agent Wallet address');
        }

        console.log(`💰 Checking balance for ${address} on ${network}`);

        // Always use Polygon Amoy
        const chain = polygonAmoy;

        // Initialize client
        const client = createPublicClient({
            chain: chain,
            transport: http()
        });

        // USDC Token Balance
        const usdcAddress = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582';
        const erc20Abi = [
            {
                inputs: [{ name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            }
        ];

        const usdcContract = getContract({
            address: usdcAddress,
            abi: erc20Abi,
            client: client,
        });

        const [usdcBalance, usdcDecimals, usdcSymbol] = await Promise.all([
            usdcContract.read.balanceOf([address]),
            usdcContract.read.decimals(),
            usdcContract.read.symbol(),
        ]);

        const usdcFormatted = formatUnits(usdcBalance, usdcDecimals);

        console.log(`✅ USDC Balance: ${usdcFormatted} ${usdcSymbol}`);

        return {
            success: true,
            address: address,
            network: network,
            // Only returning USDC as requested
            balance: usdcFormatted,
            symbol: usdcSymbol,
            tokenAddress: usdcAddress
        };

    } catch (error) {
        console.error('❌ Failed to get balance:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Function metadata for AI agent
const metadata = {
    name: 'getWalletBalance',
    description: 'Get the USDC balance. If the user asks for "my balance", "agent balance", or just "balance" without an address, CALL THIS FUNCTION WITHOUT ARGUMENTS to use the default Agent Wallet.',
    parameters: {
        type: 'object',
        properties: {
            address: {
                type: 'string',
                description: 'Optional: The wallet address to check. If omitted, the Agent\'s default wallet (0x7dec...) will be used.'
            }
        },
        required: []
    }
};

export {
    getWalletBalance,
    metadata
};
