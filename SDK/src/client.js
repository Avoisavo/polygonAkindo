const { ethers } = require('ethers');
const { Options, addressToBytes32 } = require('@layerzerolabs/lz-v2-utilities');

// ABI for the registerSite function
const CONTRACT_ABI = [
    "function registerSite(bytes32 siteId, uint256 price) external",
    "function updatePrice(bytes32 siteId, uint256 newPrice) external",
    "event SiteRegistered(bytes32 indexed siteId, uint256 price, address owner)"
];

// Minimal ABI for OFT and ERC20 interactions
const OFT_ABI = [
    "function quoteSend(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, bool _payInLzToken) external view returns (tuple(uint256 nativeFee, uint256 lzTokenFee) msgFee)",
    "function send(tuple(uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, tuple(uint256 nativeFee, uint256 lzTokenFee) _fee, address _refundAddress) external payable returns (tuple(bytes32 guid, uint64 nonce, tuple(uint256 nativeFee, uint256 lzTokenFee) fee) msgReceipt, tuple(uint256 amountSentLD, uint256 amountReceivedLD) oftReceipt)",
    "function token() external view returns (address)",
    "function approvalRequired() external view returns (bool)"
];

const ERC20_ABI = [
    "function decimals() external view returns (uint8)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];

class X402Client {
    /**
     * Initialize the x402 Client
     * @param {string} privateKey - Wallet private key for signing transactions
     * @param {string} contractAddress - Address of the x402poly contract
     * @param {string} rpcUrl - RPC URL for the network
     */
    constructor(privateKey, contractAddress, rpcUrl) {
        if (!privateKey) throw new Error("Private key is required");

        this.provider = new ethers.JsonRpcProvider(rpcUrl || "https://rpc-amoy.polygon.technology");
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
    }

    /**
     * Register a website on the x402 protocol
     * @param {string} url - The website URL (used as ID)
     * @param {string} price - Price per access (in Wei or formatted string)
     */
    async registerSite(url, price) {
        try {
            // Create a unique ID from the URL (keccak256 hash)
            const siteId = ethers.id(url);

            // Convert price if it's a string like "0.01" (assuming 6 decimals for USDC or 18 for ETH)
            // For this demo, let's assume the contract expects raw integer values
            const priceInt = BigInt(price);

            console.log(`📝 Registering site: ${url} (ID: ${siteId}) with price: ${priceInt}`);

            const tx = await this.contract.registerSite(siteId, priceInt);
            console.log(`🚀 Transaction sent: ${tx.hash}`);

            const receipt = await tx.wait();
            console.log(`✅ Site registered! Block: ${receipt.blockNumber}`);

            return {
                success: true,
                siteId,
                txHash: receipt.hash
            };
        } catch (error) {
            console.error("Failed to register site:", error);
            throw error;
        }
    }

    /**
     * Swap tokens cross-chain using LayerZero
     * @param {number} srcEid - Source endpoint ID
     * @param {number} dstEid - Destination endpoint ID
     * @param {string} amount - Amount to send (human readable string)
     * @param {string} to - Recipient address
     * @param {string} oftAddress - Address of the OFT contract on source chain
     */
    async swap(srcEid, dstEid, amount, to, oftAddress) {
        try {
            console.log(`🔄 Initiating swap: ${amount} tokens from EID ${srcEid} to EID ${dstEid}`);

            const signer = this.wallet;
            const oft = new ethers.Contract(oftAddress, OFT_ABI, signer);

            // 1. Fetch underlying token and decimals
            const underlying = await oft.token();
            const erc20 = new ethers.Contract(underlying, ERC20_ABI, signer);
            const decimals = await erc20.decimals();

            // 2. Normalize amount
            const amountUnits = ethers.parseUnits(amount, decimals);

            // 3. Check allowance if required
            try {
                const approvalRequired = await oft.approvalRequired();
                if (approvalRequired) {
                    const currentAllowance = await erc20.allowance(signer.address, oftAddress);
                    if (currentAllowance < amountUnits) {
                        console.log('📝 Approving ERC20 tokens...');
                        const approveTx = await erc20.approve(oftAddress, amountUnits);
                        await approveTx.wait();
                        console.log('✅ Approved');
                    }
                }
            } catch (error) {
                // Ignore if approvalRequired fails (likely standard OFT)
            }

            // 4. Prepare params
            const toBytes = addressToBytes32(to);
            const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex(); // Default options

            const sendParam = {
                dstEid,
                to: toBytes,
                amountLD: amountUnits,
                minAmountLD: amountUnits, // No slippage for now
                extraOptions: options,
                composeMsg: '0x',
                oftCmd: '0x'
            };

            // 5. Quote fee
            console.log('💰 Quoting fee...');
            const msgFee = await oft.quoteSend(sendParam, false);

            // 6. Send transaction
            console.log('🚀 Sending transaction...');
            const tx = await oft.send(sendParam, msgFee, signer.address, {
                value: msgFee.nativeFee
            });

            const receipt = await tx.wait();
            console.log(`✅ Swap successful! Tx: ${receipt.hash}`);

            return {
                success: true,
                txHash: receipt.hash
            };

        } catch (error) {
            console.error("Failed to swap:", error);
            throw error;
        }
    }
}

module.exports = {
    X402Client
};
