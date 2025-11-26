import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { escrowAddress, escrowAbi } from "../utils/escrow";

dotenv.config({ path: "../.env" });

async function main() {
    console.log("--- x402 Execution: Payment via Escrow ---");

    const rpcUrl = process.env.RPC_URL || "https://rpc-amoy.polygon.technology";
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in .env");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`Agent/Executor (Contract Owner): ${wallet.address}`);

    const escrowContract = new ethers.Contract(escrowAddress, escrowAbi, wallet);

    // In this demo, we assume the 'User' is the same as the 'Agent' for simplicity,
    // or you can specify a different user address if you have one that deposited funds.
    // The 'payService' function deducts from 'userAddress' internal balance and sends to 'contractOwner'.
    const userAddress = wallet.address;

    // Check User's Escrow Balance
    const balance = await escrowContract.getBalance(userAddress);
    const decimals = 6; // Assuming USDC
    console.log(`User Escrow Balance: ${ethers.formatUnits(balance, decimals)} USDC`);

    const amountToPay = ethers.parseUnits("0.001", decimals); // Pay 0.001 USDC

    if (balance < amountToPay) {
        throw new Error("Insufficient escrow balance. Please run 'npm run fund' first.");
    }

    console.log(`Executing payService... (Deducting ${ethers.formatUnits(amountToPay, decimals)} USDC from Escrow)`);

    const startTime = Date.now();
    // This transaction is sent by the Agent (Contract Owner)
    // It consumes gas from the Agent's wallet, but moves USDC from Escrow to Agent.
    const tx = await escrowContract.payService(userAddress, amountToPay);
    console.log(`Transaction sent! Hash: ${tx.hash}`);

    await tx.wait();
    const endTime = Date.now();

    console.log("Payment settled via Escrow.");
    console.log(`⏱️  Time taken for Escrow Payment: ${(endTime - startTime) / 1000} seconds`);

    const newBalance = await escrowContract.getBalance(userAddress);
    console.log(`New Escrow Balance: ${ethers.formatUnits(newBalance, decimals)} USDC`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
