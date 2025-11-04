import "dotenv/config";
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.error("Error: PRIVATE_KEY environment variable is required");
  console.error("Set it in your .env file or run:");
  console.error("PRIVATE_KEY=0xYourPrivateKey node clients/ai-crawler.js");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
console.log("\n🤖 AI Crawler Simulation");
console.log("========================");
console.log("Wallet address:", account.address);
console.log("User-Agent: GPTBot/1.0 (Simulating OpenAI's crawler)\n");

// Wrap fetch with payment capability
const fetchWithPayment = wrapFetchWithPayment(fetch, account);

// Simulate AI crawler accessing protected content
console.log("Attempting to access protected blog...\n");

fetchWithPayment("http://localhost:4022/blog", {
  method: "GET",
  headers: {
    "User-Agent": "GPTBot/1.0"  // This triggers AI detection!
  }
})
  .then(async response => {
    console.log("✅ Access granted! Payment successful.\n");
    
    const html = await response.text();
    
    // Show a preview of the content
    const preview = html.substring(0, 200).replace(/\n/g, ' ');
    console.log("Content preview:");
    console.log(preview + "...\n");
    
    // Decode payment response
    const paymentResponse = decodeXPaymentResponse(
      response.headers.get("x-payment-response")
    );
    
    console.log("💰 Payment details:");
    console.log("   Transaction:", paymentResponse.transaction);
    console.log("   Network:", paymentResponse.network);
    console.log("   Payer:", paymentResponse.payer);
    console.log("   Success:", paymentResponse.success);
    
    console.log("\n🎉 AI crawler successfully paid and accessed content!");
  })
  .catch(error => {
    console.error("❌ Error:", error.message);
    if (error.response?.data) {
      console.error("Details:", error.response.data);
    }
  });

