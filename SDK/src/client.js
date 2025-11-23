const { ethers } = require('ethers');

// ABI for the registerSite function
const CONTRACT_ABI = [
    "function registerSite(bytes32 siteId, uint256 price) external",
    "function updatePrice(bytes32 siteId, uint256 newPrice) external",
    "event SiteRegistered(bytes32 indexed siteId, uint256 price, address owner)"
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
}

module.exports = {
    X402Client
};
