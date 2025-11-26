import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { escrowAddress, escrowAbi } from "../utils/escrow";

dotenv.config({ path: "../.env" });

const ERC20_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)"
];

async function main() {
    console.log("--- x402 Execution: Direct Payment (No Escrow) ---");

    const rpcUrl = process.env.RPC_URL || "https://rpc-amoy.polygon.technology";
    const privateKey = process.env.PRIVATE_KEY;


    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in .env");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`Payer: ${wallet.address}`);

    // We use the Escrow contract just to get the Service Provider address (Contract Owner)
    // In a real direct scenario, you'd know the provider's address beforehand.
    const escrowContract = new ethers.Contract(escrowAddress, escrowAbi, provider);
    const serviceProvider = await escrowContract.contractOwner();
    console.log(`Service Provider (Recipient): ${serviceProvider}`);

    console.log(`Fetching token address from Escrow contract...`);
    const tokenAddress = await escrowContract.token();
    console.log(`Using token: ${tokenAddress}`);

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
    const decimals = await tokenContract.decimals();
    const amountToPay = ethers.parseUnits("0.001", decimals); // Pay 0.001 USDC

    console.log(`Paying ${ethers.formatUnits(amountToPay, decimals)} USDC directly from wallet...`);

    const startTime = Date.now();
    const tx = await tokenContract.transfer(serviceProvider, amountToPay);
    console.log(`Transaction sent! Hash: ${tx.hash}`);

    console.log("Waiting for confirmation...");
    await tx.wait();
    const endTime = Date.now();

    console.log("Payment confirmed.");
    console.log(`⏱️  Standard Flow Latency (Tx Confirmation): ${(endTime - startTime)} ms`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

