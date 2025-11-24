const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying AMM contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Step 1: Deploy Registry
    console.log("\n=== Deploying Registry ===");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();

    const registryAddress = await registry.getAddress();
    console.log("Registry deployed to:", registryAddress);

    // Step 2: Get token address from environment or use default USDC on Amoy
    const tokenAddressRaw = process.env.TOKEN_ADDRESS || "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
    const tokenAddress = ethers.getAddress(tokenAddressRaw);
    console.log("\n=== Creating Exchange for Token ===");
    console.log("Token address:", tokenAddress);

    // Step 3: Create Exchange through Registry
    console.log("Creating exchange...");
    const tx = await registry.createExchange(tokenAddress);
    await tx.wait();

    // Get the exchange address
    const exchangeAddress = await registry.getExchange(tokenAddress);
    console.log("Exchange created at:", exchangeAddress);

    // Verify deployment
    const Exchange = await ethers.getContractAt("Exchange", exchangeAddress);
    const exchangeTokenAddress = await Exchange.tokenAddress();
    const exchangeRegistryAddress = await Exchange.registryAddress();

    console.log("\n=== Verification ===");
    console.log("Exchange token address:", exchangeTokenAddress);
    console.log("Exchange registry address:", exchangeRegistryAddress);
    console.log("Verification:", exchangeTokenAddress === tokenAddress ? "✓ PASSED" : "✗ FAILED");

    // Network info
    const network = await ethers.provider.getNetwork();
    console.log("\n=== Network Info ===");
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId);

    console.log("\n=== Deployment Summary ===");
    console.log("Registry Address:", registryAddress);
    console.log("Exchange Address:", exchangeAddress);
    console.log("Token Address:", tokenAddress);
    console.log("Deployer:", deployer.address);

    console.log("\n=== Next Steps ===");
    console.log("1. Add liquidity to the exchange:");
    console.log(`   - Call addLiquidity() on ${exchangeAddress}`);
    console.log("   - Send ETH and approve tokens first");
    console.log("\n2. Verify contracts on Polygonscan:");
    console.log(`   npx hardhat verify --network amoy ${registryAddress}`);
    console.log(`   npx hardhat verify --network amoy ${exchangeAddress} "${tokenAddress}"`);

    console.log("\n=== Contract Addresses (save these) ===");
    console.log(JSON.stringify({
        registry: registryAddress,
        exchange: exchangeAddress,
        token: tokenAddress,
        network: network.name,
        chainId: network.chainId.toString()
    }, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
