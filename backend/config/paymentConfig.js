import { paymentMiddleware } from "x402-express";

/**
 * Default payment recipient address
 */
export const PAYMENT_RECIPIENT_ADDRESS = "0xa6f7df49e2d4b48bc1eea0886fb8798fb51046d7";

/**
 * Payment configuration for different routes
 */
export const PAYMENT_ROUTES = {
  "GET /blog": {
    price: "$0.005",  // 0.5 cents per blog access
    network: "polygon-amoy",
    config: {
      description: "Access to Tech Insights Blog premium content",
      inputSchema: {
        type: "object",
        properties: {
          userAgent: { type: "string" }
        }
      }
    }
  },
  "GET /news": {
    price: "$0.003",  // 0.3 cents per news access
    network: "polygon-amoy",
    config: {
      description: "Access to Global Tech News articles",
      inputSchema: {
        type: "object",
        properties: {
          userAgent: { type: "string" }
        }
      }
    }
  }
};

/**
 * Creates payment middleware with configuration
 * @param {string} paymentAddress - Wallet address to receive payments
 * @param {string} facilitatorUrl - Facilitator URL
 * @returns {Function} - Payment middleware
 */
export function createPaymentMiddleware(paymentAddress, facilitatorUrl) {
  return paymentMiddleware(
    paymentAddress,
    PAYMENT_ROUTES,
    {
      url: facilitatorUrl || "https://x402-amoy.polygon.technology",
    }
  );
}

/**
 * Conditional payment enforcement middleware
 * Only applies payment requirements to AI crawlers
 */
export function conditionalPaymentEnforcement(paymentAddress, facilitatorUrl) {
  return (req, res, next) => {
    if (req.isAICrawler) {
      // AI crawler detected - require payment
      const paymentMW = createPaymentMiddleware(paymentAddress, facilitatorUrl);
      paymentMW(req, res, next);
    } else {
      // Regular user - free access
      next();
    }
  };
}

