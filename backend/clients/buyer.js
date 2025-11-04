import "dotenv/config";
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.error("Error: PRIVATE_KEY environment variable is required");
  console.error("Usage: PRIVATE_KEY=0xYourPrivateKey node clients/buyer.js");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
console.log("Using account address:", account.address);

const fetchWithPayment = wrapFetchWithPayment(fetch, account);

fetchWithPayment("http://localhost:4021/weather", {
  method: "GET",
})
  .then(async response => {
    const data = await response.json();
    console.log("Response:", data);

    const paymentResponse = decodeXPaymentResponse(
      response.headers.get("x-payment-response")
    );
    console.log("Payment details:", paymentResponse);
  })
  .catch(error => {
    console.error("Error:", error.response?.data?.error || error.message);
  });