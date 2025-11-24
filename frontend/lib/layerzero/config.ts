import { Address } from 'viem';

export const LAYERZERO_CONFIG = {
    // Base Sepolia
    baseSepolia: {
        oftAdapterAddress: '0xEd7D591BD2Cd36C25D505A68495420c0710fBb14' as Address,
        usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address, // Base Sepolia USDC
        eid: 40245, // Base Sepolia Endpoint ID
    },
    // Polygon Amoy
    polygonAmoy: {
        eid: 40267, // Polygon Amoy Endpoint ID
    }
};

export const OFT_ADAPTER_ABI = [
    {
        "inputs": [
            {
                "components": [
                    { "internalType": "uint32", "name": "dstEid", "type": "uint32" },
                    { "internalType": "bytes32", "name": "to", "type": "bytes32" },
                    { "internalType": "uint256", "name": "amountLD", "type": "uint256" },
                    { "internalType": "uint256", "name": "minAmountLD", "type": "uint256" },
                    { "internalType": "bytes", "name": "extraOptions", "type": "bytes" },
                    { "internalType": "bytes", "name": "composeMsg", "type": "bytes" },
                    { "internalType": "bytes", "name": "oftCmd", "type": "bytes" }
                ],
                "internalType": "struct SendParam",
                "name": "_sendParam",
                "type": "tuple"
            },
            { "internalType": "bool", "name": "_payInLzToken", "type": "bool" }
        ],
        "name": "quoteSend",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "nativeFee", "type": "uint256" },
                    { "internalType": "uint256", "name": "lzTokenFee", "type": "uint256" }
                ],
                "internalType": "struct MessagingFee",
                "name": "fee",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    { "internalType": "uint32", "name": "dstEid", "type": "uint32" },
                    { "internalType": "bytes32", "name": "to", "type": "bytes32" },
                    { "internalType": "uint256", "name": "amountLD", "type": "uint256" },
                    { "internalType": "uint256", "name": "minAmountLD", "type": "uint256" },
                    { "internalType": "bytes", "name": "extraOptions", "type": "bytes" },
                    { "internalType": "bytes", "name": "composeMsg", "type": "bytes" },
                    { "internalType": "bytes", "name": "oftCmd", "type": "bytes" }
                ],
                "internalType": "struct SendParam",
                "name": "_sendParam",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "uint256", "name": "nativeFee", "type": "uint256" },
                    { "internalType": "uint256", "name": "lzTokenFee", "type": "uint256" }
                ],
                "internalType": "struct MessagingFee",
                "name": "_fee",
                "type": "tuple"
            },
            { "internalType": "address", "name": "_refundAddress", "type": "address" }
        ],
        "name": "send",
        "outputs": [
            {
                "components": [
                    { "internalType": "bytes32", "name": "guid", "type": "bytes32" },
                    { "internalType": "uint64", "name": "nonce", "type": "uint64" },
                    {
                        "components": [
                            { "internalType": "uint256", "name": "nativeFee", "type": "uint256" },
                            { "internalType": "uint256", "name": "lzTokenFee", "type": "uint256" }
                        ],
                        "internalType": "struct MessagingFee",
                        "name": "fee",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct MessagingReceipt",
                "name": "msgReceipt",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "uint256", "name": "amountSentLD", "type": "uint256" },
                    { "internalType": "uint256", "name": "amountReceivedLD", "type": "uint256" }
                ],
                "internalType": "struct OFTReceipt",
                "name": "oftReceipt",
                "type": "tuple"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    }
] as const;

export const ERC20_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
