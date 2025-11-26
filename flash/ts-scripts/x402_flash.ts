import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { escrowAddress, escrowAbi } from "../utils/escrow";

dotenv.config({ path: "../.env" });

const ERC20_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)"
];

async function main() {
    // Check for simulation flag
    const simulateFailure = process.argv.includes("--fail");

    console.log("--- x402 Execution: Flash Payment Flow ---");
    if (simulateFailure) {
        console.log("⚠️  SIMULATION MODE: Simulating a failed direct payment.");
    }

    const rpcUrl = process.env.RPC_URL || "https://rpc-amoy.polygon.technology";
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in .env");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // In this demo, 'wallet' acts as both User and Seller (Contract Owner)
    // Real world: User and Seller are different.
    const userAddress = wallet.address;

    const escrowContract = new ethers.Contract(escrowAddress, escrowAbi, wallet);

    // Get Seller Address (Contract Owner)
    const sellerAddress = await escrowContract.contractOwner();

    // Get Token Details
    const tokenAddress = await escrowContract.token();
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
    const decimals = await tokenContract.decimals();

    const amountToPay = ethers.parseUnits("0.001", decimals); // 0.001 USDC

    // ---------------------------------------------------------
    // STEP 1: User initiates Direct Payment
    // ---------------------------------------------------------
    console.log(`\n[User] Initiating direct payment of 0.001 USDC to Seller...`);

    const startTime = Date.now(); // Start Timer

    let txHash: string;
    let txResponse: ethers.ContractTransactionResponse | null = null;

    try {
        if (simulateFailure) {
            // Create a fake hash to simulate a transaction that the seller "sees" but fails later
            txHash = "0x" + "1".repeat(64);
            console.log(`[User] Broadcasted Transaction (Simulated Bad): ${txHash}`);
        } else {
            // Real transaction
            txResponse = await tokenContract.transfer(sellerAddress, amountToPay);
            if (txResponse) {
                txHash = txResponse.hash;
                console.log(`[User] Broadcasted Transaction: ${txHash}`);
            } else {
                throw new Error("Transaction failed to return response");
            }
        }
    } catch (e: any) {
        console.error("[User] Failed to send tx:", e.message);
        return;
    }

    // ---------------------------------------------------------
    // STEP 2: Seller Receives Request + Tx Hash
    // ---------------------------------------------------------
    console.log(`\n[Seller] Received request + Tx Hash. Checking Escrow coverage...`);

    // Seller checks if User has enough in Escrow to cover this if the tx fails
    const escrowBalance = await escrowContract.getBalance(userAddress);
    // console.log(`[Seller] User Escrow Balance: ${ethers.formatUnits(escrowBalance, decimals)} USDC`);
    console.log(`[Seller] Required Coverage:   ${ethers.formatUnits(amountToPay, decimals)} USDC`);

    // ---------------------------------------------------------
    // STEP 3: Optimistic / Flash Delivery
    // ---------------------------------------------------------
    if (escrowBalance >= amountToPay) {
        const endTime = Date.now(); // Stop Timer
        console.log(`✅ Escrow Balance Sufficient.`);
        console.log(`⚡ [Seller] FLASH DELIVERY: Sending data to user immediately!`);
        console.log(`⏱️  Flash Flow Latency (Escrow Check): ${(endTime - startTime)} ms`);
        // In a real app, the data would be returned here.
    } else {
        console.log(`⚠️ Insufficient Escrow Balance.`);
        console.log(`⏳ [Seller] Must wait for transaction confirmation before delivering...`);

        if (txResponse) {
            await txResponse.wait();
            console.log(`✅ [Seller] Payment Confirmed. Delivering data now.`);
        } else {
            console.log(`❌ [Seller] Payment Failed. No delivery.`);
        }
        return; // End here for non-flash flow
    }

    // ---------------------------------------------------------
    // STEP 4: Background Settlement (Async)
    // ---------------------------------------------------------
    console.log(`\n🔄 [Background] Monitoring transaction status...`);

    try {
        if (simulateFailure) {
            // Simulate a delay then failure
            await new Promise(resolve => setTimeout(resolve, 2000));
            throw new Error("Transaction dropped or reverted (Simulated)");
        }

        if (txResponse) {
            const receipt = await txResponse.wait();
            if (receipt && receipt.status === 1) {
                console.log(`✅ [Background] Transaction Confirmed on-chain.`);
                console.log(`🎉 Payment successful. No action needed on Escrow.`);
            } else {
                throw new Error("Transaction reverted on-chain");
            }
        }
    } catch (error: any) {
        console.log(`❌ [Background] Payment Failed: ${error.message}`);
        console.log(`⚠️  Triggering Escrow Fallback...`);

        // ---------------------------------------------------------
        // STEP 5: Fallback - Deduct from Escrow
        // ---------------------------------------------------------
        console.log(`[Seller] Calling payService() to deduct ${ethers.formatUnits(amountToPay, decimals)} USDC...`);

        try {
            const fallbackTx = await escrowContract.payService(userAddress, amountToPay);
            console.log(`[Seller] Fallback Tx Sent: ${fallbackTx.hash}`);
            await fallbackTx.wait();
            console.log(`✅ [Seller] Payment successfully recovered from Escrow.`);

            const newBalance = await escrowContract.getBalance(userAddress);
            console.log(`[Seller] Remaining Escrow Balance: ${ethers.formatUnits(newBalance, decimals)} USDC`);
        } catch (fallbackError: any) {
            console.error(`❌ [Seller] Critical: Failed to deduct from escrow: ${fallbackError.message}`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
