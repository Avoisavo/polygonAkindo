import "dotenv/config";
import { PAYMENT_ROUTES, PAYMENT_RECIPIENT_ADDRESS } from '../config/paymentConfig.js';

/**
 * Payment Handler for x402 Protocol
 * Handles payment-required responses and coordinates with frontend for user authorization
 */

/**
 * Get payment configuration for a given URL
 * @param {string} url - The URL being accessed
 * @returns {Object|null} - Payment configuration or null if not found
 */
function getPaymentConfigForUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Match against configured routes
    for (const [route, config] of Object.entries(PAYMENT_ROUTES)) {
      const [method, path] = route.split(' ');
      
      // Simple path matching (can be enhanced with regex)
      if (pathname === path || pathname.startsWith(path)) {
        return config;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing URL for payment config:', error);
    return null;
  }
}

/**
 * Parse x402 payment details from HTTP 402 response
 * @param {string} url - The URL that requires payment
 * @param {Object} response - Axios response object with 402 status
 * @returns {Object} - Parsed payment details
 */
export function parsePaymentDetails(url, response) {
  const headers = response.headers;
  
  // Get payment configuration from paymentConfig.js
  const paymentConfig = getPaymentConfigForUrl(url);
  
  // Use configured values with fallback to headers, then defaults
  const price = paymentConfig?.price || 
                headers['x-payment-price'] || 
                headers['x402-price'] || 
                '$0.01';
  
  const network = paymentConfig?.network || 
                  headers['x-payment-network'] || 
                  headers['x402-network'] || 
                  'polygon-amoy';
  
  const description = paymentConfig?.config?.description || 
                      headers['x-payment-description'] || 
                      headers['x402-description'] || 
                      'Access to protected content';
  
  const address = process.env.PAYMENT_ADDRESS || 
                  PAYMENT_RECIPIENT_ADDRESS || 
                  headers['x-payment-address'] || 
                  headers['x402-address'] || 
                  '';
  
  return {
    required: true,
    price: price,
    address: address,
    network: network,
    description: description,
    facilitatorUrl: process.env.FACILITATOR_URL || 
                    headers['x-payment-facilitator'] || 
                    headers['x402-facilitator'] || 
                    'https://x402-amoy.polygon.technology',
    nonce: headers['x-payment-nonce'] || headers['x402-nonce'] || '',
    paymentId: headers['x-payment-id'] || headers['x402-id'] || generatePaymentId()
  };
}

/**
 * Generate a unique payment ID for tracking
 * @returns {string} - Unique payment identifier
 */
function generatePaymentId() {
  return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a payment request object for the frontend
 * @param {string} url - The URL that requires payment
 * @param {Object} paymentDetails - Parsed payment details
 * @returns {Object} - Payment request for user authorization
 */
export function createPaymentRequest(url, paymentDetails) {
  return {
    type: 'PAYMENT_REQUEST',
    timestamp: new Date().toISOString(),
    url: url,
    payment: {
      id: paymentDetails.paymentId,
      price: paymentDetails.price,
      recipientAddress: paymentDetails.address,
      network: paymentDetails.network,
      description: paymentDetails.description,
      facilitatorUrl: paymentDetails.facilitatorUrl,
      nonce: paymentDetails.nonce
    },
    message: `This content requires payment of ${paymentDetails.price} to access. Please connect your wallet and authorize the transaction.`,
    instructions: {
      step1: 'Connect your wallet using the button in the header',
      step2: 'Review the payment details',
      step3: 'Approve the transaction in your wallet',
      step4: 'The agent will retry fetching the content after payment'
    }
  };
}

/**
 * Check if a response requires payment (HTTP 402)
 * @param {Object} response - Axios response object
 * @returns {boolean} - True if payment is required
 */
export function isPaymentRequired(response) {
  return response.status === 402;
}

/**
 * Main handler for payment-required responses
 * Coordinates the payment flow with the frontend
 * @param {string} url - The URL that requires payment
 * @param {Object} response - The 402 response from the server
 * @returns {Object} - Payment request object to return to frontend
 */
export function handlePaymentRequired(url, response) {
  console.log('💳 Payment required for:', url);
  
  const paymentDetails = parsePaymentDetails(url, response);
  const paymentRequest = createPaymentRequest(url, paymentDetails);
  
  // Store the pending payment so we can verify it later
  storePendingPayment(paymentRequest.payment.id, paymentRequest);
  
  console.log('📋 Payment details:', {
    price: paymentDetails.price,
    network: paymentDetails.network,
    recipient: paymentDetails.address,
    paymentId: paymentRequest.payment.id
  });
  
  return paymentRequest;
}

/**
 * Retry fetching content after payment has been made
 * This should be called after the user approves payment in the frontend
 * @param {string} url - The URL to fetch
 * @param {string} txHash - Transaction hash from user's wallet payment
 * @returns {Promise<Object>} - Scraped content data
 */
export async function retryWithPayment(url, txHash) {
  console.log('🔄 Retrying request with payment tx:', txHash);
  
  const axios = (await import('axios')).default;
  const cheerio = (await import('cheerio')).default;
  
  // After payment, use regular browser user-agent to access content
  // The payment was already made, so we bypass AI detection
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'X-Payment-Tx': txHash // Include payment proof for verification
    },
    timeout: 10000
  });
  
  // Parse the HTML content
  const $ = cheerio.load(response.data);
  
  // Remove unwanted elements
  $('script, style, nav, footer, .advertisement, .ads').remove();
  
  // Extract content
  const title = $('title').text().trim() || $('h1').first().text().trim() || 'No title';
  let content = $('main, article, .content, .post-content, body').first().text().trim();
  content = content.replace(/\s+/g, ' ').substring(0, 2000);
  
  return {
    success: true,
    title: title,
    content: content,
    url: url
  };
}

/**
 * Storage for pending payment requests
 * In production, this should be in a database or Redis
 */
const pendingPayments = new Map();

/**
 * Store a pending payment request
 * @param {string} paymentId - Unique payment identifier
 * @param {Object} paymentRequest - The payment request object
 */
export function storePendingPayment(paymentId, paymentRequest) {
  pendingPayments.set(paymentId, {
    ...paymentRequest,
    status: 'pending',
    createdAt: Date.now()
  });
  
  // Clean up after 10 minutes
  setTimeout(() => {
    if (pendingPayments.has(paymentId)) {
      pendingPayments.delete(paymentId);
      console.log('🗑️  Cleaned up expired payment request:', paymentId);
    }
  }, 10 * 60 * 1000);
}

/**
 * Get a pending payment request
 * @param {string} paymentId - Unique payment identifier
 * @returns {Object|null} - The payment request or null if not found
 */
export function getPendingPayment(paymentId) {
  return pendingPayments.get(paymentId) || null;
}

/**
 * Mark a payment as completed
 * @param {string} paymentId - Unique payment identifier
 * @param {string} txHash - Transaction hash
 */
export function markPaymentCompleted(paymentId, txHash) {
  const payment = pendingPayments.get(paymentId);
  if (payment) {
    payment.status = 'completed';
    payment.txHash = txHash;
    payment.completedAt = Date.now();
    console.log('✅ Payment marked as completed:', paymentId);
  }
}

