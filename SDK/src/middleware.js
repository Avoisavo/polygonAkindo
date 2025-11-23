const { ethers } = require('ethers');

/**
 * x402 Payment Middleware
 * "The Gatekeeper"
 * 
 * @param {Object} options Configuration options
 * @param {string} options.walletAddress - The address to receive payments
 * @param {string} options.price - Price in USDC/ETH (e.g. "0.01")
 * @param {string} options.network - Network identifier (default: "polygon-amoy")
 * @param {string} options.tokenAddress - Payment token address (optional)
 * @returns {Function} Express middleware
 */
function paymentGuard(options) {
    const {
        walletAddress,
        price = "0.01",
        network = "polygon-amoy",
        tokenAddress
    } = options;

    if (!walletAddress) {
        throw new Error("x402-sdk: walletAddress is required");
    }

    return async (req, res, next) => {
        // 1. Check for payment proof in headers
        const txHash = req.headers['x-payment-tx'] || req.headers['x402-tx'];

        // If no payment proof, return 402 with the bill
        if (!txHash) {
            return res.status(402).json({
                error: "Payment Required",
                message: `Access requires payment of ${price} to ${walletAddress}`,
                paymentDetails: {
                    price,
                    address: walletAddress,
                    network,
                    token: tokenAddress || "NATIVE"
                }
            });
        }

        // 2. Verify the payment (The Scanner)
        try {
            const isValid = await verifyPayment(txHash, walletAddress, price, network);

            if (isValid) {
                // Attach payment info to request
                req.payment = {
                    txHash,
                    verified: true,
                    timestamp: Date.now()
                };
                return next();
            } else {
                return res.status(403).json({
                    error: "Invalid Payment",
                    message: "The provided transaction hash is invalid or insufficient."
                });
            }
        } catch (error) {
            console.error("Payment verification failed:", error);
            return res.status(500).json({
                error: "Verification Error",
                message: "Could not verify payment status."
            });
        }
    };
}

/**
 * Verify a transaction on-chain
 * NOTE: For MVP, we are doing a basic check.
 * In production, this should verify:
 * - Recipient matches walletAddress
 * - Amount >= price
 * - Token matches (if applicable)
 * - Transaction is confirmed
 * - Transaction is recent (to prevent replay attacks)
 */
async function verifyPayment(txHash, recipient, price, network) {
    // TODO: Connect to actual RPC provider based on network
    // For now, we simulate verification for the demo
    console.log(`🔍 Verifying tx: ${txHash} for ${price} to ${recipient}`);

    // Mock verification: assume any hash starting with "0x" is valid for now
    // In real implementation:
    // const provider = new ethers.JsonRpcProvider(getRpcUrl(network));
    // const tx = await provider.getTransaction(txHash);
    // return tx.to === recipient && tx.value >= ethers.parseEther(price);

    if (txHash && txHash.startsWith('0x') && txHash.length > 10) {
        return true;
    }

    return false;
}

module.exports = {
    paymentGuard
};
