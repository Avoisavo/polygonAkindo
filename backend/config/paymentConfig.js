import { paymentMiddleware } from "x402-express";

/**
 * Default payment recipient address
 */
export const PAYMENT_RECIPIENT_ADDRESS = "0xa6f7df49e2d4b48bc1eea0886fb8798fb51046d7";

/**
 * Payment configuration for different routes
 */
export let PAYMENT_ROUTES = {
  "GET /blog": {
    price: "$0.01",  // 1 cent per blog access
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
};

/**
 * Updates the payment routes and recreates the middleware
 * @param {Object} newRoutes - New payment routes object
 */
export function updatePaymentRoutes(newRoutes) {
  PAYMENT_ROUTES = { ...PAYMENT_ROUTES, ...newRoutes };
  console.log("Updated PAYMENT_ROUTES:", Object.keys(PAYMENT_ROUTES));
}

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
 * 
 * The x402-express paymentMiddleware automatically:
 * 1. Returns 402 Payment Required when no payment is provided
 * 2. Verifies payments with the facilitator when x-payment header is present
 * 3. Grants access when payment is valid
 */
export function conditionalPaymentEnforcement(paymentAddress, facilitatorUrl) {
  // We need to create the middleware dynamically because PAYMENT_ROUTES changes

  return (req, res, next) => {
    if (req.isAICrawler) {
      // AI crawler detected - apply payment enforcement
      console.log('   💰 AI crawler detected, enforcing payment...');

      // Create fresh middleware with current routes
      const paymentMW = createPaymentMiddleware(paymentAddress, facilitatorUrl);

      // Let x402-express middleware handle everything:
      // - If no x-payment header: returns 402 Payment Required
      // - If x-payment header present: verifies with facilitator
      // - If payment valid: calls next() to grant access
      paymentMW(req, res, next);
    } else {
      // Regular user - free access
      next();
    }
  };
}

