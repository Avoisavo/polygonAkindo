import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
    const rpcUrl = process.env.RPC_URL || "https://rpc-amoy.polygon.technology";
    const tokenAddress = process.env.ESCROW_TOKEN_ADDRESS;

    if (!tokenAddress) {
        throw new Error("Missing ESCROW_TOKEN_ADDRESS in .env");
    }

    console.log(`Checking token address: ${tokenAddress}`);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const code = await provider.getCode(tokenAddress);

    if (code === "0x") {
        console.error("Error: ESCROW_TOKEN_ADDRESS is an EOA (wallet), not a contract!");
    } else {
        console.log("ESCROW_TOKEN_ADDRESS is a contract.");
        // Try to get symbol
        const token = new ethers.Contract(tokenAddress, ["function symbol() view returns (string)"], provider);
        try {
            const symbol = await token.symbol();
            console.log(`Token Symbol: ${symbol}`);
        } catch (e) {
            console.log("Could not fetch symbol.");
        }
    }
}

main().catch(console.error);
