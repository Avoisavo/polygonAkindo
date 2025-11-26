import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { escrowAddress, escrowAbi } from "../utils/escrow";

dotenv.config({ path: "../.env" });

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
    "function decimals() public view returns (uint8)",
    "function transfer(address to, uint256 amount) public returns (bool)"
];

async function main() {
    const rpcUrl = process.env.RPC_URL || "https://rpc-amoy.polygon.technology"; // Default to Amoy if not set
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in .env");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`Using wallet: ${wallet.address}`);

    const escrowContract = new ethers.Contract(escrowAddress, escrowAbi, wallet);

    console.log(`Fetching token address from Escrow contract...`);
    const tokenAddress = await escrowContract.token();
    console.log(`Escrow uses token: ${tokenAddress}`);

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

    const decimals = await tokenContract.decimals();
    const amountToFund = ethers.parseUnits("0.001", decimals); // Fund 1 USDC

    console.log(`Checking balance...`);
    const balance = await tokenContract.balanceOf(wallet.address);
    if (balance < amountToFund) {
        throw new Error(`Insufficient balance. You have ${ethers.formatUnits(balance, decimals)} USDC, need ${ethers.formatUnits(amountToFund, decimals)}`);
    }

    console.log(`Approving Escrow to spend USDC...`);
    const approveTx = await tokenContract.approve(escrowAddress, amountToFund);
    await approveTx.wait();
    console.log(`Approved! Tx: ${approveTx.hash}`);

    console.log(`Depositing ${ethers.formatUnits(amountToFund, decimals)} USDC into Escrow...`);
    const depositTx = await escrowContract.deposit(amountToFund);
    await depositTx.wait();
    console.log(`Deposited! Tx: ${depositTx.hash}`);

    const escrowBalance = await escrowContract.getBalance(wallet.address);
    console.log(`New Escrow Balance: ${ethers.formatUnits(escrowBalance, decimals)} USDC`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
