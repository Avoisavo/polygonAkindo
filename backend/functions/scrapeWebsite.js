import "dotenv/config";
import * as cheerio from 'cheerio';
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import { privateKeyToAccount } from "viem/accounts";
import { deductFunds, hasSufficientBalance } from "../services/userBalance.js";
import { parseEther } from "viem";

// Initialize agent's wallet
let agentAccount = null;
let fetchWithPayment = null;

function initializeAgentWallet() {
  if (!agentAccount) {
    const privateKey = process.env.AGENT_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('AGENT_PRIVATE_KEY not found in environment variables');
    }
    
    agentAccount = privateKeyToAccount(privateKey);
    fetchWithPayment = wrapFetchWithPayment(fetch, agentAccount);
    
    console.log('🤖 Agent wallet initialized:', agentAccount.address);
  }
  
  return fetchWithPayment;
}

/**
 * Scrape website content from a given URL
 * Uses x402-fetch to automatically pay when 402 is returned
 * @param {string} url - The website URL to scrape
 * @param {string} userId - User ID (wallet address) to charge for the service
 * @returns {Promise<Object>} - Scraped content with title, text, and metadata
 */
async function scrapeWebsite(url, userId = null) {
  try {
    console.log('🌐 Scraping website:', url);
    
    // Initialize agent wallet if not already done
    const agentFetch = initializeAgentWallet();
    
    console.log('🤖 Using agent wallet to fetch (will auto-pay if 402)');
    
    // Fetch with automatic payment handling
    // x402-fetch will:
    // 1. Make initial request with AI crawler user-agent
    // 2. If 402 received, automatically pay from agent wallet
    // 3. Retry with x-payment header
    // 4. Facilitator verifies payment automatically
    const response = await agentFetch(url, {
      headers: {
        'User-Agent': 'GPTBot/1.0 (+https://openai.com/gptbot)'
      }
    });

    // Check if request succeeded
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Check if payment was made
    let paymentMade = false;
    let paymentAmount = 0n;
    let paymentTx = null;
    
    const xPaymentResponse = response.headers.get("x-payment-response");
    if (xPaymentResponse) {
      try {
        const paymentData = decodeXPaymentResponse(xPaymentResponse);
        
        if (paymentData && paymentData.success) {
          paymentMade = true;
          paymentTx = paymentData.transaction;
          
          // Parse amount from payment data (assuming it's in the response)
          // For demo, using fixed amount - in production, parse from headers
          paymentAmount = parseEther("0.005"); // $0.005 in MATIC
          
          console.log('💰 Payment made:', paymentTx);
          console.log('   Amount:', paymentAmount.toString(), 'wei');
          
          // Deduct from user's balance if userId provided
          if (userId) {
            const success = deductFunds(userId, paymentAmount, `Scraping ${url}`, paymentTx);
            
            if (!success) {
              console.warn('⚠️  Could not deduct from user balance (insufficient funds)');
              // Note: Payment already made by agent, so we continue
              // In production, you might want to check balance BEFORE making the request
            }
          }
        }
      } catch (decodeError) {
        console.warn('⚠️  Could not decode payment response:', decodeError.message);
      }
    }

    // Get HTML content from response
    const html = await response.text();
    
    // Load HTML into cheerio for parsing
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('.advertisement').remove();
    $('.ads').remove();

    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'No title found';
    
    // Extract main content (try different selectors)
    let mainContent = '';
    
    // Try common content containers
    const contentSelectors = [
      'main',
      'article', 
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '.main-content'
    ];
    
    for (const selector of contentSelectors) {
      const content = $(selector).text().trim();
      if (content && content.length > mainContent.length) {
        mainContent = content;
      }
    }
    
    // If no main content found, get body text
    if (!mainContent) {
      mainContent = $('body').text().trim();
    }
    
    // Clean up the text
    mainContent = mainContent
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n')  // Clean up line breaks
      .trim();
    
    // Limit content length
    if (mainContent.length > 3000) {
      mainContent = mainContent.substring(0, 3000) + '... [content truncated]';
    }
    
    // Extract some metadata
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';
    
    const author = $('meta[name="author"]').attr('content') || 
                  $('[rel="author"]').text().trim() || '';

    const result = {
      success: true,
      url: url,
      title: title,
      description: description,
      author: author,
      content: mainContent,
      contentLength: mainContent.length,
      scrapedAt: new Date().toISOString(),
      paymentMade: paymentMade,
      paymentAmount: paymentMade ? paymentAmount.toString() : null,
      paymentTx: paymentTx
    };

    console.log('✅ Successfully scraped:', title);
    if (paymentMade) {
      console.log('💰 Cost:', paymentAmount.toString(), 'wei');
    }
    return result;

  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    
    return {
      success: false,
      url: url,
      error: error.message,
      scrapedAt: new Date().toISOString()
    };
  }
}

// Function metadata for AI agent
const metadata = {
  name: 'scrapeWebsite',
  description: 'Scrape content from a website URL and return the main text content. Agent will automatically pay for paywalled content.',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The website URL to scrape (must include http:// or https://)'
      },
      userId: {
        type: 'string',
        description: 'Optional: User ID to charge for the service (wallet address)'
      }
    },
    required: ['url']
  }
};

export {
  scrapeWebsite,
  metadata
};