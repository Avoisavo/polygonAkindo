require('dotenv').config();
const { X402Client } = require('../src/client');

async function main() {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"; // Placeholder if not needed for swap

    if (!privateKey) {
        console.error("❌ Error: PRIVATE_KEY not found in .env file");
        process.exit(1);
    }

    console.log("Initializing X402Client...");
    const client = new X402Client(privateKey, contractAddress, rpcUrl);

    // Configuration for the swap
    // YOU MUST UPDATE THESE VALUES FOR YOUR TEST
    const srcEid = 40267; // Example: Amoy (check LayerZero docs for correct EIDs)
    const dstEid = 40267; // Example: Amoy (sending to same chain for test if allowed, or use another)
    const amount = "0.001"; // Amount to swap
    const to = client.wallet.address; // Send to self
    const oftAddress = "0xYourOFTAddress"; // REPLACE WITH REAL OFT ADDRESS

    if (oftAddress === "0xYourOFTAddress") {
        console.error("❌ Error: Please update the 'oftAddress' in test/test-swap-live.js");
        process.exit(1);
    }

    try {
        console.log(`Attempting to swap ${amount} tokens...`);
        const result = await client.swap(srcEid, dstEid, amount, to, oftAddress);
        console.log("✅ Swap successful!");
        console.log("Tx Hash:", result.txHash);
    } catch (error) {
        console.error("❌ Swap failed:", error);
    }
}

main();
