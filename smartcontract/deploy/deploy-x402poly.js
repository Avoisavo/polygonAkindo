const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get payment token address from environment variable
  // For Polygon Amoy, you can use USDC testnet token
  // Default: USDC on Amoy (lowercase, will be checksummed)
  const paymentTokenAddressRaw = process.env.PAYMENT_TOKEN_ADDRESS || "0x41e94eb019c0762f9cbfcfee217e8e5252c3fe89";
  
  if (!paymentTokenAddressRaw) {
    throw new Error("PAYMENT_TOKEN_ADDRESS environment variable is required");
  }

  // Convert to checksummed address (EIP-55)
  const paymentTokenAddress = ethers.getAddress(paymentTokenAddressRaw);
  console.log("Payment token address:", paymentTokenAddress);

  // Deploy the x402poly contract
  const X402Poly = await ethers.getContractFactory("x402poly");
  console.log("Deploying x402poly...");
  
  const x402poly = await X402Poly.deploy(paymentTokenAddress);
  await x402poly.waitForDeployment();

  const contractAddress = await x402poly.getAddress();
  console.log("x402poly deployed to:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

  // Verify deployment
  const paymentToken = await x402poly.paymentToken();
  console.log("Verified payment token:", paymentToken);
  
  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", contractAddress);
  console.log("Payment Token:", paymentToken);
  console.log("Deployer:", deployer.address);
  console.log("\nTo verify on Polygonscan, run:");
  console.log(`npx hardhat verify --network amoy ${contractAddress} "${paymentToken}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

