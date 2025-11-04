import "dotenv/config";
import express from "express";
import { detectAICrawler } from "./utils/crawlerDetector.js";
import { conditionalPaymentEnforcement } from "./config/paymentConfig.js";
import proxyRoutes from "./routes/proxyRoutes.js";

const app = express();

// Configuration from environment
const PAYMENT_ADDRESS = process.env.PAYMENT_ADDRESS;
const FACILITATOR_URL = process.env.FACILITATOR_URL;
const PORT = process.env.PROXY_PORT || 4022;

// Apply crawler detection to all routes
app.use(detectAICrawler);

// Apply conditional payment enforcement (only for AI crawlers)
app.use(conditionalPaymentEnforcement(PAYMENT_ADDRESS, FACILITATOR_URL));

// Mount proxy routes
app.use('/', proxyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`\n🛡️  x402 Proxy Server running on http://localhost:${PORT}`);
  console.log(`📋 Make sure demo websites are running on http://localhost:3002`);
  console.log(`\n💡 Test it:`);
  console.log(`   Browser (free):    http://localhost:${PORT}/blog`);
  console.log(`   Browser (free):    http://localhost:${PORT}/news`);
  console.log(`   AI crawler (paid): curl -H "User-Agent: GPTBot" http://localhost:${PORT}/blog\n`);
});
