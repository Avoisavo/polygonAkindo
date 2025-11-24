const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Adding liquidity with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

    // Get addresses from command line or environment
    const exchangeAddress = process.env.EXCHANGE_ADDRESS || process.argv[2];
    const tokenAddress = process.env.TOKEN_ADDRESS || process.argv[3];

    if (!exchangeAddress || !tokenAddress) {
        console.error("Usage: node add-liquidity.js <EXCHANGE_ADDRESS> <TOKEN_ADDRESS>");
        console.error("Or set EXCHANGE_ADDRESS and TOKEN_ADDRESS environment variables");
        process.exit(1);
    }

    // Amount of ETH to add (in ETH)
    const ethAmount = process.env.ETH_AMOUNT || "0.1";

    // Get contracts
    const Exchange = await ethers.getContractAt("Exchange", exchangeAddress);
    const Token = await ethers.getContractAt("IERC20", tokenAddress);

    // Get token decimals (USDC = 6, most tokens = 18)
    let tokenDecimals;
    try {
        // Try to get decimals from the token contract
        const tokenWithDecimals = await ethers.getContractAt(
            ["function decimals() view returns (uint8)"],
            tokenAddress
        );
        tokenDecimals = await tokenWithDecimals.decimals();
        console.log("\n=== Token Info ===");
        console.log("Token decimals:", tokenDecimals);
    } catch (error) {
        // If decimals() doesn't exist, default to 18
        tokenDecimals = 18;
        console.log("\n=== Token Info ===");
        console.log("Token decimals: 18 (default, decimals() not found)");
    }

    console.log("\n=== Contract Info ===");
    console.log("Exchange:", exchangeAddress);
    console.log("Token:", tokenAddress);
    console.log("ETH to add:", ethAmount);

    // Check if this is first liquidity
    const totalSupply = await Exchange.totalSupply();
    const isFirstLiquidity = totalSupply === 0n;

    let tokenAmount;

    if (isFirstLiquidity) {
        // First liquidity - you set the initial price
        // Example: 1 ETH = 2000 tokens (adjust as needed)
        const tokensPerEth = process.env.TOKENS_PER_ETH || "2000";
        tokenAmount = ethers.parseUnits(
            (parseFloat(ethAmount) * parseFloat(tokensPerEth)).toString(),
            tokenDecimals
        );
        console.log("\n=== First Liquidity ===");
        console.log("Setting initial price: 1 ETH =", tokensPerEth, "tokens");
    } else {
        // Subsequent liquidity - must match existing ratio
        const rate = await Exchange.addLiquidityRate();
        tokenAmount = (ethers.parseEther(ethAmount) * rate) / ethers.parseUnits("1", tokenDecimals);
        console.log("\n=== Adding to Existing Pool ===");
        console.log("Current rate:", ethers.formatUnits(rate, tokenDecimals), "tokens per ETH");
    }

    console.log("Token amount to add:", ethers.formatUnits(tokenAmount, tokenDecimals));

    // Check token balance
    const tokenBalance = await Token.balanceOf(deployer.address);
    console.log("\n=== Balance Check ===");
    console.log("Your token balance:", ethers.formatUnits(tokenBalance, tokenDecimals));

    if (tokenBalance < tokenAmount) {
        console.error("ERROR: Insufficient token balance!");
        console.error("Required:", ethers.formatUnits(tokenAmount, tokenDecimals));
        console.error("Available:", ethers.formatUnits(tokenBalance, tokenDecimals));
        process.exit(1);
    }

    // Approve tokens
    console.log("\n=== Step 1: Approving Tokens ===");
    const approveTx = await Token.approve(exchangeAddress, tokenAmount);
    await approveTx.wait();
    console.log("✓ Tokens approved");

    // Add liquidity
    console.log("\n=== Step 2: Adding Liquidity ===");
    const addLiquidityTx = await Exchange.addLiquidity(tokenAmount, {
        value: ethers.parseEther(ethAmount)
    });
    const receipt = await addLiquidityTx.wait();
    console.log("✓ Liquidity added");
    console.log("Transaction hash:", receipt.hash);

    // Get LP tokens received
    const lpBalance = await Exchange.balanceOf(deployer.address);
    console.log("\n=== Success ===");
    console.log("LP tokens received:", ethers.formatUnits(lpBalance, 18));

    // Show pool state
    const ethReserve = await ethers.provider.getBalance(exchangeAddress);
    const tokenReserve = await Exchange.getReserve();

    console.log("\n=== Pool State ===");
    console.log("ETH Reserve:", ethers.formatEther(ethReserve));
    console.log("Token Reserve:", ethers.formatUnits(tokenReserve, tokenDecimals));
    console.log("Total LP Supply:", ethers.formatUnits(await Exchange.totalSupply(), 18));
    console.log("Your LP Share:", ((lpBalance * 10000n) / await Exchange.totalSupply()) / 100n, "%");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
