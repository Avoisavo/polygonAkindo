const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 Starting deployment process...");

    // 1. Check Environment
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("❌ PRIVATE_KEY not found in .env file. Please add it.");
    }

    const rpcUrl = process.env.POLYGON_AMOY_RPC_URL;
    console.log(`ℹ️  Using RPC URL: ${rpcUrl || "Default Hardhat config"}`);

    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deploying with account: ${deployer.address}`);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`💰 Account balance: ${ethers.formatEther(balance)} MATIC`);

    if (balance === 0n) {
        throw new Error("❌ Deployer account has 0 MATIC. Please get funds from a faucet.");
    }

    // 2. Configuration
    // USDC on Amoy Testnet
    const PAYMENT_TOKEN = process.env.PAYMENT_TOKEN_ADDRESS || "0x41e94eb019c0762f9cbfcfee217e8e5252c3fe89";
    console.log(`🪙  Payment Token (USDC): ${PAYMENT_TOKEN}`);

    // 3. Deploy
    console.log("\n⏳ Deploying x402poly contract...");
    const X402Poly = await ethers.getContractFactory("x402poly");
    const x402poly = await X402Poly.deploy(PAYMENT_TOKEN);

    console.log("   Waiting for deployment transaction...");
    await x402poly.waitForDeployment();

    const contractAddress = await x402poly.getAddress();

    // 4. Success Output
    console.log("\n✅ Deployment Successful!");
    console.log("============================================");
    console.log(`📜 Contract Address: ${contractAddress}`);
    console.log("============================================");

    console.log("\n👉 NEXT STEPS:");
    console.log("1. Update Frontend:");
    console.log(`   File: frontend/lib/networkConfig.ts`);
    console.log(`   Set: export const X402POLY_CONTRACT = "${contractAddress}";`);

    console.log("\n2. Update Backend:");
    console.log(`   File: backend/.env`);
    console.log(`   Set: X402_CONTRACT_ADDRESS=${contractAddress}`);

    console.log("\n3. Verify (Optional):");
    console.log(`   npx hardhat verify --network amoy ${contractAddress} "${PAYMENT_TOKEN}"`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment Failed:");
        console.error(error);
        process.exit(1);
    });
